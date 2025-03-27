'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IconProps {
  className?: string;
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function TransactionIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 bg-slate-900/50 backdrop-blur-xl border-r border-white/10">
      <div className="p-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8">
          <span className="text-emerald-500">B</span>
        </div>
        
        <nav className="space-y-4">
          <Link href="/home" className={`w-12 h-12 rounded-xl ${pathname === '/home' ? 'bg-white/10' : 'hover:bg-white/10'} transition-colors flex items-center justify-center ${pathname === '/home' ? 'text-white/80' : 'text-white/60'}`}>
            <HomeIcon className="w-6 h-6" />
          </Link>
          <Link href="/charts" className={`w-12 h-12 rounded-xl ${pathname === '/charts' ? 'bg-white/10' : 'hover:bg-white/10'} transition-colors flex items-center justify-center ${pathname === '/charts' ? 'text-white/80' : 'text-white/60'}`}>
            <ChartIcon className="w-6 h-6" />
          </Link>
          <Link href="/transactions" className={`w-12 h-12 rounded-xl ${pathname === '/transactions' ? 'bg-white/10' : 'hover:bg-white/10'} transition-colors flex items-center justify-center ${pathname === '/transactions' ? 'text-white/80' : 'text-white/60'}`}>
            <TransactionIcon className="w-6 h-6" />
          </Link>
          <button className="w-12 h-12 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center text-white/60">
            <SettingsIcon className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </aside>
  );
} 