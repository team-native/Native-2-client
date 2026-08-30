
export type RiskLevel = 'low' | 'medium' | 'high';


export interface RiskSignal {
  id: string;
  title: string;
  description: string;
}


export interface ChatAnalysisJob {
  jobId: string;
  status: 'pending' | 'processing' | 'done';
}


export interface AnalysisStep {
  id: string;
  label: string;
  status: '완료' | '진행 중' | '대기 중';
}


export interface AnalysisProgress {
  jobId: string;
  currentStepLabel: string;
  percent: number;
  steps: AnalysisStep[];
}


export interface ChatAnalysisResult {
  jobId: string;
  riskScore: number; 
  riskLevel: RiskLevel;
  riskLevelLabel: string;
  summary: string;
  signals: RiskSignal[];
}


export interface AccountCheckRequest {
  bankName: string;
  accountNumber: string;
}


export interface AccountCheckResult {
  accountId: string;
  isSuspicious: boolean;
  statusLabel: string;
  headline: string;
  message: string;
}


export type TransferAmountTier = 'small' | 'medium' | 'large';


export interface TransferAmountGuide {
  tier: TransferAmountTier;
  title: string;
  description: string;
}


export interface TransferChecklistItem {
  id: string;
  order: number;
  title: string;
  description: string;
  completed: boolean;
}


export interface ShareSummary {
  riskLevelLabel: string;
  riskScore: number;
  signals: RiskSignal[];
  recommendedChecks: RiskSignal[];
}


export type ShareMethod = 'kakao' | 'link';
