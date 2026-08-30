import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import ProgressBar from '@/components/common/ProgressBar';
import type { AnalysisStep } from '@/types';
import { getAnalysisProgress } from '@/api/chatAnalysis';
import { ROUTES } from '@/constants/nav';
import { isApiConfigured } from '@/api/client';

const INITIAL_STEPS: AnalysisStep[] = [
  { id: 'upload', label: '이미지 업로드 확인', status: '완료' },
  { id: 'ocr', label: '대화 텍스트 추출', status: '완료' },
  { id: 'risk', label: '위험 신호 분석', status: '진행 중' },
  { id: 'summary', label: '결과 정리', status: '대기 중' },
];

const STATUS_TONE: Record<AnalysisStep['status'], string> = {
  완료: 'text-success',
  '진행 중': 'text-brand-blue',
  '대기 중': 'text-ink-500',
};

export default function ChatAnalysisProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { jobId?: string; isDemo?: boolean } | null;
  const jobId = state?.jobId ?? 'demo-job';
  const isDemo = state?.isDemo ?? !isApiConfigured;

  const [steps, setSteps] = useState<AnalysisStep[]>(INITIAL_STEPS);
  const [percent, setPercent] = useState(69);
  const [currentStepLabel, setCurrentStepLabel] = useState('위험 표현을 분석하고 있어요');

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (isDemo) {
        simulateProgress();
        return;
      }
      try {
        const progress = await getAnalysisProgress(jobId);
        if (cancelled) return;
        setPercent(progress.percent);
        setSteps(progress.steps);
        setCurrentStepLabel(progress.currentStepLabel);
        if (progress.percent >= 100) {
          navigate(ROUTES.chatAnalysisResult, { state: { jobId, isDemo } });
        }
      } catch {
        
        simulateProgress();
      }
    }

    let simulated = 69;
    function simulateProgress() {
      const interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        simulated += 8;
        if (simulated >= 100) {
          simulated = 100;
          setPercent(100);
          setSteps((prev) => prev.map((s) => ({ ...s, status: '완료' })));
          setCurrentStepLabel('결과를 정리하고 있어요');
          clearInterval(interval);
          window.setTimeout(() => {
            if (!cancelled) navigate(ROUTES.chatAnalysisResult, { state: { jobId, isDemo } });
          }, 500);
          return;
        }
        setPercent(simulated);
      }, 400);
    }

    void poll();
    return () => {
      cancelled = true;
    };
    
  }, [jobId, isDemo, navigate]);

  return (
    <div>
      <Badge tone="brand">AI가 대화를 분석하고 있어요</Badge>
      <h1 className="mt-6 text-[34px] leading-tight font-bold text-ink-900 sm:text-[42px]">
        잠시만 기다려 주세요.
      </h1>
      <p className="mt-6 text-[17px] text-ink-500 sm:text-[18px]">
        업로드된 이미지에서 텍스트를 추출하고 위험 신호를 단계별로 확인하고 있습니다.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[760px_1fr]">
        <Card className="p-8">
          <p className="text-[15px] font-medium text-ink-500">현재 단계</p>
          <p className="mt-2 text-[24px] font-semibold text-ink-900 sm:text-[25px]">
            {currentStepLabel}
          </p>
          <ProgressBar percent={percent} thickness="md" className="mt-8" />

          <ul className="mt-8 flex flex-col gap-4">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-ink-700">{step.label}</span>
                <span className={`font-medium ${STATUS_TONE[step.status]}`}>{step.status}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-[18px] font-semibold text-ink-900">안심하세요</h2>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-500">
            분석 과정에서는 대화 속 의심 신호를 중심으로 확인합니다. 결과가 나오면 왜 주의가
            필요한지 쉽게 설명해 드립니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
