import type React from "react"
import Script from "next/script"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalkGPT – AI Homework Help & Study Assistant",
  description:
    "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds. Your friendly AI study companion for better grades.",
  keywords: [
    "homework help",
    "AI study assistant",
    "study tools",
    "math solver",
    "flashcards",
    "student learning",
    "TalkGPT",
    "AI tutor",
    "academic support",
    "learning companion"
  ],
  authors: [{ name: "TalkGPT Team" }],
  creator: "TalkGPT",
  publisher: "TalkGPT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talkgpt-ai.fun/",
    siteName: "TalkGPT",
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds. Your friendly AI study companion for better grades.",
    images: [
      {
        url: "/logo-social.png",
        width: 1200,
        height: 630,
        alt: "TalkGPT - AI Homework Help & Study Assistant",
        type: "image/png",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "TalkGPT Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TalkGPT",
    creator: "@TalkGPT",
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds.",
    images: ["/logo-social.png"],
  },
  alternates: {
    canonical: "https://talkgpt-ai.fun/",
  },
  category: "education",
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
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#a855f7" />
        <meta name="msapplication-TileColor" content="#a855f7" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ✅ Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7695206971263795"
          crossOrigin="anonymous"
        />
        
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

        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TalkGPT",
              "description": "AI-powered homework help and study assistant for students",
              "url": "https://talkgpt-ai.fun/",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "TalkGPT Team"
              },
              "featureList": [
                "AI homework assistance",
                "Math problem solving",
                "Study material summarization",
                "Flashcard generation",
                "Image analysis for homework"
              ]
            })
          }}
        />
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

        {/* ✅ Social Bar Ad Script */}
        <Script
          id="social-bar-ad"
          src="//headlongrelic.com/fa/0e/bd/fa0ebdfbcff288b40e1fe21c687453bf.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}