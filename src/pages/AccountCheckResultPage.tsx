import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import type { AccountCheckResult } from '@/types';
import { ROUTES } from '@/constants/nav';
import { addHistory, updateSafetySnapshot } from '@/utils/activity';

const FALLBACK_RESULT: AccountCheckResult = {
  accountId: 'demo-account',
  isSuspicious: true,
  statusLabel: '추가 확인 권장',
  headline: '주의가 필요한 정보가 확인되었습니다.',
  message: '송금 전 대화 분석 결과와 함께 확인해 보세요.',
};

const REASONS = [
  {
    icon: '!',
    tone: 'warning' as const,
    title: '정보 교차 확인',
    description: '계좌 정보와 대화 속 요구 내용을 함께 비교합니다.',
  },
  {
    icon: '✓',
    tone: 'brand' as const,
    title: '공식 경로 이용',
    description: '의심되는 기관은 직접 공식 고객센터로 확인합니다.',
  },
  {
    icon: '✓',
    tone: 'brand' as const,
    title: '주변과 함께 확인',
    description: '혼자 판단하기 어렵다면 가족이나 보호자에게 보여주세요.',
  },
];

export default function AccountCheckResultPage() {
  const location = useLocation();
  const routeState = location.state as { result?: AccountCheckResult | null; bankName?: string; accountNumber?: string; recipientName?: string } | null;
  const result = routeState?.result ?? FALLBACK_RESULT;

  useEffect(() => {
    updateSafetySnapshot({ accountChecked: true });
    const key = `history-account-${routeState?.bankName ?? 'demo'}-${routeState?.accountNumber ?? 'unknown'}`;
    if (sessionStorage.getItem(key)) return;
    addHistory({
      type: 'account',
      title: '계좌 조회',
      summary: `${routeState?.bankName ?? '선택한 은행'} · ${routeState?.recipientName ?? '예금주'} · 끝자리 ${routeState?.accountNumber?.slice(-4) ?? '0000'}`,
      status: result.statusLabel,
    });
    sessionStorage.setItem(key, '1');
  }, [result.statusLabel, routeState?.accountNumber, routeState?.bankName, routeState?.recipientName]);

  return (
    <div>
      <PageHeading
        eyebrow="계좌 조회 결과"
        title="추가 확인을 권장합니다."
        description="조회 결과만으로 모든 위험을 판단할 수 없으므로 대화 내용과 함께 확인하세요."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[500px_1fr]">
        <Card className="p-8">
          <Badge tone="warning">{result.statusLabel}</Badge>
          <p className="mt-8 text-[18px] font-medium text-ink-700">입력한 계좌에서</p>
          <p className="mt-2 text-[23px] font-semibold text-ink-900">{result.headline}</p>
          <div className="mt-9 border-t border-border-subtle" />
          <p className="mt-8 text-[15px] text-ink-500">{result.message}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ROUTES.transferAmount}><Button>송금 가이드 보기</Button></Link>
            <Link to={ROUTES.help}><Button variant="secondary">지금 할 일 확인하기</Button></Link>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-[19px] font-semibold text-ink-900">왜 추가 확인이 필요한가요?</h2>
          <ul className="mt-8 flex flex-col gap-8">
            {REASONS.map((reason) => (
              <li key={reason.title} className="flex items-start gap-5">
                <IconCircle tone={reason.tone} size={52} rounded="rounded-2xl">
                  <span className="text-[18px] font-bold leading-none">{reason.icon}</span>
                </IconCircle>
                <div>
                  <p className="text-[17px] font-semibold text-ink-900">{reason.title}</p>
                  <p className="mt-1.5 text-[14px] text-ink-500">{reason.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
