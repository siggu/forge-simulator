import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '원숭이 시뮬레이터 - 무기 강화 · 확률 뽑기 시뮬레이션',
  description: '게임 속 무기 강화, 열쇠 뽑기, 강화 확률 등을 실제처럼 시뮬레이션하는 웹페이지',
  keywords: ['원숭이 시뮬레이터', '무기 강화 시뮬레이터', '강화 확률 계산기', '뽑기 시뮬레이션', '강화 시뮬레이터'],
  openGraph: {
    type: 'website',
    url: 'https://forge-simulator.vercel.app/',
    title: '원숭이 시뮬레이터 - 무기 강화 · 확률 시뮬레이션',
    description: '게임 속 무기 강화, 열쇠 뽑기 등을 실제처럼 테스트해보세요!',
    images: [
      {
        url: 'https://forge-simulator.vercel.app/icons/monkey.png',
        alt: '원숭이 시뮬레이터 대표 이미지',
      },
    ],
    siteName: '원숭이 시뮬레이터',
    locale: 'ko_KR',
  },
  metadataBase: new URL('https://forge-simulator.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        {/* Google Verification */}
        <meta name='google-site-verification' content='ptwi9qcjNcNSLefzQrJl2MtzMsg_djljtWOYQoRY07k' />

        {/* Viewport & Robots */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='robots' content='index, follow' />

        {/* Favicon & Manifest */}
        <link rel='icon' href='/icons/monkey.png' />
        <link rel='apple-touch-icon' href='/icons/monkey.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#317EFB' />

        {/* 구조화 데이터 */}
        <Script id='structured-data' type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: '원숭이 시뮬레이터',
            url: 'https://forge-simulator.vercel.app/',
            description: '무기 강화, 뽑기, 확률 실험을 웹에서 시뮬레이션해보는 재미있는 도구입니다.',
          })}
        </Script>

        {/* Google Analytics */}
        <Script strategy='afterInteractive' src='https://www.googletagmanager.com/gtag/js?id=G-BF8NW4Z37P' />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BF8NW4Z37P', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
