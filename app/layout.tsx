// app/layout.tsx
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    "TalkGPT",
    "AI tutor",
    "academic support",
    "learning companion"
  ],
  creator: "TalkGPT",
  publisher: "TalkGPT",
  alternates: {
    canonical: "https://talkgpt-ai.fun/",
  },
  openGraph: {
    title: "TalkGPT – AI Homework Help & Study Assistant",
    description:
      "Get fast, accurate AI homework help and study support with TalkGPT.",
    url: "https://talkgpt-ai.fun/",
    siteName: "TalkGPT",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-social.png",
        width: 1200,
        height: 630,
        alt: "TalkGPT - AI Study Assistant",
      },
    ],
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Custom meta tag: Monetag example, add your own here */}
        <meta name="monetag" content="ec1384ae1e3c8ca4196ec1226306ecac" />
        {/* Any other custom meta, script, or link tags can go here */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
