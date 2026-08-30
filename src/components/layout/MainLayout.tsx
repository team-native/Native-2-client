import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 lg:px-[72px]">
        <Outlet />
      </main>
    </div>
  );
}
