import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ChatWidget from './components/chat/ChatWidget';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget AI",
  description: "Gérez vos finances intelligemment avec l'aide de l'IA",
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Budget AI',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
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
        
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="relative min-h-screen">
              {children}
            </main>
          </div>
        </div>
        <ChatWidget />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
