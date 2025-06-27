import type React from "react"
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
    url: "https://https://talkgpt-ai.fun/",
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
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
