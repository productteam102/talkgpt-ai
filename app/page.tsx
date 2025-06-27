import Link from "next/link"
import ChatInterface from "@/components/chat-interface"
import Image from "next/image"

const renderMessage = (content: string) => {
  // Simple markdown-like rendering without KaTeX
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    .replace(/\n/g, "<br>")
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/talkgpt-logo.png"
                  alt="TalkGPT Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TalkGPT
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Layout */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6">
        <div className="w-full max-w-4xl">
          <ChatInterface renderMessage={renderMessage} />
        </div>
      </main>
    </div>
  )
}
