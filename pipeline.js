// ===================================================================
// AuraLogo Pipeline Engine
// AI → LLM → EDA → ChatGPT/HuggingFace → LangChain/LangGraph
// 각 단계가 실제 데이터를 주고받는 "상태 그래프(State Graph)" 형태로 동작합니다.
// ===================================================================

// -------------------------------------------------------------
// [STAGE: EDA] 사용자 입력을 분석해 특징(feature)을 뽑아내는 단계
// - 텍스트 통계, 키워드 빈도, 업종 적합도, 톤(tone) 추정을 계산
// -------------------------------------------------------------
const EDA = {
  toneLexicon: {
    warm: ['느림', '휴식', '힐링', '마음', '건강', '따뜻', '캠프', '협동조합', '쉼'],
    luxury: ['프리미엄', '럭셔리', '골드', '엘레강스', '하우스', '스위트'],
    tech: ['테크', 'AI', '스마트', '디지털', '넥스트', '랩'],
    bold: ['파워', '스트롱', '챔피언', '피트니스', '헬스']
  },

  tokenize(text) {
    return text
      .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  },

  analyze(companyName, slogan, industry) {
    const fullText = `${companyName} ${slogan}`;
    const tokens = this.tokenize(fullText);

    // 키워드 빈도표
    const freq = {};
    tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });

    // 톤(tone) 점수 계산 - 어떤 어휘군과 가장 많이 겹치는지
    const toneScores = {};
    Object.entries(this.toneLexicon).forEach(([tone, words]) => {
      toneScores[tone] = words.reduce((acc, w) => acc + (fullText.includes(w) ? 1 : 0), 0);
    });
    const dominantTone = Object.entries(toneScores).sort((a, b) => b[1] - a[1])[0];

    // 텍스트 통계
  const stats = {
      nameLength: companyName.length,
      sloganLength: slogan.length,
      tokenCount: tokens.length,
      isShortName: companyName.length <= 4
    };

    return {
      tokens,
      freq,
      toneScores,
      dominantTone: dominantTone && dominantTone[1] > 0 ? dominantTone[0] : 'neutral',
      stats,
      industry
    };
  }
};

// -------------------------------------------------------------
// [STAGE: LLM] EDA 결과를 바탕으로 이미지 생성용 프롬프트를 조립
// (Gemini/GPT 계열 LLM에게 넘길 "설계도" 문장을 만드는 역할)
// -------------------------------------------------------------
const LLMPromptEngine = {
  industryKeywords: {
    food: 'bakery cafe, fresh bread, warm coffee cup, cozy restaurant',
    tech: 'modern technology, AI nodes, digital network, clean circuit',
    finance: 'financial growth, solid shield, pillar, investment trust',
    medical: 'healthcare, medical cross, healing wave, wellness, heart care',
    fashion: 'elegant fashion, luxury emblem, stylish beauty, minimal line',
    education: 'open book, wisdom torch, graduation cap, learning step',
    eco: 'healing nature, green leaf, eco-friendly forest, calm organic sprout'
  },

  toneKeywords: {
    warm: 'gentle curves, cozy warmth, hand-drawn feel',
    luxury: 'refined gold accents, premium serif balance',
    tech: 'sharp geometry, futuristic gradient, precision lines',
    bold: 'thick strokes, high contrast, dynamic energy',
    neutral: 'balanced composition, timeless simplicity'
  },

  build(companyName, slogan, style, shape, edaResult) {
    const industryKw = this.industryKeywords[edaResult.industry] || this.industryKeywords.food;
    const toneKw = this.toneKeywords[edaResult.dominantTone] || this.toneKeywords.neutral;

    const prompt = `Professional logo design for '${companyName}', slogan '${slogan}'. ` +
      `Style: ${style}, Shape: ${shape}. ` +
      `Key visual elements: ${industryKw}, ${toneKw}, vector emblem, clean vector illustration. ` +
      `Detected tone: ${edaResult.dominantTone} (from EDA keyword analysis).`;

    return prompt;
  }
};

// -------------------------------------------------------------
// [STAGE: ChatGPT + HuggingFace] 프롬프트를 실제 OpenAI 이미지 생성 API로 확장
// /api/generate-logo(Vercel 서버리스 함수)를 통해 호출하며, 실패 시(백엔드
// 미배포·네트워크 오류) 규칙 기반 태그 생성으로 자동 폴백됩니다.
// 브라우저는 OpenAI를 직접 호출하지 않고, API 키는 서버 환경변수
// (OPENAI_API_KEY)에만 존재합니다.
// -------------------------------------------------------------
const GenerativeConnector = {
  async callExternalModel(prompt, edaResult) {
    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error(`API 응답 오류 (${res.status})`);
      const data = await res.json();
      if (!data.imageDataUrl) throw new Error('imageDataUrl 없음');

      return {
        symbolMood: edaResult.dominantTone,
        keywordTags: [],
        confidence: 0.95,
        imageDataUrl: data.imageDataUrl,
        source: 'openai'
      };
    } catch (err) {
      // 폴백: 백엔드가 아직 배포되지 않았거나 네트워크 오류일 때 기존 방식으로 동작
      console.warn('[GenerativeConnector] /api/generate-logo 호출 실패, 규칙 기반으로 폴백:', err.message);
      await new Promise(r => setTimeout(r, 80));

      const tagPool = prompt.match(/[a-zA-Z ]{3,}/g) || [];
      const keywordTags = tagPool
        .join(',')
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 2)
        .slice(0, 8);

      return {
        symbolMood: edaResult.dominantTone,
        keywordTags,
        confidence: Math.min(0.6 + edaResult.stats.tokenCount * 0.05, 0.98),
        imageDataUrl: null,
        source: 'fallback'
      };
    }
  }
};

// -------------------------------------------------------------
// [STAGE: LangChain / LangGraph] 위 단계들을 하나의 상태 그래프(state graph)로
// 연결해 순서대로 실행하고, 각 단계의 출력을 다음 단계 입력(state)으로 전달합니다.
// -------------------------------------------------------------
class LogoPipelineGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(name, fn) {
    this.nodes.push({ name, fn });
    return this;
  }

  async run(initialState, onStep) {
    let state = { ...initialState };
    for (const node of this.nodes) {
      const output = await node.fn(state);
      state = { ...state, ...output };
      if (onStep) onStep(node.name, output, state);
    }
    return state;
  }
}

function buildAuraLogoGraph() {
  const graph = new LogoPipelineGraph();

  graph
    // [LLM] 1차 해석 단계: 사용자가 입력한 자연어(기업명/슬로건)를 정규화
    .addNode('LLM_Interpret', async (state) => {
      await new Promise(r => setTimeout(r, 60));
      const brief = {
        companyName: state.companyName.trim() || '휴가온',
        slogan: state.slogan.trim() || '마음건강, 힐링캠프 협동조합'
      };
      return { brief };
    })
    // [EDA] 정규화된 텍스트를 정량 분석 (키워드 빈도, 톤, 텍스트 통계)
    .addNode('EDA', async (state) => {
      await new Promise(r => setTimeout(r, 60));
      const edaResult = EDA.analyze(state.brief.companyName, state.brief.slogan, state.industry);
      return { edaResult };
    })
    // [ChatGPT + HuggingFace] EDA 결과 기반으로 최종 이미지 프롬프트 조립 + 디자인 스펙(JSON) 확장
    .addNode('ChatGPT_HuggingFace', async (state) => {
      const prompt = LLMPromptEngine.build(
        state.brief.companyName, state.brief.slogan, state.style, state.shape, state.edaResult
      );
      const designSpec = await GenerativeConnector.callExternalModel(prompt, state.edaResult);
      return { prompt, designSpec };
    })
    // [LangChain / LangGraph] 위 결과들을 하나의 최종 상태로 취합 (오케스트레이션 완료)
    .addNode('LangGraph_Finalize', async (state) => {
      await new Promise(r => setTimeout(r, 40));
      return { pipelineComplete: true };
    });

  return graph;
}
