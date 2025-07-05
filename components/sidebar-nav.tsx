"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { 
  Home, 
  User, 
  Newspaper, 
  MessageSquare, 
  BookOpen, 
  Settings,
  HelpCircle,
  Star
} from "lucide-react"

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "News",
    url: "https://news.talkgpt-ai.fun/",
    icon: Newspaper,
    external: true
  }
]

const quickActions = [
  {
    title: "Ask Question",
    description: "Start a new conversation",
    icon: MessageSquare,
  },
  {
    title: "Study Guide",
    description: "Create study materials",
    icon: BookOpen,
  },
  {
    title: "Settings",
    description: "Customize your experience",
    icon: Settings,
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r border-purple-100">
      <SidebarHeader className="border-b border-purple-100 p-4">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10">
            <Image src="/logo.png" alt="TalkGPT Logo" width={40} height={40} className="rounded-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TalkGPT
            </h1>
            <p className="text-xs text-gray-500">AI Study Assistant</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </h2>
          </div>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="w-full justify-start"
                >
                  {item.external ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </a>
                  ) : (
                    <Link href={item.url} className="flex items-center space-x-3 w-full">
                      <item.icon className="w-4 h-4" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Quick Actions */}
        <div className="space-y-1 mt-6">
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h2>
          </div>
          <SidebarMenu>
            {quickActions.map((action) => (
              <SidebarMenuItem key={action.title}>
                <SidebarMenuButton className="w-full justify-start">
                  <action.icon className="w-4 h-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Study Stats */}
        <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Study Stats</span>
          </div>
          <div className="space-y-1 text-xs text-purple-700">
            <div className="flex justify-between">
              <span>Messages today:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span>Study streak:</span>
              <span className="font-medium">7 days 🔥</span>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-100 p-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <HelpCircle className="w-4 h-4" />
          <span>Need help? Just ask!</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}