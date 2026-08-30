import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import ProgressBar from '@/components/common/ProgressBar';
import { ROUTES } from '@/constants/nav';
import { getSafetySnapshot, subscribeSafetySnapshot, type SafetySnapshot } from '@/utils/activity';

const FEATURES = [
  { icon: '＋', tone: 'brand' as const, title: '대화 캡처 분석', description: '메신저와 문자 속 위험 신호를 AI가 찾아냅니다.', to: ROUTES.chatAnalysisUpload },
  { icon: '✓', tone: 'success' as const, title: '의심 계좌 조회', description: '입력한 계좌 정보와 신고 이력을 대조합니다.', to: ROUTES.accountCheck },
  { icon: '!', tone: 'warning' as const, title: '송금 전 가이드', description: '금액 구간에 맞는 확인 절차를 안내합니다.', to: ROUTES.transferAmount },
];

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return '아직 확인 기록이 없습니다';
  const date = new Date(updatedAt);
  return `최근 확인 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function HomePage() {
  const [snapshot, setSnapshot] = useState<SafetySnapshot>(() => getSafetySnapshot());

  useEffect(() => subscribeSafetySnapshot(setSnapshot), []);

  const checklist = [
    { label: '상대방 정보 확인', done: snapshot.checklistCompleted },
    { label: '송금 사유 확인', done: snapshot.checklistCompleted },
    { label: '대화 내용 다시 확인', done: snapshot.checklistCompleted },
  ];

  return (
    <div className="flex flex-col gap-11">
      <section className="grid grid-cols-1 gap-9 lg:grid-cols-[1fr_410px]">
        <div className="pt-1 lg:pt-4">
          <Badge tone="brand">금융 사기 예방 서비스</Badge>
          <h1 className="mt-5 text-[34px] leading-[1.16] font-bold text-ink-900 sm:text-[42px]">
            의심되는 순간, AI와 함께
            <br />한 번 더 확인하세요.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500 sm:text-[18px]">
            대화 · 계좌 · 송금 금액을 종합적으로 확인해 더 안전한 판단을 돕습니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={ROUTES.chatAnalysisUpload}><Button size="lg">위험도 확인하러 가기</Button></Link>
            <Link to={ROUTES.serviceIntro}><Button variant="secondary" size="lg">서비스 알아보기</Button></Link>
          </div>
        </div>

        <Card className="flex min-h-[390px] flex-col p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold text-ink-900">오늘의 안전 확인</h2>
              <p className="mt-1 text-[12px] text-ink-500">{formatUpdatedAt(snapshot.updatedAt)}</p>
            </div>
            <Badge tone={snapshot.analysisCompleted ? (snapshot.riskScore >= 65 ? 'danger' : snapshot.riskScore >= 35 ? 'warning' : 'success') : 'brand'}>
              {snapshot.analysisCompleted ? '분석 완료' : '확인 전'}
            </Badge>
          </div>
          <div className="mt-5 border-t border-border-subtle" />

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-ink-500">대화 위험도</span>
              <span className={`text-[22px] font-semibold ${!snapshot.analysisCompleted ? 'text-ink-500' : snapshot.riskScore >= 65 ? 'text-danger' : snapshot.riskScore >= 35 ? 'text-warning' : 'text-success'}`}>
                {snapshot.riskLabel}
              </span>
            </div>
            <ProgressBar percent={snapshot.riskScore} tone={snapshot.riskScore >= 60 ? 'danger' : 'success'} thickness="md" className="mt-3" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[14px] font-medium text-ink-500">계좌 확인</span>
            <span className="text-[18px] font-semibold text-ink-900">{snapshot.accountChecked ? '확인 완료' : '확인 전'}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-[17px] font-semibold text-ink-900">송금 전 체크리스트</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  {item.done ? (
                    <IconCircle tone="success" size={24} rounded="rounded-xl"><span className="text-[14px]">✓</span></IconCircle>
                  ) : (
                    <span className="size-6 rounded-xl border-2 border-border-subtle bg-white" />
                  )}
                  <span className="text-[14px] font-medium text-ink-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[26px] font-bold text-ink-900 sm:text-[28px]">어떻게 확인하나요?</h2>
          <Link to={ROUTES.serviceIntro} className="text-[14px] font-semibold text-brand-blue hover:underline">전체 서비스 설명 보기</Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Link key={feature.title} to={feature.to}>
              <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <IconCircle tone={feature.tone} size={42} rounded="rounded-xl"><span className="text-[20px] leading-none">{feature.icon}</span></IconCircle>
                <h3 className="mt-4 text-[18px] font-semibold text-ink-900">{feature.title}</h3>
                <p className="mt-2 text-[14px] text-ink-500">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
