'use client';

interface IconProps {
  className?: string;
}

function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="h-20 border-b border-white/10 backdrop-blur-xl bg-slate-900/50 px-8 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <SearchIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <BellIcon className="w-6 h-6 text-white/60" />
        </button>
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <span className="text-emerald-500">S</span>
        </div>
      </div>
    </header>
  );
} 