// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="monetag" content="ec1384ae1e3c8ca4196ec1226306ecac" />
        {/* Monetag script zone 154789 */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="154789"
          async
          data-cfasync="false"
        ></script>
        {/* Monetag script zone 154787 */}
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="154787"
          async
          data-cfasync="false"
        ></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
