import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalkGPT – AI Homework Help & Study Assistant",
  description:
    "Get fast, accurate AI homework help and study support with TalkGPT. Solve math problems, summarize topics, and create flashcards in seconds.",
  keywords: [
    "homework help", "AI study assistant", "study tools", "math solver",
    "flashcards", "student learning", "TalkGPT", "AI tutor",
    "academic support", "learning companion",
  ],
  creator: "TalkGPT",
  publisher: "TalkGPT",
  alternates: { canonical: "https://talkgpt-ai.fun/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talkgpt-ai.fun/",
    siteName: "TalkGPT",
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT.",
    images: [{ url: "/logo-social.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TalkGPT",
    creator: "@TalkGPT",
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT.",
    images: ["/logo-social.png"],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#a855f7" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
