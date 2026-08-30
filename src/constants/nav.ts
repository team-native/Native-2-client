export interface NavItem {
  label: string;
  path: string;
  matchPrefix: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: '홈', path: '/', matchPrefix: '/' },
  { label: '대화 분석', path: '/chat-analysis', matchPrefix: '/chat-analysis' },
  { label: '계좌 조회', path: '/account-check', matchPrefix: '/account-check' },
  { label: '송금 가이드', path: '/transfer-guide', matchPrefix: '/transfer-guide' },
  { label: '가족 공유', path: '/family-share', matchPrefix: '/family-share' },
];

export const INFO_NAV_ITEMS: NavItem[] = [
  { label: '검사 기록', path: '/history', matchPrefix: '/history' },
  { label: '주의 표현', path: '/risk-expressions', matchPrefix: '/risk-expressions' },
  { label: 'FAQ', path: '/faq', matchPrefix: '/faq' },
];

export const ROUTES = {
  home: '/',
  serviceIntro: '/service',
  chatAnalysisUpload: '/chat-analysis',
  chatAnalysisProgress: '/chat-analysis/progress',
  chatAnalysisResult: '/chat-analysis/result',
  accountCheck: '/account-check',
  accountCheckResult: '/account-check/result',
  transferAmount: '/transfer-guide',
  transferChecklist: '/transfer-guide/checklist',
  familyShare: '/family-share',
  history: '/history',
  historyDetail: '/history/:id',
  help: '/help',
  faq: '/faq',
  riskExpressions: '/risk-expressions',
} as const;
