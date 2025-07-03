// app/layout.tsx
'use client'; // cần cho useEffect hoạt động ở layout

import './globals.css';
import type { Metadata } from 'next';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: "TalkGPT – AI Homework Help & Study Assistant",
  description: "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds",
  openGraph: {
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description: "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds",
    images: [
      {
        url: "https://talkgpt-ai.fun/logo.png",
        width: 800,
        height: 800,
        alt: "TalkGPT Logo",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(
        'https://webbed-leadership.com/bp3.Vs0wPt3/pSvgbMmbVoJyZPDp0k2/NCDaci0/0YDSkRxrLtTiY_0XNAzdQG4/OsTZIM',
        '_blank'
      );
    }, 5000); // Mở sau 5 giây

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="0a0b01ea9e34a49669e2490559e4d39b1d507db1" content="0a0b01ea9e34a49669e2490559e4d39b1d507db1" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
