// Vercel Serverless Function (Node.js runtime)
// 프론트엔드는 절대 OpenAI API 키를 직접 들고 있지 않습니다.
// 브라우저 → 이 함수(/api/generate-logo) → OpenAI, 순서로만 호출됩니다.

// 이미지 3장을 "한 요청에 n:3"으로 순차 생성하면 시간이 3배로 걸리는 경향이 있어서,
// 대신 n:1짜리 요청 3개를 동시에(Promise.all) 쏴서 병렬로 받습니다.
// → 전체 소요 시간이 "가장 오래 걸린 1장" 수준으로 수렴하면서도 3장 다 실제 AI 이미지가 됩니다.
export const config = {
  maxDuration: 45
};

async function generateOneImage(apiKey, finalPrompt) {
  const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-image-1-mini', // 로고 아이콘 용도로는 mini로도 충분하고 훨씬 저렴함 (저화질 기준 약 절반 가격)
      prompt: finalPrompt,
      size: '1024x1024',
      quality: 'low',
      n: 1
    })
  });

  const data = await openaiRes.json();
  if (!openaiRes.ok) {
    throw new Error(data.error?.message || `이미지 생성 실패 (${openaiRes.status})`);
  }

  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI 응답에 이미지 데이터가 없습니다.');
  return `data:image/png;base64,${b64}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const { prompt, variations = 3 } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt가 필요합니다.' });
  }

  try {
    // 로고 심볼 용도이므로 텍스트가 섞이지 않도록 지시를 덧붙임
    const basePrompt =
      `${prompt} Icon-only vector-style logo symbol, no text, no letters, ` +
      `centered composition, transparent-friendly plain background, flat clean illustration.`;

    // 3장이 서로 완전히 똑같이 나오지 않도록 각 요청마다 살짝 다른 지시를 덧붙임
    const angleHints = [
      'Composition variant A: centered, symmetric.',
      'Composition variant B: slightly different pose or angle, same subject.',
      'Composition variant C: alternate stylization, same subject.'
    ];

    const requestCount = Math.min(Math.max(Number(variations) || 1, 1), 3);
    const settled = await Promise.allSettled(
      Array.from({ length: requestCount }, (_, i) =>
        generateOneImage(apiKey, `${basePrompt} ${angleHints[i] || ''}`)
      )
    );

    const images = settled
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    if (images.length === 0) {
      const firstError = settled.find(r => r.status === 'rejected');
      return res.status(502).json({ error: firstError?.reason?.message || '이미지 생성 실패' });
    }

    return res.status(200).json({ images });
  } catch (err) {
    return res.status(500).json({ error: err.message || '서버 오류' });
  }
}
