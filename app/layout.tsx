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
        <meta name="0a0b01ea9e34a49669e2490559e4d39b1d507db1" content="0a0b01ea9e34a49669e2490559e4d39b1d507db1" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body>
        {children}
        {/* HilltopAds Popunder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(kyizrc){
                var d = document,
                    s = d.createElement('script'),
                    l = d.scripts[d.scripts.length - 1];
                s.settings = kyizrc || {};
                s.src = "//webbed-leadership.com/c/DV9.6fb-2L5Yl/SVW/Qg9JNij/Q/3fNBDpgz5/MuSD0M2bNmD-cX0MOoD/kbyj";
                s.async = true;
                s.referrerPolicy = 'no-referrer-when-downgrade';
                l.parentNode.insertBefore(s, l);
              })({})
            `,
          }}
        />
      </body>
    </html>
  );
}
