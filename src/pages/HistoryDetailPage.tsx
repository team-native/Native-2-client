import { Link, useParams } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import { ROUTES } from '@/constants/nav';
import { getHistory, type ActivityRecord } from '@/utils/activity';

const TYPE_LABEL: Record<ActivityRecord['type'], string> = {
  chat: '대화 분석',
  account: '계좌 조회',
  transfer: '송금 가이드',
};

const TYPE_TONE: Record<ActivityRecord['type'], 'brand' | 'success' | 'warning'> = {
  chat: 'brand',
  account: 'success',
  transfer: 'warning',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryDetailPage() {
  const { id } = useParams();
  const record = getHistory().find((item) => item.id === id);

  if (!record) {
    return (
      <div>
        <PageHeading
          eyebrow="검사 기록"
          title="검사 기록을 찾을 수 없어요."
          description="기록이 삭제되었거나 현재 브라우저에 저장되어 있지 않습니다."
        />
        <Card className="mt-10 p-8">
          <Link to={ROUTES.history}><Button>검사 기록으로 돌아가기</Button></Link>
        </Card>
      </div>
    );
  }

  const isChat = record.type === 'chat';
  const isAccount = record.type === 'account';

  const detailItems = isChat
    ? ['급하게 판단하도록 재촉하는 표현이 있는지 확인했어요.', '기관이나 담당자를 사칭하는 표현이 있는지 확인했어요.', '개인정보나 인증 정보를 요구하는 표현이 있는지 확인했어요.']
    : isAccount
      ? ['입력한 은행과 계좌 정보를 다시 확인했어요.', '예금주와 송금 목적을 함께 확인했어요.', '대화 내용과 계좌 정보가 일치하는지 점검했어요.']
      : ['상대방 정보를 확인했어요.', '송금 사유를 다시 확인했어요.', '대화 내용과 금액을 다시 점검했어요.'];

  return (
    <div>
      <Link to={ROUTES.history} className="inline-flex text-[14px] font-semibold text-brand-blue hover:underline">← 검사 기록 목록으로</Link>
      <PageHeading
        className="mt-6"
        eyebrow={TYPE_LABEL[record.type]}
        title={record.title}
        description="검사를 진행했을 당시 저장된 결과를 다시 확인할 수 있습니다."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Badge tone={TYPE_TONE[record.type]}>{record.status}</Badge>
            <span className="text-[13px] text-ink-500">{formatDate(record.createdAt)}</span>
          </div>
          <p className="mt-8 text-[22px] font-semibold leading-relaxed text-ink-900">{record.summary}</p>
          {typeof record.riskScore === 'number' && (
            <div className="mt-10 rounded-2xl bg-brand-soft p-6">
              <p className="text-[14px] font-medium text-ink-500">검사 당시 위험도</p>
              <p className="mt-2 text-[48px] font-bold leading-none text-brand-blue">
                {record.riskScore}<span className="ml-1 text-[16px] font-medium text-ink-500">/ 100</span>
              </p>
            </div>
          )}
        </Card>

        <Card className="p-8">
          <h2 className="text-[20px] font-semibold text-ink-900">당시 확인한 항목</h2>
          <div className="mt-6 flex flex-col gap-4">
            {detailItems.map((item, index) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl bg-surface-input p-4">
                <IconCircle tone={index === 0 && isChat ? 'warning' : 'success'} size={34} rounded="rounded-xl">
                  <span className="text-[15px] font-bold">{index + 1}</span>
                </IconCircle>
                <p className="pt-1 text-[15px] leading-relaxed text-ink-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 flex flex-col justify-between gap-5 p-7 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[18px] font-semibold text-ink-900">다시 확인이 필요하신가요?</h2>
          <p className="mt-2 text-[14px] text-ink-500">새로운 정보가 생겼다면 다시 검사하는 것이 좋아요.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={record.type === 'chat' ? ROUTES.chatAnalysisUpload : record.type === 'account' ? ROUTES.accountCheck : ROUTES.transferAmount}>
            <Button>다시 검사하기</Button>
          </Link>
          {(record.type === 'chat' || record.status.includes('주의')) && (
            <Link to={ROUTES.help}><Button variant="secondary">지금 할 일 확인하기</Button></Link>
          )}
        </div>
      </Card>
    </div>
  );
}
