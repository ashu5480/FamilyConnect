'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = user
    ? [
        { href: '/home', label: 'Home' },
        { href: '/family', label: 'Family hub' },
        { href: '/events', label: 'Events' },
        { href: '/connections', label: 'Connections' },
      ]
    : [
        { href: '/home', label: 'Home' },
        { href: '/family', label: 'Family hub' },
        { href: '/events', label: 'Events' },
      ];

  return (
    <nav
      className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 border-b border-ink-200 bg-ink-50/80 backdrop-blur-lg h-16 flex items-center justify-center gap-1"
      aria-label="Primary"
    >
      <div className="flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href
                ? 'bg-brand-100 text-brand-600'
                : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {!user && (
        <div className="ml-4 flex items-center gap-2">
          <Link
            href="/login"
            className="btn ghost btn-sm"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="btn-primary btn-sm"
          >
            Create family
          </Link>
        </div>
      )}
      {user && (
        <button
          onClick={logout}
          className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-danger-500 hover:bg-danger-50 hover:text-danger-600 transition-colors"
        >
          Sign out
        </button>
      )}
    </nav>
  );
}
