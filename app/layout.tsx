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

        {/* Google Tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17079833619"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17079833619');
            `,
          }}
        />
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
              })({});
            `,
          }}
        />

        {/* Webpush Push Notification */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,id){
                if(typeof(w.webpushr)!=='undefined') return;
                w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
                var js, fjs = d.getElementsByTagName(s)[0];
                js = d.createElement(s);
                js.id = id;
                js.async = 1;
                js.src = "https://cdn.webpushr.com/app.min.js";
                fjs.parentNode.appendChild(js);
              })(window,document, 'script', 'webpushr-jssdk');
              webpushr('setup',{
                key:'BFpmyk2QdlStzbFQxNaPo1zMgg6pUhhRGUhRxOiri3TM7dEKBuhrqVyJEqFhRgIQ_GfH7WS0dfyknaQh_6kGilM'
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
