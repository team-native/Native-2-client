import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import { ROUTES } from '@/constants/nav';

const ACTIONS = [
  { icon: '1', tone: 'warning' as const, title: '송금을 잠시 멈추세요', description: '상대방이 급하게 재촉하더라도 바로 송금하지 말고 한 번 더 확인하세요.' },
  { icon: '2', tone: 'brand' as const, title: '대화와 계좌 정보를 다시 확인하세요', description: '대화 속 요구 내용과 계좌 정보, 예금주 정보를 함께 비교해 보세요.' },
  { icon: '3', tone: 'success' as const, title: '공식 경로로 직접 확인하세요', description: '기관이나 업체를 주장하는 경우 상대가 알려준 연락처가 아닌 공식 채널을 이용하세요.' },
  { icon: '4', tone: 'brand' as const, title: '혼자 판단하기 어렵다면 함께 확인하세요', description: '가족이나 보호자에게 상황을 공유하고 한 번 더 확인해 보세요.' },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeading
        eyebrow="안전 도움"
        title="지금 바로 무엇을 확인하면 될까요?"
        description="위험 신호가 확인되었다고 해서 바로 결론을 내릴 필요는 없어요. 아래 순서대로 차분하게 다시 확인해 보세요."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {ACTIONS.map((action) => (
          <Card key={action.title} className="p-7 transition-shadow hover:shadow-md">
            <IconCircle tone={action.tone} size={48} rounded="rounded-2xl">
              <span className="text-[17px] font-bold">{action.icon}</span>
            </IconCircle>
            <h2 className="mt-6 text-[19px] font-semibold text-ink-900">{action.title}</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-500">{action.description}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-8">
        <Badge tone="brand">다시 확인하기</Badge>
        <h2 className="mt-5 text-[22px] font-semibold text-ink-900">확인 도구를 다시 이용해 보세요.</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">새로운 대화나 계좌 정보가 있다면 다시 분석한 뒤 여러 결과를 함께 비교하는 것이 좋아요.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to={ROUTES.chatAnalysisUpload}><Button>대화 다시 분석하기</Button></Link>
          <Link to={ROUTES.accountCheck}><Button variant="secondary">계좌 다시 조회하기</Button></Link>
          <Link to={ROUTES.familyShare}><Button variant="secondary">가족과 결과 공유하기</Button></Link>
        </div>
      </Card>
    </div>
  );
}
