// Vercel Serverless Function (Node.js runtime)
// 프론트엔드는 절대 OpenAI API 키를 직접 들고 있지 않습니다.
// 브라우저 → 이 함수(/api/generate-logo) → OpenAI, 순서로만 호출됩니다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt가 필요합니다.' });
  }

  try {
    // 로고 심볼 용도이므로 텍스트가 섞이지 않도록 지시를 덧붙임
    const finalPrompt =
      `${prompt} Icon-only vector-style logo symbol, no text, no letters, ` +
      `centered composition, transparent-friendly plain background, flat clean illustration.`;

    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: finalPrompt,
        size: '1024x1024',
        n: 1
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: data.error?.message || '이미지 생성 실패' });
    }

    const base64 = data.data?.[0]?.b64_json;
    if (!base64) {
      return res.status(502).json({ error: 'OpenAI 응답에 이미지 데이터가 없습니다.' });
    }

    return res.status(200).json({ imageDataUrl: `data:image/png;base64,${base64}` });
  } catch (err) {
    return res.status(500).json({ error: err.message || '서버 오류' });
  }
}
