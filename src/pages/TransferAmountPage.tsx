import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import PageHeading from '@/components/common/PageHeading';
import type { TransferAmountTier } from '@/types';
import { ROUTES } from '@/constants/nav';

const TIERS: { key: TransferAmountTier; title: string; description: string }[] = [
  { key: 'small', title: '소액', description: '기본적인 상대방 정보와 대화 내용을 확인합니다.' },
  { key: 'medium', title: '중액', description: '계좌와 대화 내용을 함께 확인하는 것을 권장합니다.' },
  { key: 'large', title: '고액', description: '주변과 함께 한 번 더 검토하는 것을 권장합니다.' },
];

function resolveTier(amount: number): TransferAmountTier {
  if (amount < 300_000) return 'small';
  if (amount < 3_000_000) return 'medium';
  return 'large';
}

function formatAmount(value: number) { return new Intl.NumberFormat('ko-KR').format(value); }

export default function TransferAmountPage() {
  const navigate = useNavigate();
  const [amountInput, setAmountInput] = useState('');
  const amount = useMemo(() => Number(amountInput.replace(/\D/g, '')) || 0, [amountInput]);
  const tier = amount > 0 ? resolveTier(amount) : null;

  function handleAmountChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 12);
    const normalized = digits === '' ? '' : String(Math.min(Number(digits), 999_999_999_999));
    setAmountInput(normalized);
  }

  return (
    <div>
      <PageHeading eyebrow="송금하려는 금액을 알려주세요." title={<>금액에 따라 확인해야 할 내용을<br />더 쉽게 정리해 드립니다.</>} description="금액은 안전 확인 가이드를 제공하기 위한 기준으로 사용됩니다." />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[690px_1fr]">
        <Card className="p-8">
          <p className="text-[15px] font-medium text-ink-500">송금 예정 금액</p>
          <div className="mt-5 flex h-[90px] min-w-0 items-center rounded-2xl bg-surface-input px-7">
            <span className="shrink-0 text-[28px] font-bold text-ink-900 sm:text-[32px]">₩</span>
            <input value={amountInput === '' ? '' : formatAmount(amount)} onChange={(event) => handleAmountChange(event.target.value)} inputMode="numeric" aria-label="송금 예정 금액" className="min-w-0 flex-1 bg-transparent px-3 text-right text-[28px] font-bold tabular-nums text-ink-900 outline-none sm:text-[32px]" />
            <span className="shrink-0 text-[20px] font-medium text-ink-500">원</span>
          </div>
          <p className="mt-6 text-[16px] text-ink-500">금액 구간에 맞는 안전 확인 단계를 안내합니다.</p>
          <Button className="mt-10" disabled={amount <= 0} onClick={() => navigate(ROUTES.transferChecklist, { state: { amount, tier } })}>맞춤 가이드 보기</Button>
        </Card>

        <div>
          <h2 className="text-[22px] font-semibold text-ink-900">금액 구간 안내</h2>
          <div className="mt-6 flex flex-col gap-4">
            {TIERS.map((item) => {
              const active = item.key === tier;
              return (
                <Card key={item.key} className={`p-7 transition-all ${active ? '!border-[#2F6BFF] !bg-[#2F6BFF] shadow-sm' : ''}`}>
                  <h3 className={`text-[18px] font-semibold ${active ? '!text-white' : 'text-ink-900'}`}>{item.title}</h3>
                  <p className={`mt-3 text-[14px] ${active ? '!text-white/90' : 'text-ink-500'}`}>{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
