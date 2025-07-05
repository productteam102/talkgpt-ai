"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Home, 
  User, 
  Newspaper, 
  Menu, 
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Chat with TalkGPT"
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Your study progress"
  },
  {
    title: "News",
    href: "https://news.talkgpt-ai.fun/",
    icon: Newspaper,
    description: "Latest updates",
    external: true
  }
]

interface SidebarContentProps {
  onItemClick?: () => void
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Link 
          href="/" 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onItemClick}
        >
          <div className="relative w-10 h-10">
            <Image 
              src="/logo.png" 
              alt="TalkGPT Logo" 
              width={40} 
              height={40} 
              className="rounded-xl" 
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TalkGPT
            </h1>
            <p className="text-xs text-gray-500">AI Study Assistant</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              if (item.external) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                  </a>
                )
              }

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-purple-100" : "text-gray-400"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            © 2025 TalkGPT
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SidebarNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-purple-600"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <SidebarContent />
      </div>
    </>
  )
}