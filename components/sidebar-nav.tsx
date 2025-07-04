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
  HelpCircle
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
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-100 p-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
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
