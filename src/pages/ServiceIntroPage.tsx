import { Link } from 'react-router-dom';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import IconCircle from '@/components/common/IconCircle';
import PageHeading from '@/components/common/PageHeading';
import { ROUTES } from '@/constants/nav';

const SERVICES = [
  { step: '01', tone: 'brand' as const, title: '대화 이미지 분석', description: '메신저 캡처에서 텍스트를 추출하고 시간 압박, 기관 사칭, 개인정보 요구처럼 주의할 표현을 정리합니다.' },
  { step: '02', tone: 'success' as const, title: '계좌 정보 확인', description: '은행과 계좌 정보를 신고 이력과 대조하고, 송금 전에 다시 확인할 항목을 안내합니다.' },
  { step: '03', tone: 'warning' as const, title: '금액별 송금 가이드', description: '송금 예정 금액을 소액·중액·고액 구간으로 나누어 필요한 점검 절차를 보여줍니다.' },
  { step: '04', tone: 'brand' as const, title: '가족과 결과 공유', description: '혼자 판단하기 어려울 때 분석 요약을 링크로 공유해 가족과 함께 확인할 수 있습니다.' },
];

export default function ServiceIntroPage() {
  return (
    <div>
      <PageHeading eyebrow="서비스 알아보기" title="한 번의 판단보다, 여러 정보를 함께 확인합니다." description="금융 AI 안전 가이드는 대화·계좌·송금 금액을 각각 확인하고 마지막에 사용자가 직접 점검하도록 돕는 예방 서비스입니다." />

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Card key={service.step} className="p-7">
            <div className="flex items-start gap-5">
              <IconCircle tone={service.tone} size={48} rounded="rounded-2xl"><span className="text-[15px] font-bold">{service.step}</span></IconCircle>
              <div><h2 className="text-[19px] font-semibold text-ink-900">{service.title}</h2><p className="mt-2 text-[14px] leading-relaxed text-ink-500">{service.description}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center">
        <div><Badge tone="brand">추천 시작 순서</Badge><p className="mt-3 text-[18px] font-semibold text-ink-900">의심스러운 대화가 있다면 먼저 AI 대화 분석부터 시작해 보세요.</p></div>
        <Link to={ROUTES.chatAnalysisUpload}><Button size="lg">대화 분석 시작</Button></Link>
      </Card>
    </div>
  );
}
