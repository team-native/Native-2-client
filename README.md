# 금융 AI 안전 가이드 Frontend

2026 금융 AI Challenge용 프론트엔드 프로젝트입니다. Figma 시안을 기준으로 React + TypeScript + Tailwind CSS로 구성되어 있으며, 백엔드가 아직 연결되지 않은 환경에서도 주요 화면을 데모 데이터로 확인할 수 있습니다.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- React Router DOM
- Oxlint

## 실행

```bash
npm install
npm run dev
```

백엔드 연결 시 `.env.example`을 참고해 `.env`에 `VITE_API_BASE_URL`을 설정합니다. 설정하지 않으면 이미지 분석, 계좌 조회, 가족 공유 등은 데모 흐름으로 동작합니다.

## 주요 라우트

- `/` 메인
- `/service` 서비스 설명
- `/chat-analysis` 대화 이미지 분석
- `/account-check` 계좌 조회
- `/transfer-guide` 송금 가이드
- `/family-share` 가족 공유
- `/history` 검사 기록
- `/risk-expressions` 주의해야 할 표현
- `/faq` 자주 묻는 질문

## 구조

```text
src/
├─ api/                 # Axios API 모듈
├─ components/
│  ├─ common/           # Button, Card, Badge 등 공통 UI
│  └─ layout/           # Header, MainLayout
├─ constants/           # route/nav 상수
├─ pages/               # 화면 단위 컴포넌트
├─ router/              # React Router 설정
├─ types/               # API 및 도메인 타입
├─ utils/               # 검사 기록/최근 안전 상태 localStorage 관리
├─ App.tsx
├─ index.css
└─ main.tsx
```
