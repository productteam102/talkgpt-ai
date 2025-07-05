import ChatInterface from "@/components/chat-interface"
import { SidebarNav } from "@/components/sidebar-nav"

export default function HomePage() {
  return (

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <SidebarNav />
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <img src="/logo.png" alt="TalkGPT Logo" className="w-full h-full rounded-lg" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TalkGPT
              </h1>
            </div>
            <div className="w-10" /> {/* Spacer for balance */}
          </div>
        </header>

        {/* Chat Interface */}
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] lg:min-h-screen px-4 py-6">
          <div className="w-full max-w-4xl">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  )
}