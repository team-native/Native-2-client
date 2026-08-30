import type { ChatAnalysisResult, RiskLevel, RiskSignal } from '@/types';

const STORAGE_KEY = 'financial-ai-chat-analysis-result';

const SIGNALS: RiskSignal[] = [
  { id: 'urgent', title: '급하게 송금을 요구하는 표현', description: '시간 압박이 느껴지는 요청이 있는지 다시 확인해 보세요.' },
  { id: 'impersonation', title: '기관 또는 지인을 사칭하는 표현', description: '공식 채널이나 직접 연락으로 사실 여부를 확인해 보세요.' },
  { id: 'personal', title: '개인정보 제공을 유도하는 표현', description: '민감한 정보 제공을 요구하는 내용은 주의가 필요합니다.' },
  { id: 'secret', title: '비밀 유지를 요구하는 표현', description: '다른 사람에게 알리지 말라는 요청은 한 번 더 확인해 보세요.' },
  { id: 'reward', title: '과도한 보상 또는 혜택을 강조하는 표현', description: '비정상적으로 좋은 조건을 제시하는 경우 사실 여부를 확인해 보세요.' },
];

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0;
  }
  return result;
}

function levelFromScore(score: number): { riskLevel: RiskLevel; riskLevelLabel: string; summary: string } {
  if (score < 35) {
    return {
      riskLevel: 'low',
      riskLevelLabel: '낮음',
      summary: '뚜렷한 위험 신호가 많이 확인되지 않았어요. 그래도 송금 전 상대방 정보를 한 번 더 확인해 보세요.',
    };
  }
  if (score < 65) {
    return {
      riskLevel: 'medium',
      riskLevelLabel: '주의 필요',
      summary: '주의해서 확인해야 할 표현이 일부 감지되었어요. 상대방과 송금 사유를 다시 확인해 보세요.',
    };
  }
  return {
    riskLevel: 'high',
    riskLevelLabel: '주의 필요',
    summary: '주의가 필요한 위험 신호가 여러 개 감지되었어요. 송금을 잠시 멈추고 내용을 다시 확인해 보세요.',
  };
}

export function createDemoChatAnalysis(files: File[]): ChatAnalysisResult {
  const fingerprint = files.map((file) => `${file.name}:${file.size}:${file.lastModified}`).join('|');
  const seed = hash(fingerprint || `${Date.now()}-${Math.random()}`);
  const score = 12 + (seed % 77);
  const signalCount = score < 35 ? 1 : score < 65 ? 2 : 3;
  const signals = Array.from({ length: signalCount }, (_, index) => SIGNALS[(seed + index * 7) % SIGNALS.length]);
  const level = levelFromScore(score);

  return {
    jobId: `demo-${Date.now()}`,
    riskScore: score,
    riskLevel: level.riskLevel,
    riskLevelLabel: level.riskLevelLabel,
    summary: level.summary,
    signals,
  };
}

export function saveDemoChatAnalysis(result: ChatAnalysisResult) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function getDemoChatAnalysis(jobId?: string): ChatAnalysisResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const result = JSON.parse(raw) as ChatAnalysisResult;
    if (jobId && result.jobId !== jobId) return null;
    return result;
  } catch {
    return null;
  }
}
