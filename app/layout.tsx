import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <UserProvider>
        <body className={`${inter.className} min-h-screen bg-[#0F172A]`}>
          <div className="fixed inset-0 -z-10">
            {/* Gradient principal */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            
            {/* Effets de lumière */}
            <div className="absolute top-0 left-1/4 w-3/4 h-1/2 bg-emerald-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-3/4 h-1/2 bg-blue-500/20 blur-[120px] rounded-full" />
            
            {/* Points lumineux */}
            <div className="absolute inset-0 bg-black/20" 
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />
          </div>
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
