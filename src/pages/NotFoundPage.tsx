import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/nav';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="text-[15px] font-medium text-brand-blue">404</p>
      <h1 className="mt-4 text-[28px] font-bold text-ink-900">페이지를 찾을 수 없습니다.</h1>
      <p className="mt-3 text-[15px] text-ink-500">주소를 다시 확인해 주세요.</p>
      <Link to={ROUTES.home}>
        <Button className="mt-8">홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}
