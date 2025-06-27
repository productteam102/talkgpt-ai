import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TalkGPT – Your AI Study Buddy for Homework Help, Math, Flashcards & More",
  description:
    "Your friendly AI study assistant for Gen Z students. Get help with homework, create flashcards, and ace your studies!",
  images: [
      {
        url: "/images/logo.png", // ✅ relative path from public/
        width: 800,
        height: 600,
        alt: "TalkGPT Logo",
      },
    ],
  },

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
