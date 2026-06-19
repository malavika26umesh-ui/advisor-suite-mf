import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChartBar, List, X } from '@phosphor-icons/react';
import { Button } from '../ui';

// ─────────────────────────────────────────────
// Nav link definition
// ─────────────────────────────────────────────
interface NavItem {
  label: string;
  to: string;
}

const INVESTOR_LINKS: NavItem[] = [
  { label: 'FAQ Centre', to: '/faq' },
  { label: 'Education Hub', to: '/education' },
];

// ─────────────────────────────────────────────
// Shared active link class helper
// ─────────────────────────────────────────────
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-[14px] font-medium text-white transition-colors duration-150',
    'hover:text-white/80',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded',
    isActive
      ? 'underline underline-offset-4 decoration-brand-saffron decoration-2'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

// ─────────────────────────────────────────────
// NavBar component
// ─────────────────────────────────────────────
export const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const toggleDrawer = useCallback(() => setDrawerOpen((o) => !o), []);

  return (
    <>
      {/* ── Main nav bar ──────────────────────────────── */}
      <header
        className="sticky top-0 z-50 bg-brand-navy"
        style={{ height: '64px' }}
      >
        <nav
          className="h-full flex items-center justify-between px-6 max-w-max-width mx-auto"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
            aria-label="AdvisorSuite MF — Home"
          >
            <ChartBar size={24} weight="bold" className="text-brand-saffron" aria-hidden="true" />
            <span className="text-white font-heading font-bold text-[18px] leading-none tracking-tight">
              AdvisorSuite<span className="text-brand-saffron"> MF</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {INVESTOR_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}

            {/* Book Advisor Call — saffron pill */}
            <Link to="/schedule">
              <Button variant="primary" size="sm" id="nav-book-advisor-cta">
                Book Advisor Call
              </Button>
            </Link>

            {/* Separator */}
            <div className="h-5 w-px bg-white/20" aria-hidden="true" />

            {/* Advisor login */}
            <NavLink
              to="/advisor/login"
              className={({ isActive }) =>
                [
                  'text-[13px] text-white/80 hover:text-white transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded',
                  isActive ? 'text-white font-medium' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              Advisor Login
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={toggleDrawer}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {drawerOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <List size={22} aria-hidden="true" />
            )}
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {/* Backdrop */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-neutral-900/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          'fixed top-[64px] right-0 bottom-0 z-50 w-72 bg-brand-navy flex flex-col',
          'transition-transform duration-250 ease-in-out md:hidden',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile navigation">
          {INVESTOR_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'block px-4 py-3 rounded-lg text-[15px] font-medium text-white',
                  'hover:bg-white/10 transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                  isActive ? 'bg-white/10 border-l-2 border-brand-saffron' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="my-3 border-t border-white/10" />

          <Link
            to="/schedule"
            className="block px-4 py-3 rounded-lg text-[15px] font-semibold text-white bg-brand-saffron hover:bg-warning-500 transition-colors duration-150 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Book Advisor Call
          </Link>

          <NavLink
            to="/advisor/login"
            className={({ isActive }) =>
              [
                'block px-4 py-3 rounded-lg text-[13px] text-white/70 hover:text-white',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                isActive ? 'text-white' : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            Advisor Login
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
