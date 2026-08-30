import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import { checkAccount, getBankList } from '@/api/accountCheck';
import { isApiConfigured } from '@/api/client';
import { ROUTES } from '@/constants/nav';

const DEFAULT_BANKS = [
  'KB국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행', 'IBK기업은행', 'SC제일은행',
  '씨티은행', '카카오뱅크', '토스뱅크', '케이뱅크', '수협은행', '산업은행', '부산은행',
  '대구은행', '경남은행', '광주은행', '전북은행', '제주은행', '새마을금고', '신협', '우체국',
];

const CHECK_STEPS = [
  { order: 1, title: '계좌 명의 확인', description: '대화 상대방과 일치하는지 확인하세요.' },
  { order: 2, title: '공식 채널 확인', description: '기관 사칭이 의심되면 공식 번호를 이용하세요.' },
  { order: 3, title: '송금 잠시 멈추기', description: '조금이라도 의심되면 먼저 확인하세요.' },
];

export default function AccountCheckPage() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState(DEFAULT_BANKS);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isApiConfigured) return;
    getBankList().then((list) => { if (list.length > 0) setBanks(list); }).catch(() => undefined);
  }, []);

  const canSubmit = bankName !== '' && accountNumber.length >= 8 && recipientName.trim() !== '' && !isSubmitting;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSubmit) setShowConfirm(true);
  }

  async function confirmAccount() {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      if (!isApiConfigured) {
        navigate(ROUTES.accountCheckResult, { state: { result: null, bankName, accountNumber, recipientName } });
        return;
      }
      const result = await checkAccount({ bankName, accountNumber });
      navigate(ROUTES.accountCheckResult, { state: { result, bankName, accountNumber, recipientName } });
    } catch {
      navigate(ROUTES.accountCheckResult, { state: { result: null, bankName, accountNumber, recipientName } });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeading eyebrow="송금 전, 계좌를 한 번 더 확인하세요." title="상대방의 계좌 정보를 입력하면 신고 이력과 대조해 의심 여부를 확인합니다." description="정확한 정보를 입력해 주세요." />

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[760px_1fr]">
        <Card className="p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium text-ink-500" htmlFor="bank">은행</label>
              <div className="relative mt-3">
                <select id="bank" value={bankName} onChange={(event) => setBankName(event.target.value)} className="h-[58px] w-full appearance-none rounded-xl bg-surface-input px-5 pr-12 text-[16px] text-ink-900 outline-none ring-1 ring-transparent focus:ring-brand-blue">
                  <option value="" disabled>은행을 선택하세요</option>
                  {banks.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 rotate-90 text-ink-500">›</span>
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-ink-500" htmlFor="recipientName">예금주명</label>
              <input id="recipientName" value={recipientName} onChange={(event) => setRecipientName(event.target.value.slice(0, 20))} placeholder="예: 홍길동" className="mt-3 h-[58px] w-full rounded-xl bg-surface-input px-5 text-[16px] text-ink-900 placeholder:text-ink-500 outline-none ring-1 ring-transparent focus:ring-brand-blue" />
            </div>
          </div>

          <label className="mt-7 block text-[14px] font-medium text-ink-500" htmlFor="accountNumber">계좌번호</label>
          <input id="accountNumber" inputMode="numeric" maxLength={16} value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="숫자만 입력하세요" className="mt-3 h-[58px] w-full rounded-xl bg-surface-input px-5 text-[16px] tracking-[0.04em] text-ink-900 placeholder:tracking-normal placeholder:text-ink-500 outline-none ring-1 ring-transparent focus:ring-brand-blue" />
          <div className="mt-2 flex justify-between text-[12px] text-ink-500"><span>은행별 계좌번호 길이는 다를 수 있어요. 숫자만 입력해 주세요.</span><span>{accountNumber.length}/16</span></div>

          {(bankName || accountNumber || recipientName) && (
            <div className="mt-6 rounded-2xl border border-border-subtle bg-surface-input p-4 text-[14px] text-ink-700">
              <p className="font-semibold text-ink-900">입력 정보 미리보기</p>
              <p className="mt-2">{bankName || '은행 미선택'} · {recipientName || '예금주 미입력'} · {accountNumber ? `•••• ${accountNumber.slice(-4)}` : '계좌번호 미입력'}</p>
            </div>
          )}

          <Button type="submit" className="mt-7" disabled={!canSubmit}>{isSubmitting ? '확인 중…' : '계좌 확인하기'}</Button>
        </Card>

        <Card className="p-8">
          <h2 className="text-[21px] font-semibold text-ink-900">계좌 확인 전</h2>
          <ul className="mt-8 flex flex-col gap-8">
            {CHECK_STEPS.map((step) => (
              <li key={step.order} className="flex gap-4">
                <IconCircle tone="brand" size={40} rounded="rounded-xl"><span className="text-[16px]">{step.order}</span></IconCircle>
                <div><p className="text-[16px] font-semibold text-ink-700">{step.title}</p><p className="mt-1.5 text-[13px] text-ink-500">{step.description}</p></div>
              </li>
            ))}
          </ul>
        </Card>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#132238]/35 px-5" role="dialog" aria-modal="true" aria-labelledby="account-confirm-title">
          <div className="w-full max-w-[440px] rounded-[20px] bg-white p-7 shadow-2xl">
            <Badge tone="brand">최종 확인</Badge>
            <h2 id="account-confirm-title" className="mt-5 text-[24px] font-bold text-ink-900">{recipientName}님에게 송금하는 게 맞으신가요?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-500">{bankName} · 계좌 끝자리 {accountNumber.slice(-4)} 정보를 확인한 뒤 계속해 주세요.</p>
            <div className="mt-7 flex gap-3"><Button variant="secondary" fullWidth onClick={() => setShowConfirm(false)}>다시 확인</Button><Button fullWidth onClick={() => void confirmAccount()}>맞아요, 조회하기</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
