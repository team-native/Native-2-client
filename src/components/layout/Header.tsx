import { NavLink } from 'react-router-dom';
import { INFO_NAV_ITEMS, NAV_ITEMS } from '@/constants/nav';

function navClass(isActive: boolean) {
  return `relative flex h-full items-center whitespace-nowrap transition-colors ${
    isActive ? 'font-semibold text-brand-blue' : 'font-medium text-ink-500 hover:text-ink-900'
  }`;
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 h-[72px] w-full border-b border-border-subtle bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center px-6 lg:px-[72px]">
        <NavLink to="/" className="flex shrink-0 items-baseline gap-3.5">
          <span className="text-[20px] font-bold text-ink-900">이름넣기</span>
          <span className="hidden text-[14px] font-medium text-ink-500 sm:inline">금융 AI 안전 가이드</span>
        </NavLink>

        <nav className="ml-auto hidden h-full items-stretch gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => navClass(isActive)}>
              {({ isActive }) => (
                <>
                  <span className="text-[14px]">{item.label}</span>
                  {isActive && <span className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-brand-blue" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-7 hidden items-center gap-3 border-l border-border-subtle pl-6 xl:flex">
          {INFO_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-2 py-2 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-brand-blue-bg text-brand-blue' : 'text-ink-500 hover:bg-surface-input hover:text-ink-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <details className="relative ml-auto lg:hidden">
          <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-[14px] font-semibold text-ink-700">메뉴</summary>
          <div className="absolute right-0 top-12 w-48 rounded-2xl border border-border-subtle bg-white p-2 shadow-lg">
            {[...NAV_ITEMS, ...INFO_NAV_ITEMS].map((item) => (
              <NavLink key={item.path} to={item.path} className="block rounded-xl px-4 py-3 text-[14px] font-medium text-ink-700 hover:bg-brand-blue-bg hover:text-brand-blue">
                {item.label}
              </NavLink>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
