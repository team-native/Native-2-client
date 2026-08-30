import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import type { TransferAmountTier } from '@/types';
import { ROUTES } from '@/constants/nav';
import { addHistory, updateSafetySnapshot } from '@/utils/activity';

const TIER_LABEL: Record<TransferAmountTier, string> = { small: '소액', medium: '중액', large: '고액' };
const CHECKLIST = [
  { id: 'partner', order: '01', title: '상대방 다시 확인', description: '계좌 명의와 대화 상대방이 일치하는지 확인하세요.' },
  { id: 'reason', order: '02', title: '송금 사유 확인', description: '급하게 송금을 요구하거나 비정상적인 요청이 없는지 확인하세요.' },
  { id: 'final', order: '03', title: '마지막 점검', description: '입력한 계좌와 금액을 다시 확인하세요.' },
];
const PREPARED_ITEMS = ['대화 위험도 확인', '계좌 정보 확인', '송금 금액 확인'];

export default function TransferChecklistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { amount?: number; tier?: TransferAmountTier } | null;
  const tier = state?.tier ?? 'medium';
  const amount = state?.amount ?? 0;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = useMemo(() => CHECKLIST.every((item) => checked[item.id]), [checked]);

  function handleComplete() {
    updateSafetySnapshot({ checklistCompleted: true });
    addHistory({ type: 'transfer', title: '송금 안전 가이드 완료', summary: `${new Intl.NumberFormat('ko-KR').format(amount)}원 · ${TIER_LABEL[tier]} 구간 점검`, status: '확인 완료' });
    navigate(ROUTES.familyShare);
  }

  return (
    <div>
      <PageHeading eyebrow="송금 전, 이 순서대로 확인하세요." title={`${TIER_LABEL[tier]} 구간에 맞춘 안전 확인 가이드입니다.`} description="모든 단계를 확인한 뒤에도 의심스럽다면 송금을 잠시 멈추고 주변에 도움을 요청하세요." />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[836px_1fr]">
        <Card className="p-8">
          <ul>
            {CHECKLIST.map((item, index) => (
              <li key={item.id}>
                <button type="button" onClick={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))} className="flex w-full items-center gap-6 rounded-2xl px-3 py-5 text-left transition-colors hover:bg-surface-input">
                  <IconCircle tone={checked[item.id] ? 'success' : 'brand'} size={56} rounded="rounded-2xl"><span className="text-[20px] font-semibold">{checked[item.id] ? '✓' : item.order}</span></IconCircle>
                  <div className="flex-1"><p className="text-[19px] font-semibold text-ink-900">{item.title}</p><p className="mt-2 text-[15px] text-ink-500">{item.description}</p></div>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl border-2 text-[16px] font-semibold transition-all ${checked[item.id] ? 'border-brand-blue bg-brand-blue text-white shadow-sm' : 'border-border-input bg-white text-transparent'}`}>✓</span>
                </button>
                {index < CHECKLIST.length - 1 && <div className="border-t border-border-subtle" />}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-surface-input px-4 py-3 text-[13px] leading-relaxed text-ink-500">마지막 점검으로 위 항목을 하나씩 눌러 체크해 주세요. 세 항목을 모두 확인하면 오른쪽 상태가 <strong className="text-ink-700">확인 완료</strong>로 바뀌고 다음 단계로 넘어갈 수 있습니다.</p>
        </Card>

        <Card className="p-8">
          <Badge tone={allChecked ? 'success' : 'brand'}>{allChecked ? '확인 완료' : '확인 진행 중'}</Badge>
          <h2 className="mt-8 text-[18px] font-semibold text-ink-900">확인한 항목</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {PREPARED_ITEMS.map((label) => <li key={label} className="flex items-center gap-3"><IconCircle tone="success" size={24} rounded="rounded-xl"><span className="text-[14px]">✓</span></IconCircle><span className="text-[15px] font-medium text-ink-700">{label}</span></li>)}
            <li className="flex items-center gap-3">{allChecked ? <IconCircle tone="success" size={24} rounded="rounded-xl"><span className="text-[14px]">✓</span></IconCircle> : <span className="size-6 rounded-xl border-[3px] border-[#f1f3f6] bg-white" />}<span className="text-[15px] font-medium text-ink-700">마지막 점검</span></li>
          </ul>
          <Button fullWidth className="mt-10" disabled={!allChecked} onClick={handleComplete}>{allChecked ? '다음 단계로' : '확인 완료'}</Button>
        </Card>
      </div>
    </div>
  );
}
