import ChatInterface from "@/components/chat-interface"
import { SidebarNav } from "@/components/sidebar-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Chat Interface */}
        <main className="flex-1 flex items-center justify-center min-h-screen px-4 py-6">
          <div className="w-full max-w-4xl">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  )
}