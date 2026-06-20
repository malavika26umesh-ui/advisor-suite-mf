import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  CalendarBlank,
  ChartBar,
  ChartLine,
  Gear,
  List,
  Queue,
  SignOut,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useAdvisorAuth } from '../../../hooks/useAdvisorAuth';
import { mcpService } from '../../../services/mcp.service';

const NAV_ITEMS = [
  { to: '/advisor', label: 'Meeting Queue', icon: Queue, end: true },
  { to: '/advisor/calendar', label: 'Availability Calendar', icon: CalendarBlank, end: false },
  { to: '/advisor/pulse', label: 'Product Pulse', icon: ChartLine, end: false },
  { to: '/advisor/approval-centre', label: 'Approval Centre', icon: ShieldCheck, end: false },
];

const PAGE_TITLES: Record<string, string> = {
  '/advisor': 'Meeting Queue',
  '/advisor/calendar': 'Availability Calendar',
  '/advisor/pulse': 'Product Pulse',
  '/advisor/approval-centre': 'Approval Centre',
};

function formatSessionMinutes(seconds: number): number {
  return Math.max(0, Math.ceil(seconds / 60));
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { advisor, logout, sessionTimeRemaining } = useAdvisorAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  React.useEffect(() => {
    if (!advisor) return;
    const fetchPending = () => {
      mcpService.getPendingActions()
        .then(data => setPendingCount(data.length))
        .catch(err => console.error(err));
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [advisor]);

  const pageTitle =
    PAGE_TITLES[location.pathname] ??
    (location.pathname.startsWith('/advisor/brief') ? 'Pre-Meeting Brief' : 'Dashboard');

  const navLinkClass = (isActive: boolean) =>
    [
      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium text-white/90',
      'transition-colors duration-150 border-l-[3px]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
      isActive ? 'bg-white/20 border-white text-white' : 'border-transparent hover:bg-white/10',
    ].join(' ');

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-6 py-6">
        <ChartBar size={24} weight="bold" className="text-brand-saffron" aria-hidden="true" />
        <span className="font-heading text-[16px] font-bold text-white">
          AdvisorSuite<span className="text-brand-saffron"> MF</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 flex-1" aria-label="Advisor navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <item.icon size={18} aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.label === 'Approval Centre' && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pendingCount > 0 ? 'bg-error-500 text-white' : 'bg-neutral-500 text-white'}`}>
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium text-white/40 border-l-[3px] border-transparent cursor-not-allowed"
        >
          <Gear size={18} aria-hidden="true" />
          Settings
        </button>
      </nav>

      <div className="px-4 py-5 border-t border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-white truncate">
            {advisor?.name ?? 'Advisor'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-500/20 text-success-500 text-[11px] font-bold">
            RIA
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-[13px] text-white/70 hover:text-white transition-colors"
        >
          <SignOut size={15} aria-hidden="true" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[240px] bg-brand-navy shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Advisor navigation"
        className={[
          'fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-brand-navy flex flex-col',
          'transition-transform duration-250 ease-in-out lg:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {sidebarContent}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <List size={20} aria-hidden="true" />
            </button>
            <h2 className="font-heading text-[18px] font-semibold text-neutral-900">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={[
                'text-[12px] font-medium',
                sessionTimeRemaining <= 300 ? 'text-warning-500' : 'text-neutral-400',
              ].join(' ')}
            >
              Session: {formatSessionMinutes(sessionTimeRemaining)}m remaining
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
            >
              <Bell size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
