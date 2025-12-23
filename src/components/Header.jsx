import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/logo.svg';

export default function Header() {
  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-accent-primary'
      : 'text-text-primary hover:text-accent-primary transition-colors';

  return (
    <header className="bg-base-secondary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src={Logo} alt="iGarden" className="w-9 h-9" />
            <span className="hidden md:inline text-lg font-semibold text-text-primary">iGarden</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClasses}>
            All Posts
          </NavLink>
          <NavLink to="/archives" className={navLinkClasses}>
            Archives
          </NavLink>
          <Link to="/subscribe" className="btn ml-2 hidden lg:inline-block">
            Subscribe
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md text-text-primary hover:bg-glass focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-base-secondary border-t border-border ${open ? 'block' : 'hidden'}`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClasses}>
            All Posts
          </NavLink>
          <NavLink to="/archives" onClick={() => setOpen(false)} className={navLinkClasses}>
            Archives
          </NavLink>
          <Link to="/subscribe" className="btn w-full text-center">
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
}