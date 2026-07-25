# AuraLogo 배포 가이드 (Node.js + Vercel)

## 폴더 구조
```
/
├── index.html
├── styles.css
├── app.js
├── pipeline.js
├── package.json
└── api/
    └── generate-logo.js   ← Vercel 서버리스 함수 (OpenAI 호출)
```

## 배포 단계

1. 위 폴더 전체를 GitHub 저장소에 올립니다.
2. https://vercel.com 에서 "Add New Project" → 방금 만든 저장소를 선택합니다.
   Framework Preset은 "Other"로 두면 됩니다 (별도 프레임워크 없음).
3. 프로젝트의 **Settings → Environment Variables**에서 아래 값을 추가합니다.
   - Key: `OPENAI_API_KEY`
   - Value: 발급받은 OpenAI API 키
   - Environment: Production / Preview / Development 모두 체크
4. Deploy를 누르면 끝입니다. `https://<프로젝트명>.vercel.app` 주소로 접속하면
   프론트엔드(index.html)와 `/api/generate-logo`가 같은 도메인에서 함께 서빙됩니다.

## 동작 확인

- 로컬에서 `index.html`을 그냥 더블클릭해서 열면 `/api/generate-logo`가 없기 때문에
  자동으로 기존 방식(아이콘 매칭)으로 폴백됩니다 — 에러가 나지 않습니다.
- Vercel에 배포한 뒤 실제 접속해서 사용하면 OpenAI 이미지 생성이 동작합니다.
- 브라우저 개발자 도구 콘솔에 `[GenerativeConnector] ... 폴백` 로그가 뜨면
  `/api/generate-logo` 호출이 실패했다는 뜻이니, 환경변수 설정과 API 키 잔액을 확인하세요.

## 로컬에서 API 함수까지 테스트하고 싶다면

```bash
npm i -g vercel
vercel dev
```
`vercel dev`는 로컬에서 `/api` 서버리스 함수까지 함께 띄워줍니다. 이때도
`.env` 파일이나 `vercel env pull`로 `OPENAI_API_KEY`를 로컬에 받아와야 합니다.
