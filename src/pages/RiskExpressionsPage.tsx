import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import PageHeading from '@/components/common/PageHeading';

const GROUPS = [
  { title: '시간을 급하게 재촉하는 표현', examples: ['지금 바로 보내야 해요', '오늘 안에 처리하지 않으면 문제가 생겨요', '확인할 시간 없이 즉시 송금해 주세요'], tip: '급한 상황을 강조하더라도 송금을 멈추고 상대방을 다른 채널로 다시 확인하세요.' },
  { title: '기관·지인을 사칭하는 표현', examples: ['고객센터에서 연락드렸습니다', '휴대폰이 고장 나서 다른 번호로 연락해', '수사기관이라 보안 때문에 비밀로 해야 합니다'], tip: '상대가 알려준 번호가 아니라 공식 홈페이지나 기존에 알고 있던 연락처로 직접 확인하세요.' },
  { title: '개인정보·인증정보를 요구하는 표현', examples: ['인증번호를 알려주세요', '비밀번호나 보안카드 번호가 필요합니다', '신분증 사진을 보내주세요'], tip: '비밀번호, 인증번호 같은 민감정보는 전달하지 말고 공식 절차인지 확인하세요.' },
  { title: '평소와 다른 송금 방식을 요구하는 표현', examples: ['다른 사람 명의 계좌로 보내주세요', '여러 계좌로 나눠서 보내주세요', '먼저 입금하면 바로 돌려드릴게요'], tip: '명의가 다르거나 송금 방식이 갑자기 바뀌면 이유를 별도로 확인하세요.' },
];

export default function RiskExpressionsPage() {
  return <div><PageHeading eyebrow="주의해야 할 표현" title="대화에서 이런 신호가 보이면 한 번 더 확인하세요." description="문장 하나만으로 위험을 확정할 수는 없지만, 여러 신호가 함께 나타나면 송금을 멈추고 교차 확인하는 것이 좋습니다." /><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">{GROUPS.map((group) => <Card key={group.title} className="p-7"><Badge tone="warning">주의 신호</Badge><h2 className="mt-4 text-[19px] font-semibold text-ink-900">{group.title}</h2><ul className="mt-5 flex flex-col gap-3">{group.examples.map((example) => <li key={example} className="rounded-xl bg-warning-bg-soft px-4 py-3 text-[14px] text-ink-700">“{example}”</li>)}</ul><p className="mt-5 border-t border-border-subtle pt-4 text-[13px] leading-relaxed text-ink-500"><strong className="text-ink-700">확인 방법:</strong> {group.tip}</p></Card>)}</div></div>;
}
