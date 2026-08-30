import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import ProgressBar from '@/components/common/ProgressBar';
import PageHeading from '@/components/common/PageHeading';
import type { ChatAnalysisResult } from '@/types';
import { getChatAnalysisResult } from '@/api/chatAnalysis';
import { getDemoChatAnalysis } from '@/utils/chatAnalysisDemo';
import { isApiConfigured } from '@/api/client';
import { ROUTES } from '@/constants/nav';
import { addHistory, updateSafetySnapshot } from '@/utils/activity';

const NEXT_STEPS = [
  {
    icon: '＋',
    tone: 'brand' as const,
    title: '계좌 조회',
    description: '상대방 계좌를 확인합니다.',
    to: ROUTES.accountCheck,
  },
  {
    icon: '!',
    tone: 'warning' as const,
    title: '송금 금액 확인',
    description: '금액에 맞는 안내를 봅니다.',
    to: ROUTES.transferAmount,
  },
  {
    icon: '✓',
    tone: 'success' as const,
    title: '결과 공유',
    description: '가족과 함께 다시 확인합니다.',
    to: ROUTES.familyShare,
  },
  {
    icon: '?',
    tone: 'warning' as const,
    title: '지금 할 일',
    description: '위험 신호가 보일 때 확인할 순서를 안내합니다.',
    to: ROUTES.help,
  },
];

export default function ChatAnalysisResultPage() {
  const location = useLocation();
  const state = location.state as { jobId?: string; isDemo?: boolean } | null;
  const jobId = state?.jobId ?? 'demo-job';
  const isDemo = state?.isDemo ?? !isApiConfigured;
  const [result, setResult] = useState<ChatAnalysisResult | null>(() => isDemo ? getDemoChatAnalysis(jobId) : null);

  useEffect(() => {
    let cancelled = false;
    if (isDemo) {
      const demoResult = getDemoChatAnalysis(jobId);
      if (!cancelled) setResult(demoResult);
      return () => { cancelled = true; };
    }
    getChatAnalysisResult(jobId)
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      });
    return () => { cancelled = true; };
  }, [jobId, isDemo]);

  useEffect(() => {
    if (!result) return;
    updateSafetySnapshot({
      riskScore: result.riskScore,
      riskLabel: result.riskLevelLabel,
      analysisCompleted: true,
    });
  }, [result]);

  useEffect(() => {
    if (!result) return;
    const key = `history-chat-${jobId}`;
    if (sessionStorage.getItem(key)) return;
    addHistory({
      type: 'chat',
      title: 'AI 대화 분석',
      summary: result.summary,
      status: result.riskLevelLabel,
      riskScore: result.riskScore,
    });
    sessionStorage.setItem(key, '1');
  }, [jobId, result]);

  const resultTone = result ? (result.riskScore >= 65 ? 'danger' : result.riskScore >= 35 ? 'warning' : 'success') : 'warning';
  const resultTitle = result ? (result.riskScore >= 65 ? '주의가 필요한 표현이 확인되었어요.' : result.riskScore >= 35 ? '한 번 더 확인하면 좋은 표현이 있어요.' : '뚜렷한 위험 신호가 많이 확인되지 않았어요.') : '';

  if (!result) {
    return (
      <div>
        <PageHeading eyebrow="대화 분석 결과" title="분석 결과를 불러오지 못했어요." description="새로운 이미지를 업로드한 뒤 다시 분석해 주세요." />
        <Link to={ROUTES.chatAnalysisUpload} className="inline-flex mt-8"><button className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white">다시 분석하기</button></Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        eyebrow="대화 분석 결과"
        title={resultTitle}
        description="아래 내용을 확인한 뒤 송금이나 개인정보 제공을 다시 판단해 보세요."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[430px_1fr]">
        <Card className="p-8">
          <Badge tone={resultTone}>{result.riskLevelLabel}</Badge>
          <div className="mt-6 flex items-baseline gap-2">
            <span className={`text-[64px] leading-none font-bold sm:text-[78px] ${resultTone === "danger" ? "text-danger" : resultTone === "warning" ? "text-warning" : "text-success"}`}>
              {result.riskScore}
            </span>
            <span className="text-[15px] font-medium text-ink-500">/ 100</span>
          </div>
          <ProgressBar
            percent={result.riskScore}
            tone={resultTone}
            thickness="md"
            className="mt-10"
          />
          <p className="mt-8 text-[16px] font-semibold text-ink-700">{result.summary}</p>
        </Card>

        <Card className="p-8">
          <h2 className="text-[19px] font-semibold text-ink-900">확인된 위험 신호</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {result.signals.map((signal) => (
              <li
                key={signal.id}
                className={`flex items-start gap-4 rounded-2xl px-5 py-4 ${resultTone === "danger" ? "bg-danger-bg-soft" : resultTone === "warning" ? "bg-warning-bg-soft" : "bg-success-bg-soft"}`}
              >
                <IconCircle tone={resultTone} size={26} rounded="rounded-lg">
                  <span className="text-[18px] font-bold leading-none">!</span>
                </IconCircle>
                <div>
                  <p className="text-[16px] font-semibold text-ink-700">{signal.title}</p>
                  <p className="mt-1 text-[13px] text-ink-500">{signal.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="mt-20">
        <h2 className="text-[24px] font-bold text-ink-900 sm:text-[25px]">
          다음 단계도 확인해 보세요
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NEXT_STEPS.map((step) => (
            <Link key={step.title} to={step.to}>
              <Card className="h-full p-6 transition-shadow hover:shadow-md">
                <IconCircle tone={step.tone} size={42} rounded="rounded-xl">
                  <span className="text-[20px] leading-none">{step.icon}</span>
                </IconCircle>
                <h3 className="mt-6 text-[18px] font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-3 text-[14px] text-ink-500">{step.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
