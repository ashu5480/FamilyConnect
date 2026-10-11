import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-500">
        <p className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-brand-100 text-brand-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          FamilyConnect — keep your family in sync.
        </p>
        <div className="flex flex-col items-center sm:items-end gap-1">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-ink-900 transition-colors">
              Home
            </Link>
            <Link href="/events" className="hover:text-ink-900 transition-colors">
              Events
            </Link>
            <Link href="/connections" className="hover:text-ink-900 transition-colors">
              Connections
            </Link>
          </div>
          <p className="text-xs text-ink-400">
            Created by JIYAI Technology · Founder: Ashutosh Singh
          </p>
        </div>
      </div>
    </footer>
  );
}
