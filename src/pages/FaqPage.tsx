import Card from '@/components/common/Card';
import PageHeading from '@/components/common/PageHeading';

const FAQS = [
  ['분석 결과가 사기 여부를 확정해 주나요?', '아니요. 분석 결과는 위험 신호를 다시 살펴볼 수 있도록 돕는 참고 정보입니다. 중요한 송금은 공식 기관의 연락처와 계좌 정보를 별도로 확인해 주세요.'],
  ['대화 이미지는 어떤 형식으로 올릴 수 있나요?', '현재 프론트에서는 PNG와 JPG 이미지를 여러 장 선택할 수 있도록 구현되어 있습니다.'],
  ['계좌번호는 몇 자리까지 입력할 수 있나요?', '은행마다 계좌번호 형식이 달라서 숫자 기준 최대 16자리까지 입력할 수 있게 했습니다. 실제 연동 시 백엔드의 은행별 검증 규칙과 맞추면 됩니다.'],
  ['백엔드가 아직 없어도 화면을 확인할 수 있나요?', '네. API 주소가 설정되지 않은 개발 환경에서는 주요 분석·공유 화면이 데모 데이터로 동작하도록 구성했습니다.'],
  ['검사 기록은 어디에 저장되나요?', '현재 버전은 브라우저 localStorage에 최근 기록을 저장합니다. 로그인 기능과 서버가 붙으면 사용자별 서버 기록으로 교체할 수 있습니다.'],
  ['가족 공유 링크에 개인정보가 포함되나요?', '실제 서비스 연동 전에는 공유 데이터 구조를 최소화하고, 계좌번호나 민감정보는 링크 payload에 직접 넣지 않는 방식이 권장됩니다.'],
];

export default function FaqPage() {
  return <div><PageHeading eyebrow="자주 묻는 질문" title="사용 전에 궁금한 내용을 확인하세요." description="서비스 동작 방식과 개발 단계에서 자주 확인할 내용을 정리했습니다." /><div className="mt-10 grid gap-4">{FAQS.map(([question, answer], index) => <Card key={question} className="p-6"><details open={index === 0} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-ink-900"><span>{question}</span><span className="text-brand-blue transition-transform group-open:rotate-45">＋</span></summary><p className="mt-4 pr-8 text-[14px] leading-relaxed text-ink-500">{answer}</p></details></Card>)}</div></div>;
}
