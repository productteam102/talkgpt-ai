import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalkGPT – Your AI Study Buddy for Homework Help, Math, Flashcards & More",
  description:
    "TalkGPT is your fun and friendly AI study buddy! Get homework help, solve math problems, summarize topics, make flashcards, and test your knowledge – all in one place. Powered by smart AI, designed for Gen Z learners",
  keywords: [
    "AI study assistant",
    "homework help",
    "math solver",
    "flashcards",
    "quiz generator",
    "study chatbot",
    "Gen Z study tool",
    "AI learning buddy",
    "online study helper",
    "TalkGPT",
  ],
  openGraph: {
    title: "TalkGPT – Your AI Study Buddy",
    description:
      "Ask homework questions, break down math, and make flashcards with your AI-powered study assistant. Learning just got easier and more fun!",
    url: "https://yourdomain.com",
    siteName: "TalkGPT",
    images: [
      {
        url: "/images/talkgpt-logo.png",
        width: 1200,
        height: 630,
        alt: "TalkGPT – Your AI Study Buddy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkGPT – Your AI Study Buddy",
    description:
      "Make learning fun with your personal AI chatbot! Solve homework problems, summarize notes, and create study cards.",
    images: ["/images/talkgpt-logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XLRPK4BDWT" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XLRPK4BDWT');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
