import ChatInterface from "@/components/chat-interface"
import { SidebarLayout } from "@/components/sidebar-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function HomePage() {
  return (
    <SidebarLayout>
      {/* Header with sidebar trigger */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <SidebarTrigger className="text-purple-600 hover:text-purple-700" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Study Assistant
              </h1>
              <p className="text-sm text-gray-500">Ready to help with your homework</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="w-full max-w-4xl">
          <ChatInterface />
        </div>
      </div>
    </SidebarLayout>
  )
}