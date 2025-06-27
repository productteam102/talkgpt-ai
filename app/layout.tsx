import type React from "react"
import Script from "next/script"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalkGPT – AI Homework Help & Study Assistant",
  description:
    "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds.",
  keywords: [
    "homework help",
    "AI study assistant",
    "study tools",
    "math solver",
    "flashcards",
    "student learning",
    "TalkGPT"
  ],
  openGraph: {
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds.",
    url: "https://talkgpt-ai.fun/",
    siteName: "TalkGPT",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "TalkGPT Logo",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* ✅ Google Ads Tag - gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17079833619"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17079833619');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        
        {/* ✅ Native Banner Ad Container */}
        <div id="container-c1836fc2d064a907c625aafd581a89ea" />

        {/* ✅ Native Banner Ad Script */}
        <Script id="native-banner" strategy="afterInteractive">
          {`
            (function() {
              var s = document.createElement('script');
              s.setAttribute('data-cfasync', 'false');
              s.src = '//headlongrelic.com/c1836fc2d064a907c625aafd581a89ea/invoke.js';
              s.async = true;
              document.body.appendChild(s);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
