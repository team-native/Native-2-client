import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import PageHeading from '@/components/common/PageHeading';
import { clearHistory, getHistory, type ActivityRecord } from '@/utils/activity';
import { ROUTES } from '@/constants/nav';

const TYPE_LABEL: Record<ActivityRecord['type'], string> = { chat: '대화 분석', account: '계좌 조회', transfer: '송금 가이드' };

export default function HistoryPage() {
  const [records, setRecords] = useState(() => getHistory());
  const grouped = useMemo(() => records, [records]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <PageHeading eyebrow="검사 기록" title="이전에 확인했던 기록을 모아봤어요." description="이 브라우저에서 진행한 대화 분석, 계좌 조회, 송금 점검 기록을 최신순으로 확인할 수 있습니다." />
        {records.length > 0 && <Button variant="secondary" onClick={() => { clearHistory(); setRecords([]); }}>기록 전체 삭제</Button>}
      </div>

      <div className="mt-10">
        {grouped.length === 0 ? (
          <Card className="p-12 text-center"><p className="text-[20px] font-semibold text-ink-900">아직 저장된 검사 기록이 없어요.</p><p className="mt-3 text-[14px] text-ink-500">대화 분석이나 계좌 조회를 완료하면 이곳에 자동으로 기록됩니다.</p></Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {grouped.map((record) => (
              <Link key={record.id} to={ROUTES.historyDetail.replace(':id', record.id)} className="block">
                <Card className="flex cursor-pointer flex-col justify-between gap-5 p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Badge tone={record.type === 'chat' ? 'brand' : record.type === 'account' ? 'success' : 'warning'}>{TYPE_LABEL[record.type]}</Badge><span className="text-[12px] text-ink-500">{new Date(record.createdAt).toLocaleString('ko-KR')}</span></div><h2 className="mt-3 text-[18px] font-semibold text-ink-900">{record.title}</h2><p className="mt-2 truncate text-[14px] text-ink-500">{record.summary}</p></div>
                  <div className="flex shrink-0 items-center gap-5 text-left sm:text-right"><div><p className="text-[14px] font-semibold text-ink-700">{record.status}</p>{typeof record.riskScore === 'number' && <p className="mt-1 text-[24px] font-bold text-brand-blue">{record.riskScore}<span className="text-[13px] font-medium text-ink-500"> / 100</span></p>}</div><span className="text-[20px] text-ink-500">→</span></div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
