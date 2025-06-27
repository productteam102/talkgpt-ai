import Link from "next/link"
import Image from "next/image"
import ChatInterface from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { HomeIcon, UserIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="TalkGPT Logo" width={48} height={48} className="rounded-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TalkGPT
                </h1>
                <p className="text-sm text-gray-500">{""}</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-purple-600">
                <Link href="/" className="flex items-center space-x-2">
                  
                  
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-purple-600">
                <Link href="/profile" className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Layout */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6">
        <div className="w-full max-w-4xl">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
