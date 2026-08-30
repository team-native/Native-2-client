import { useEffect, useState } from 'react';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import ProgressBar from '@/components/common/ProgressBar';
import PageHeading from '@/components/common/PageHeading';
import type { RiskSignal, ShareSummary } from '@/types';
import { createShareLink, getShareSummary } from '@/api/familyShare';
import { isApiConfigured } from '@/api/client';
import { getSafetySnapshot } from '@/utils/activity';
import { getDemoChatAnalysis } from '@/utils/chatAnalysisDemo';

const DEFAULT_SUMMARY: ShareSummary = {
  riskLevelLabel: '확인 전',
  riskScore: 0,
  signals: [],
  recommendedChecks: [{ id: 'r1', title: '대화와 계좌 정보를 함께 확인하기', description: '' }],
};

function getLocalSummary(): ShareSummary {
  const snapshot = getSafetySnapshot();
  const result = getDemoChatAnalysis();
  if (result) {
    return {
      riskLevelLabel: result.riskLevelLabel,
      riskScore: result.riskScore,
      signals: result.signals,
      recommendedChecks: [{ id: 'r1', title: '계좌 정보를 한 번 더 확인하기', description: '' }],
    };
  }
  if (snapshot.analysisCompleted) {
    return {
      riskLevelLabel: snapshot.riskLabel,
      riskScore: snapshot.riskScore,
      signals: [],
      recommendedChecks: [{ id: 'r1', title: '계좌 정보를 한 번 더 확인하기', description: '' }],
    };
  }
  return DEFAULT_SUMMARY;
}

function SignalRow({ signal, tone }: { signal: RiskSignal; tone: 'warning' | 'success' }) {
  return <li className="flex items-center gap-3"><IconCircle tone={tone} size={28} rounded="rounded-xl"><span className="text-[14px] font-semibold">{tone === 'warning' ? '!' : '✓'}</span></IconCircle><span className="text-[14px] font-medium text-ink-700">{signal.title}</span></li>;
}

export default function FamilySharePage() {
  const [summary, setSummary] = useState<ShareSummary>(getLocalSummary);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [kakaoStatus, setKakaoStatus] = useState<'idle' | 'sent'>('idle');

  useEffect(() => {
    if (!isApiConfigured) {
      setSummary(getLocalSummary());
      return;
    }
    getShareSummary().then(setSummary).catch(() => setSummary(getLocalSummary()));
  }, []);

  async function handleShare(method: 'kakao' | 'link') {
    let url = `${window.location.origin}/family-share/shared/demo`;
    if (isApiConfigured) {
      try { url = (await createShareLink(method)).url; } catch {  }
    }
    if (method === 'link') {
      try { await navigator.clipboard.writeText(url); } catch {
        const textarea = document.createElement('textarea');
        textarea.value = url; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); textarea.remove();
      }
      setCopyStatus('copied'); window.setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      if (navigator.share) {
        try { await navigator.share({ title: '금융 AI 안전 가이드 분석 결과', text: '분석 결과를 함께 확인해 주세요.', url }); } catch {  }
      }
      setKakaoStatus('sent'); window.setTimeout(() => setKakaoStatus('idle'), 2000);
    }
  }

  return (
    <div>
      <PageHeading eyebrow="가족 공유" title="혼자 판단하기 어렵다면 가족에게 바로 공유하세요." description="현재 분석 결과를 카카오톡 또는 공유 링크로 가족과 함께 확인할 수 있습니다." />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[470px_1fr]">
        <Card className="p-8"><h2 className="text-[20px] font-semibold text-ink-900">공유할 분석 결과</h2><div className="mt-6 border-t border-border-subtle" /><div className="mt-7 flex items-center justify-between"><span className="text-[14px] font-medium text-ink-500">대화 위험도</span><Badge tone={summary.riskScore >= 65 ? "danger" : summary.riskScore >= 35 ? "warning" : "success"}>{summary.riskLevelLabel}</Badge></div><p className={`mt-6 text-[56px] leading-none font-bold sm:text-[64px] ${summary.riskScore >= 65 ? "text-danger" : summary.riskScore >= 35 ? "text-warning" : "text-success"}`}>{summary.riskScore}</p><p className="mt-4 text-[14px] font-medium text-ink-500">위험도 점수 / 100</p><ProgressBar percent={summary.riskScore} tone={summary.riskScore >= 65 ? "danger" : summary.riskScore >= 35 ? "warning" : "success"} thickness="md" className="mt-4" /><h3 className="mt-9 text-[16px] font-semibold text-ink-900">함께 확인하면 좋은 내용</h3><ul className="mt-5 flex flex-col gap-4">{summary.signals.map((signal) => <SignalRow key={signal.id} signal={signal} tone="warning" />)}{summary.recommendedChecks.map((signal) => <SignalRow key={signal.id} signal={signal} tone="success" />)}</ul></Card>
        <Card className="p-8"><h2 className="text-[22px] font-semibold text-ink-900">어떤 방법으로 함께 확인할까요?</h2><p className="mt-3 text-[14px] text-ink-500">가족에게 가장 편한 방법을 선택하세요.</p><div className="mt-7 flex items-center justify-between rounded-2xl border border-warning-border bg-warning-bg-soft px-6 py-5"><div><p className="text-[18px] font-semibold text-ink-900">카카오톡으로 공유</p><p className="mt-1.5 text-[13px] text-ink-500">기기의 공유 기능으로 분석 결과 링크를 전달합니다.</p></div><button type="button" onClick={() => void handleShare('kakao')} className="h-[50px] shrink-0 rounded-xl bg-kakao px-7 text-[16px] font-semibold text-[#1e1e1e]">{kakaoStatus === 'sent' ? '준비됨' : '공유'}</button></div><div className="mt-5 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-input px-6 py-5"><div><p className="text-[17px] font-semibold text-ink-900">공유 링크</p><p className="mt-1.5 text-[13px] text-ink-500">URL을 복사해 문자나 다른 메신저로 전달할 수 있어요.</p></div><button type="button" onClick={() => void handleShare('link')} className="h-[50px] shrink-0 rounded-xl bg-white px-8 text-[16px] font-semibold text-brand-blue ring-1 ring-border-subtle hover:bg-brand-blue-bg">{copyStatus === 'copied' ? '복사됨' : 'URL 복사'}</button></div><div className="mt-5 rounded-2xl border border-border-subtle px-6 py-5"><p className="text-[16px] font-semibold text-ink-700">공유 전에 계좌번호나 개인정보가 포함되어 있는지 한 번 더 확인하세요.</p><p className="mt-2 text-[14px] text-ink-500">백엔드가 연결되지 않은 개발 환경에서도 페이지가 오류 없이 열리도록 데모 결과를 표시합니다.</p></div></Card>
      </div>
    </div>
  );
}
