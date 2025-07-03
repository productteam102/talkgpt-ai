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
        <meta name="pushsdk" content="9d0963d4a8c8deb74354a6fc838451bf" />
        <meta name="0a0b01ea9e34a49669e2490559e4d39b1d507db1" content="0a0b01ea9e34a49669e2490559e4d39b1d507db1" />

        {/* Back_Button_Zone script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Back_Button_Zone = 9510232;
              var Domain_TB = "g0st.com";
            `,
          }}
        />
        <script
          async
          src="https://desenteir.com/aee/d31eb/reverse.min.js?sf=1"
        ></script>

        {/* clickTbEventInit script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                  var clickUrl = "https://toopsoug.net/4/9510246?var={your_source_id}";
  
                  function clickTbEventInit() {
                      document.addEventListener('click', function () {
                          window.onbeforeunload = null;
                          window.open(clickUrl, '_blank', 'noreferrer,noopener');
                      });
                  }
  
                  setTimeout(function () {
                      clickTbEventInit();
                  }, 1000);
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
