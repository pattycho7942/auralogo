// AuraLogo - Advanced Procedural Logo Generation Engine

const colorThemes = [
  { id: 'ocean', name: '오션 블루', colors: ['#2563eb', '#3b82f6', '#93c5fd'], bg: '#ffffff' },
  { id: 'forest', name: '에메랄드', colors: ['#059669', '#10b981', '#6ee7b7'], bg: '#ffffff' },
  { id: 'sunset', name: '선셋 골드', colors: ['#d97706', '#f59e0b', '#fde047'], bg: '#ffffff' },
  { id: 'ruby', name: '루비 레드', colors: ['#dc2626', '#ef4444', '#fca5a5'], bg: '#ffffff' },
  { id: 'cyber', name: '네온 퍼플', colors: ['#7c3aed', '#8b5cf6', '#c4b5fd'], bg: '#ffffff' },
  { id: 'luxury', name: '골드 & 블랙', colors: ['#b45309', '#d97706', '#fde047'], bg: '#111827' },
  { id: 'corporate', name: '스틸 그레이', colors: ['#475569', '#64748b', '#cbd5e1'], bg: '#ffffff' },
];

let selectedTheme = colorThemes[0];
let currentSalt = Math.floor(Math.random() * 1000000);

function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function initColorPicker() {
  const grid = document.getElementById('colorPickerGrid');
  if (!grid) return;
  grid.innerHTML = '';

  colorThemes.forEach((theme, index) => {
    const btn = document.createElement('div');
    btn.className = `color-option ${index === 0 ? 'selected' : ''}`;
    btn.style.background = `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`;
    btn.title = theme.name;
    btn.onclick = () => {
      document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTheme = theme;
    };
    grid.appendChild(btn);
  });
}

// 확장된 아이콘 풀 (베이커리/카페 아이콘 강화)
const industryIconPools = {
  food: [
    // 1. 따스한 식빵 / 베이커리 빵 아이콘
    `<path d="M6 10 C6 6, 18 6, 18 10 C20 10, 21 18, 18 19 C18 20, 6 20, 6 19 C3 18, 4 10, 6 10 Z" stroke-width="2" stroke-linecap="round"/>
     <path d="M9 11 M9 13 L11 17 M13 13 L15 17" stroke-width="1.5" stroke-linecap="round"/>`,
    // 2. 커피 잔 & 따뜻한 스팀
    `<path d="M4 11h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5zM16 13h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2" stroke-width="2"/>
     <path d="M7 6c0-1 1-2 1-3M12 6c0-1 1-2 1-3" stroke-width="1.5" stroke-linecap="round"/>`,
    // 3. 밀 이삭 (Wheat)
    `<path d="M12 2v20M12 6c1.5-1.5 3-1 3 1s-1.5 3-3 3M12 6c-1.5-1.5-3-1-3 1s1.5 3 3 3M12 11c1.5-1.5 3-1 3 1s-1.5 3-3 3M12 11c-1.5-1.5-3-1-3 1s1.5 3 3 3" stroke-width="2" stroke-linecap="round"/>`,
    // 4. 크루아상 / 베이커리 엠블럼
    `<path d="M12 4 C6 4 3 9 3 14 C3 18 6 20 12 20 C18 20 21 18 21 14 C21 9 18 4 12 4 Z" stroke-width="2"/>
     <path d="M8 8 C10 12 14 12 16 8" stroke-width="1.5"/>`
  ],
  tech: [
    `<path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2" stroke-linecap="round"/>
     <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round"/>`
  ],
  finance: [
    `<path d="M18 20V10M12 20V4M6 20v-6" stroke-width="2.5" stroke-linecap="round"/>
     <path d="M3 20h18" stroke-width="2"/>`
  ],
  medical: [
    `<path d="M12 4v16M4 12h16" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M12 21C7 17 3 13.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 8-9 12z" stroke-width="2" stroke-linecap="round"/>`
  ],
  fashion: [
    `<path d="M8 4l4 3 4-3 3 4-3 2v11H8V10L5 8z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M12 3c-3 3-3 6 0 9s3 6 0 9" stroke-width="1.8" stroke-linecap="round"/>`
  ],
  education: [
    `<path d="M2 8l10-4 10 4-10 4-10-4z" stroke-width="1.8" stroke-linejoin="round"/>
     <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke-width="1.6"/>`,
    `<path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke-width="1.8"/>
     <path d="M8 9h6M8 13h6" stroke-width="1.4" stroke-linecap="round"/>`
  ],
  eco: [
    `<path d="M12 21c-4-2-7-6-7-11 5 0 9 2 9 7 0-5 4-7 9-7 0 5-3 9-7 11" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M12 3C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-10z" stroke-width="1.8"/>`
  ]
};

// 특정 키워드(동물/사물 등)가 기업명·슬로건·디자인 태그에서 감지되면
// 업종 기본 아이콘 대신 사용할 전용 심볼 풀. ChatGPT+HuggingFace 단계에서
// 만든 designSpec.keywordTags를 실제로 아이콘 선택에 반영하기 위해 추가함.
const keywordIconPool = {
  sloth: `<path d="M12 3c-4.5 0-7 3-7 7 0 3 1.5 5 3 6-.5 1-.5 2 .5 2.5 1 .5 2-.5 2-1.5.5.5 1.5.5 2 0 0 1 1 2 2 1.5 1-.5 1-1.5.5-2.5 1.5-1 3-3 3-6 0-4-2.5-7-7-7z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="9.5" cy="9.5" r="1" fill="currentColor" stroke="none"/>
     <circle cx="14.5" cy="9.5" r="1" fill="currentColor" stroke="none"/>
     <path d="M9 13c1 1 5 1 6 0" stroke-width="1.4" stroke-linecap="round"/>`,
  cat: `<path d="M5 4l2 4h10l2-4-3 3H8z" stroke-width="1.6" stroke-linejoin="round"/>
     <path d="M6 8h12v6a6 6 0 0 1-12 0V8z" stroke-width="1.8"/>
     <path d="M9 13h.01M15 13h.01" stroke-width="2" stroke-linecap="round"/>`,
  dog: `<path d="M4 10c0-3 3-6 8-6s8 3 8 6-2 9-8 9-8-6-8-9z" stroke-width="1.8"/>
     <path d="M6 6L3 3M18 6l3-3" stroke-width="1.6" stroke-linecap="round"/>`,
  bear: `<circle cx="12" cy="13" r="7" stroke-width="1.8"/>
     <circle cx="7" cy="6" r="2" stroke-width="1.6"/>
     <circle cx="17" cy="6" r="2" stroke-width="1.6"/>`,
  bird: `<path d="M4 12c3-6 9-8 15-6-2 1-3 2-3 4 3 0 4 2 4 3-4 1-6 0-7-1-1 3-4 6-9 6 2-2 3-4 3-6-2 1-3 1-3 0z" stroke-width="1.6" stroke-linejoin="round"/>`,
  rabbit: `<path d="M9 4c-1-2-3-2-3 1 0 2 1 4 2 5M15 4c1-2 3-2 3 1 0 2-1 4-2 5" stroke-width="1.6" stroke-linecap="round"/>
     <circle cx="12" cy="14" r="7" stroke-width="1.8"/>`,
  flower: `<circle cx="12" cy="12" r="3" stroke-width="1.6"/>
     <circle cx="12" cy="5" r="3" stroke-width="1.4"/><circle cx="19" cy="12" r="3" stroke-width="1.4"/>
     <circle cx="12" cy="19" r="3" stroke-width="1.4"/><circle cx="5" cy="12" r="3" stroke-width="1.4"/>`
};

// 한글 표기 -> 키워드 아이콘 매핑 (기업명/슬로건은 한글로 들어오는 경우가 많음)
const koreanKeywordMap = {
  '늘보': 'sloth', '나무늘보': 'sloth',
  '고양이': 'cat', '냥이': 'cat',
  '강아지': 'dog', '멍멍이': 'dog',
  '곰': 'bear',
  '새': 'bird',
  '토끼': 'rabbit',
  '꽃': 'flower'
};

// 기업명/슬로건(한글) + ChatGPT/HuggingFace 디자인 스펙 태그(영문)에서
// 키워드 아이콘을 탐지. 매칭되면 업종 기본 아이콘 대신 이 아이콘을 사용한다.
function detectKeywordIcon(companyName, slogan, keywordTags) {
  const text = `${companyName} ${slogan}`;
  for (const [kr, iconKey] of Object.entries(koreanKeywordMap)) {
    if (text.includes(kr) && keywordIconPool[iconKey]) return keywordIconPool[iconKey];
  }
  if (Array.isArray(keywordTags)) {
    for (const tag of keywordTags) {
      const key = tag.toLowerCase().trim();
      if (keywordIconPool[key]) return keywordIconPool[key];
    }
  }
  return null;
}

// 파이프라인 실행 결과를 담아두는 전역 상태 (마지막 EDA/ChatGPT+HF 결과를 로고 생성 단계에서 재사용)
let pipelineState = null;

// 1단계: 프롬프트 자동 생성 - LangGraph 파이프라인(LLM_Interpret → EDA → ChatGPT/HuggingFace)을 실제로 실행
async function generateAIPrompt() {
  const companyName = document.getElementById('companyName').value;
  const slogan = document.getElementById('slogan').value;
  const industry = document.getElementById('industry').value;
  const style = document.getElementById('logoStyle').value;
  const shape = document.getElementById('logoShape').value;

  const graph = buildAuraLogoGraph({ generateImage: false });

  const finalState = await graph.run(
    { companyName, slogan, industry, style, shape },
    (nodeName, output) => {
      // 각 노드가 끝날 때마다 해당 워크플로 단계 배지를 활성화 + 로그 패널에 결과 표시
      activateWorkflowStep(nodeName);
      logPipelineStep(nodeName, output);
    }
  );

  pipelineState = finalState; // EDA 분석 결과, ChatGPT/HF 디자인 스펙을 로고 생성 단계에서 재사용

  const promptInput = document.getElementById('promptInput');
  const promptSection = document.getElementById('promptSection');

  if (promptInput) {
    promptInput.value = finalState.prompt;
  }
  if (promptSection) {
    promptSection.style.display = 'flex';
  }
}

function compileProceduralSymbol(companyName, slogan, industry, style, shapeType, primaryColor, secondaryColor, variantId, keywordTags, imageDataUrl) {
  // OpenAI 이미지 생성이 성공한 경우: 벡터 아이콘 대신 실제 생성 이미지를 사용
  if (imageDataUrl) {
    return `
      <g class="symbol-content">
        <image x="0" y="0" width="24" height="24" href="${imageDataUrl}" preserveAspectRatio="xMidYMid slice"/>
      </g>
    `;
  }

  const keywordIcon = detectKeywordIcon(companyName, slogan, keywordTags);
  let iconBase = keywordIcon;

  if (!iconBase) {
    const seed = getHash(companyName + slogan + style + shapeType + variantId + currentSalt);
    const pool = industryIconPools[industry] || industryIconPools['food'];
    iconBase = pool[seed % pool.length];
  }

  return `
    <g class="symbol-content">
      <g stroke-linecap="round" stroke-linejoin="round">
        ${iconBase}
      </g>
    </g>
  `;
}

function getLogoSVG(variantId, companyName, slogan, industry, style, shapeType, colors, isDarkBg = false, keywordTags = [], imageDataUrl = null) {
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  const textColor = isDarkBg ? '#ffffff' : '#0f172a';
  const subtextColor = isDarkBg ? '#94a3b8' : '#64748b';
  const containerBg = isDarkBg ? '#0b0f19' : '#ffffff';

  const symbolSVG = compileProceduralSymbol(companyName, slogan, industry, style, shapeType, primaryColor, secondaryColor, variantId, keywordTags, imageDataUrl);

  const defs = `
    <defs>
      <linearGradient id="grad-${variantId}-${currentSalt}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>
    </defs>
  `;

  let svgContent = '';

  switch (variantId) {
    case 'v1':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <g transform="translate(45, 60)">
            <g stroke="url(#grad-${variantId}-${currentSalt})" fill="none" transform="scale(3.2)">
              ${symbolSVG}
            </g>
            <g transform="translate(105, 35)">
              <text font-family="'Outfit', sans-serif" font-size="34" font-weight="800" fill="${textColor}">${companyName}</text>
              <text font-family="'Outfit', sans-serif" font-size="13" font-weight="600" fill="${subtextColor}" letter-spacing="3" y="28">${slogan.toUpperCase()}</text>
            </g>
          </g>
        </svg>
      `;
      break;

    case 'v2':
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <circle cx="200" cy="150" r="75" fill="none" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="4"/>
          <circle cx="200" cy="150" r="67" fill="none" stroke="${secondaryColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 3"/>
          <g transform="translate(164, 114) scale(3)">
            <g stroke="url(#grad-${variantId}-${currentSalt})" fill="none">
              ${symbolSVG}
            </g>
          </g>
          <text x="200" y="275" font-family="'Outfit', sans-serif" font-size="30" font-weight="800" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="200" y="305" font-family="'Outfit', sans-serif" font-size="12" font-weight="600" fill="${subtextColor}" letter-spacing="3" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;

    case 'v3': {
      // 모노그램 이니셜
      const initial = companyName.trim().charAt(0) || 'A';
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <rect x="130" y="70" width="140" height="140" rx="24" transform="rotate(45 200 140)" fill="none" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="4"/>
          <text x="200" y="165" font-family="'Outfit', sans-serif" font-size="70" font-weight="800" fill="${textColor}" text-anchor="middle">${initial}</text>
          <text x="200" y="275" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="200" y="303" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="${subtextColor}" letter-spacing="3" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    case 'v4': {
      // 라인 워드마크 (아이콘 없이 타이포그래피 중심)
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <line x1="60" y1="120" x2="440" y2="120" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="2"/>
          <text x="250" y="105" font-family="'Outfit', sans-serif" font-size="40" font-weight="700" letter-spacing="4" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="250" y="140" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" letter-spacing="4" fill="${subtextColor}" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    case 'v5': {
      // 이니셜 포인트 레터링 (첫 글자만 강조 색상)
      const first = companyName.trim().charAt(0) || 'A';
      const rest = companyName.trim().slice(1);
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <text x="250" y="115" font-family="'Outfit', sans-serif" font-size="46" font-weight="800" text-anchor="middle">
            <tspan fill="url(#grad-${variantId}-${currentSalt})">${first}</tspan><tspan fill="${textColor}">${rest}</tspan>
          </text>
          <text x="250" y="148" font-family="'Outfit', sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="${subtextColor}" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    case 'v6': {
      // 기하학 추상 심볼
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <polygon points="200,70 260,140 230,230 170,230 140,140" fill="none" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="4" stroke-linejoin="round"/>
          <circle cx="200" cy="160" r="22" fill="${secondaryColor}" opacity="0.85"/>
          <text x="200" y="280" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="200" y="308" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="${subtextColor}" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    case 'v7': {
      // 다크 추상 심볼형 (v6의 다크 변형, 이중 링 강조)
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <polygon points="200,60 270,140 235,240 165,240 130,140" fill="none" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="3"/>
          <polygon points="200,100 240,150 220,215 180,215 160,150" fill="${secondaryColor}" opacity="0.25"/>
          <text x="200" y="285" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="200" y="312" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="${subtextColor}" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    case 'v8': {
      // 다크 프리미엄 엠블럼 (방패형)
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420" width="100%" height="100%">
          ${defs}
          <rect width="100%" height="100%" fill="${containerBg}" rx="12"/>
          <path d="M200 60 L280 90 V190 C280 250 245 290 200 315 C155 290 120 250 120 190 V90 Z" fill="none" stroke="url(#grad-${variantId}-${currentSalt})" stroke-width="4"/>
          <g transform="translate(164, 114) scale(3)">
            <g stroke="url(#grad-${variantId}-${currentSalt})" fill="none">
              ${symbolSVG}
            </g>
          </g>
          <text x="200" y="360" font-family="'Outfit', sans-serif" font-size="26" font-weight="800" fill="${textColor}" text-anchor="middle">${companyName}</text>
          <text x="200" y="386" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="${subtextColor}" text-anchor="middle">${slogan.toUpperCase()}</text>
        </svg>
      `;
      break;
    }

    default:
      svgContent = getLogoSVG('v1', companyName, slogan, industry, style, shapeType, colors, isDarkBg, keywordTags, imageDataUrl);
      break;
  }

  return svgContent;
}

const recommendationMap = {
  modern: [
    { id: 'v1', title: '베이커리 감성 가로형', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
    { id: 'v2', title: '베이커리 원형 엠블럼', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: false },
    { id: 'v1', title: '다크 감성 로고형', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: true }
  ]
};

// 2단계: 프롬프트 기반 로고 최종 생성 - LangGraph 파이프라인의 EDA/ChatGPT+HF 결과를 반영
async function generateLogos(runFullPipeline = false) {
  const companyName = document.getElementById('companyName').value.trim() || '휴가온';
  const slogan = document.getElementById('slogan').value.trim() || '마음건강, 힐링캠프 협동조합';
  const industry = document.getElementById('industry').value;
  const style = document.getElementById('logoStyle').value;
  const shapeType = document.getElementById('logoShape').value; // 사용자가 선택한 로고 형태
  const colors = selectedTheme.colors;

  // 파이프라인 결과가 없거나(최초 로드) 강제 재실행 요청 시, EDA→ChatGPT/HF까지 다시 수행
  const requestSignature = JSON.stringify({ companyName, slogan, industry, style, shapeType });
  if (runFullPipeline) {
    if (pipelineState && pipelineState.__signature === requestSignature && pipelineState.designSpec?.images) {
      // 입력값이 그대로면 다시 돈 쓰지 않고 직전 생성 결과를 재사용
      activateWorkflowStep('LLM_Interpret');
      activateWorkflowStep('EDA');
      activateWorkflowStep('ChatGPT_HuggingFace');
      activateWorkflowStep('LangGraph_Finalize');
      logPipelineStep('LLM_Interpret', { brief: { companyName, slogan } });
      logPipelineStep('EDA', pipelineState);
      logPipelineStep('ChatGPT_HuggingFace', pipelineState);
      showToast('입력값이 그대로라 이전 생성 결과를 재사용했습니다 (API 비용 절약).');
    } else {
      const graph = buildAuraLogoGraph({ generateImage: true });
      pipelineState = await graph.run(
        { companyName, slogan, industry, style, shape: shapeType },
        (nodeName, output) => {
          activateWorkflowStep(nodeName);
          logPipelineStep(nodeName, output);
        }
      );
      pipelineState.__signature = requestSignature;
    }
  }

  // 기본 스타일 기반 추천 목록
  let recommendedVariants = [...(recommendationMap[style] || recommendationMap['modern'])];

  // [핵심 보완] 사용자가 선택한 '로고 형태(shapeType)'에 따른 레이아웃 우선 적용
  if (shapeType === 'lettering') {
    // 레터링 선택 시: 아이콘을 배제하고 텍스트/타이포그래피 중심 레이아웃(v4, v5, v3) 출력
    recommendedVariants = [
      { id: 'v4', title: '라인 워드마크 레터링 (Wordmark)', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
      { id: 'v5', title: '이니셜 포인트 레터링 (Accent Typo)', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: false },
      { id: 'v3', title: '모노그램 이니셜 레터링 (Monogram)', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
    ];
  } else if (shapeType === 'emblem') {
    // 엠블럼 선택 시: 방패/원형 테두리 엠블럼 레이아웃(v2, v8) 출력
    recommendedVariants = [
      { id: 'v2', title: '클래식 힐링 엠블럼 (Emblem Badge)', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
      { id: 'v8', title: '다크 프리미엄 엠블럼 (Dark Emblem)', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: true },
      { id: 'v3', title: '엠블럼 모노그램 (Emblem Monogram)', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
    ];
  } else if (shapeType === 'abstract') {
    // 추상/기하학 선택 시: 기하학 심볼 레이아웃(v6) 출력
    recommendedVariants = [
      { id: 'v6', title: '기하학 추상 심볼 (Geometric)', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
      { id: 'v1', title: '추상 심볼 가로형', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: false },
      { id: 'v7', title: '다크 추상 심볼형', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: true }
    ];
  } else if (shapeType === 'character') {
    // 캐릭터/심볼형 선택 시: 아이콘이 크게 드러나는 원형·엠블럼 레이아웃 출력
    recommendedVariants = [
      { id: 'v2', title: '심볼 중심 원형 뱃지', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
      { id: 'v8', title: '다크 심볼 엠블럼', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: true },
      { id: 'v1', title: '심볼 가로형', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
    ];
  } else if (shapeType === 'auto') {
    // [ChatGPT+HuggingFace / EDA 활용] 텍스트 톤 분석 결과(dominantTone)에 따라 형태를 자동 추천
    const tone = pipelineState?.edaResult?.dominantTone || 'neutral';
    const toneToLayout = {
      warm: [
        { id: 'v2', title: 'AI 자동추천 · 따뜻한 원형 엠블럼', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
        { id: 'v1', title: 'AI 자동추천 · 가로형', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: false },
        { id: 'v5', title: 'AI 자동추천 · 포인트 레터링', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
      ],
      luxury: [
        { id: 'v8', title: 'AI 자동추천 · 프리미엄 엠블럼', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: true },
        { id: 'v3', title: 'AI 자동추천 · 모노그램', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: false },
        { id: 'v4', title: 'AI 자동추천 · 워드마크', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
      ],
      tech: [
        { id: 'v6', title: 'AI 자동추천 · 기하학 심볼', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
        { id: 'v7', title: 'AI 자동추천 · 다크 추상형', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: true },
        { id: 'v1', title: 'AI 자동추천 · 가로형', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
      ],
      bold: [
        { id: 'v3', title: 'AI 자동추천 · 임팩트 모노그램', badge: 'AI 추천 1순위', badgeClass: 'badge-rank-1', isDark: false },
        { id: 'v8', title: 'AI 자동추천 · 다크 엠블럼', badge: 'AI 추천 2순위', badgeClass: 'badge-rank-2', isDark: true },
        { id: 'v6', title: 'AI 자동추천 · 기하학 심볼', badge: 'AI 추천 3순위', badgeClass: 'badge-rank-3', isDark: false }
      ],
      neutral: recommendedVariants
    };
    recommendedVariants = toneToLayout[tone] || recommendedVariants;
  }

  const grid = document.getElementById('logoGrid');
  if (!grid) return;
  grid.innerHTML = '';

  recommendedVariants.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = `logo-card ${v.isDark ? 'dark-theme-card' : ''}`;

    const keywordTags = pipelineState?.designSpec?.keywordTags || [];
    const images = pipelineState?.designSpec?.images || null;
    // 카드마다 서로 다른 생성 이미지를 배정 (없으면 null → 기존 아이콘 매칭으로 폴백)
    // 병렬 생성된 서로 다른 이미지를 카드마다 배정 (부족하면 마지막 이미지 재사용)
    const imageDataUrl = images ? (images[index] || images[images.length - 1]) : null;
    const svgCode = getLogoSVG(v.id, companyName, slogan, industry, style, shapeType, colors, v.isDark, keywordTags, imageDataUrl);

    card.innerHTML = `
      <span class="recommendation-badge ${v.badgeClass}">${v.badge}</span>
      <div class="logo-card-header">
        <span class="logo-card-title">${v.title}</span>
        <i class="lucide-sparkles" style="width: 16px; height: 16px; color: #3b82f6;"></i>
      </div>
      <div class="logo-card-body" id="container-${v.id}">
        ${svgCode}
      </div>
      <div class="logo-card-footer">
        <div class="dropdown" id="dropdown-${v.id}">
          <button class="btn-dropdown" onclick="toggleDropdown('${v.id}')">
            <i class="lucide-download" style="width: 15px; height: 15px;"></i>
            <span>내보내기</span>
            <i class="lucide-chevron-down" style="width: 12px; height: 12px; margin-left: auto;"></i>
          </button>
          <div class="dropdown-menu">
            <button class="dropdown-item" onclick="downloadLogo('${v.id}', 'svg')">
              <span>SVG 벡터</span>
              <span class="format-badge">SVG</span>
            </button>
            <button class="dropdown-item" onclick="downloadLogo('${v.id}', 'png-high')">
              <span>고해상도 (1024x1024)</span>
              <span class="format-badge">PNG</span>
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// LangGraph 노드 이름 -> 화면 워크플로 배지 id 매핑
const nodeToStepId = {
  LLM_Interpret: 'step-llm',
  EDA: 'step-eda',
  ChatGPT_HuggingFace: 'step-hugging',
  LangGraph_Finalize: 'step-lang'
};

function resetWorkflowSteps() {
  const steps = ['step-ai', 'step-llm', 'step-eda', 'step-hugging', 'step-lang'];
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  // AI(입력 수집) 단계는 파이프라인 시작과 동시에 항상 활성화
  const aiEl = document.getElementById('step-ai');
  if (aiEl) aiEl.classList.add('active');
  currentSalt = Math.floor(Math.random() * 1000000);
  clearPipelineLog();
}

function showLoadingBanner(text) {
  const banner = document.getElementById('loadingBanner');
  const textEl = document.getElementById('loadingBannerText');
  if (textEl) textEl.textContent = text;
  if (banner) banner.style.display = 'flex';
}

function hideLoadingBanner() {
  const banner = document.getElementById('loadingBanner');
  if (banner) banner.style.display = 'none';
}

// 그래프의 각 노드가 완료될 때마다 실제로 해당 배지를 켠다 (더 이상 고정 setTimeout 애니메이션이 아님)
function activateWorkflowStep(nodeName) {
  const stepId = nodeToStepId[nodeName];
  const el = stepId && document.getElementById(stepId);
  if (el) el.classList.add('active');
}

// 각 파이프라인 단계의 실제 출력을 로그 패널에 표시 ("어디서 무엇을 했는지" 확인용)
function clearPipelineLog() {
  const log = document.getElementById('pipelineLog');
  if (log) log.innerHTML = '';
}

const stepLabels = {
  LLM_Interpret: '① LLM · 입력 정규화',
  EDA: '② EDA · 텍스트/톤 분석',
  ChatGPT_HuggingFace: '③ ChatGPT+HuggingFace · 프롬프트&디자인 스펙 생성',
  LangGraph_Finalize: '④ LangChain/LangGraph · 오케스트레이션 완료'
};

function logPipelineStep(nodeName, output) {
  const log = document.getElementById('pipelineLog');
  if (!log) return;
  const label = stepLabels[nodeName] || nodeName;
  const summary = summarizeStepOutput(nodeName, output);
  const item = document.createElement('div');
  item.className = 'pipeline-log-item';
  item.innerHTML = `<strong>${label}</strong><span>${summary}</span>`;
  log.appendChild(item);
}

function summarizeStepOutput(nodeName, output) {
  switch (nodeName) {
    case 'LLM_Interpret':
      return `정규화된 브리프: "${output.brief.companyName} / ${output.brief.slogan}"`;
    case 'EDA':
      return `감지된 톤: ${output.edaResult.dominantTone}, 키워드 수: ${output.edaResult.tokens.length}`;
    case 'ChatGPT_HuggingFace':
      if (output.designSpec.source === 'prompt-only') {
        return '프롬프트 텍스트만 생성 (이미지 생성은 로고 생성 버튼에서 진행)';
      }
      return (output.designSpec.images && output.designSpec.images.length > 0)
        ? `OpenAI 이미지 ${output.designSpec.images.length}장 병렬 생성 성공 (신뢰도 ${(output.designSpec.confidence * 100).toFixed(0)}%)`
        : `백엔드 미연결 - 규칙 기반 태그로 폴백: ${output.designSpec.keywordTags.slice(0, 4).join(', ') || '없음'}`;
    case 'LangGraph_Finalize':
      return `전체 파이프라인 상태 취합 완료 → 시안 렌더링으로 전달`;
    default:
      return '';
  }
}

// 내보내기 드롭다운 열기/닫기
let openDropdownState = null; // { menu, originalParent, dropdownEl }

function closeOpenDropdown() {
  if (!openDropdownState) return;
  const { menu, originalParent, dropdownEl } = openDropdownState;
  dropdownEl.classList.remove('open');
  if (menu && originalParent) {
    menu.classList.remove('open');
    originalParent.appendChild(menu); // 원래 있던 카드 안으로 되돌려놓음
    menu.style.position = '';
    menu.style.left = '';
    menu.style.width = '';
    menu.style.bottom = '';
    menu.style.marginBottom = '';
  }
  openDropdownState = null;
}

function toggleDropdown(variantId) {
  const dropdown = document.getElementById(`dropdown-${variantId}`);
  if (!dropdown) return;
  const wasOpenForThisCard = openDropdownState && openDropdownState.dropdownEl === dropdown;
  closeOpenDropdown();
  if (wasOpenForThisCard) return; // 같은 카드에서 다시 누르면 닫기만 하고 종료

  const btn = dropdown.querySelector('.btn-dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  if (!btn || !menu) return;

  // 카드에 overflow:hidden + hover 시 transform이 걸려 있어서,
  // position:fixed를 걸어도 그 조상(transform 적용된 카드) 기준으로 계산되어 잘려 보이는 문제가 있었음.
  // → 메뉴 DOM 자체를 <body> 바로 아래로 옮겨서 카드의 영향을 완전히 벗어나게 함.
  const rect = btn.getBoundingClientRect();
  const originalParent = menu.parentElement;
  document.body.appendChild(menu);
  menu.style.position = 'fixed';
  menu.style.left = `${rect.left}px`;
  menu.style.width = `${rect.width}px`;
  menu.style.bottom = `${window.innerHeight - rect.top + 8}px`;
  menu.style.marginBottom = '0';

  dropdown.classList.add('open');
  // body로 재부모화되면 .dropdown.open .dropdown-menu 선택자가 더 이상 안 먹으므로
  // 메뉴 자신에게도 open 클래스를 붙여 별도 CSS 규칙(.dropdown-menu.open)으로 보이게 함
  menu.classList.add('open');
  openDropdownState = { menu, originalParent, dropdownEl: dropdown };
}

// 드롭다운 바깥을 클릭하면 닫기 (메뉴가 body로 옮겨져 있을 수 있으므로 메뉴 자체도 함께 체크)
document.addEventListener('click', (e) => {
  if (!openDropdownState) return;
  const { menu, dropdownEl } = openDropdownState;
  if (dropdownEl.contains(e.target) || (menu && menu.contains(e.target))) return;
  closeOpenDropdown();
});

// 스크롤하면 좌표가 어긋나므로 닫아버림
document.addEventListener('scroll', () => {
  closeOpenDropdown();
}, true);

function getSafeFileName() {
  const name = (document.getElementById('companyName')?.value || 'auralogo').trim();
  return name.replace(/[^a-zA-Z0-9가-힣]+/g, '_') || 'auralogo';
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// SVG 벡터 / 고해상도 PNG 내보내기
function downloadLogo(variantId, format) {
  const container = document.getElementById(`container-${variantId}`);
  const svgEl = container?.querySelector('svg');
  if (!svgEl) return;

  const fileBase = `${getSafeFileName()}_${variantId}`;
  const svgString = new XMLSerializer().serializeToString(svgEl);

  if (format === 'svg') {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${fileBase}.svg`);
    URL.revokeObjectURL(url);
    showToast('SVG 파일이 다운로드되었습니다.');
  } else if (format === 'png-high') {
    const viewBox = (svgEl.getAttribute('viewBox') || '0 0 500 200').split(/\s+/).map(Number);
    const [, , vw, vh] = viewBox;
    const targetWidth = 1024;
    const targetHeight = Math.round(1024 * (vh / vw));

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('PNG 변환에 실패했습니다.');
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        triggerDownload(pngUrl, `${fileBase}.png`);
        URL.revokeObjectURL(pngUrl);
        showToast('고해상도 PNG가 다운로드되었습니다.');
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      showToast('PNG 변환 중 오류가 발생했습니다.');
    };

    img.src = svgUrl;
  }

  closeOpenDropdown();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;
  msgEl.innerText = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  initColorPicker();

  // 1. AI 프롬프트 생성 버튼 - LLM_Interpret → EDA → ChatGPT/HuggingFace 파이프라인 실행
  const genPromptBtn = document.getElementById('generatePromptBtn');
  if (genPromptBtn) {
    const originalPromptBtnHTML = genPromptBtn.innerHTML;
    genPromptBtn.addEventListener('click', async () => {
      if (!document.getElementById('companyName').value.trim()) {
        showToast('기업명을 입력해 주세요.');
        return;
      }
      resetWorkflowSteps();
      genPromptBtn.disabled = true;
      genPromptBtn.innerHTML = '<span>AI 분석 중...</span>';
      showLoadingBanner('AI 프롬프트를 생성하고 있습니다...');
      try {
        await generateAIPrompt();
      } catch (err) {
        showToast('프롬프트 생성 중 오류가 발생했습니다: ' + err.message);
      } finally {
        genPromptBtn.disabled = false;
        genPromptBtn.innerHTML = originalPromptBtnHTML;
        hideLoadingBanner();
      }
    });
  }

  // 2. 최종 프롬프트 기반 로고 생성 버튼 - 파이프라인 재실행 후 EDA/디자인 스펙 반영해 시안 렌더링
  const genLogoBtn = document.getElementById('generateLogoBtn');
  if (genLogoBtn) {
    const originalLogoBtnHTML = genLogoBtn.innerHTML;
    genLogoBtn.addEventListener('click', async () => {
      if (!document.getElementById('companyName').value.trim()) {
        showToast('기업명을 입력해 주세요.');
        return;
      }
      resetWorkflowSteps();
      genLogoBtn.disabled = true;
      genLogoBtn.innerHTML = '<span>이미지 생성 중...</span>';
      showLoadingBanner('OpenAI로 로고 이미지 3장을 동시에 생성하고 있습니다... (보통 15~40초 소요)');
      try {
        await generateLogos(true);
        showToast('프롬프트가 반영된 신규 로고가 생성되었습니다.');
      } catch (err) {
        showToast('로고 생성 중 오류가 발생했습니다: ' + err.message);
      } finally {
        genLogoBtn.disabled = false;
        genLogoBtn.innerHTML = originalLogoBtnHTML;
        hideLoadingBanner();
      }
    });
  }

  // 초기 실행: 예전엔 샘플 카드를 바로 보여줬지만, 이제는 안내 화면부터 표시
  showIntroGuide();
});

// 최초 진입 시 보여줄 안내 화면
function showIntroGuide() {
  const grid = document.getElementById('logoGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="intro-guide">
      <i class="lucide-sparkles" style="width: 36px; height: 36px; color: #60a5fa;"></i>
      <h3>왼쪽에 브랜드 정보를 입력해주세요</h3>
      <p>기업명과 슬로건을 입력하고 <strong>"AI 프롬프트 생성하기"</strong>를 누르면
      AI가 분석한 프롬프트를 먼저 확인할 수 있어요.<br>
      이어서 <strong>"프롬프트 기반 로고 생성"</strong>을 누르면 이 자리에 실제 로고 시안이 나타납니다.</p>
    </div>
  `;
}