import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

/**
 * PageLayout — wraps every investor-facing route.
 * Used as the React Router `element` for the root layout route.
 * Structure: NavBar (sticky) → <Outlet /> → Footer
 */
export const PageLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-neutral-50">
    <NavBar />
    <main id="main-content" className="flex-1" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PageLayout;
