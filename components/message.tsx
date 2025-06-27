"use client"

import { Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string
  isLoading?: boolean
  isError?: boolean
}

interface MessageProps {
  message: ChatMessage
}

// Simple markdown renderer without external dependencies
const renderContent = (content: string) => {
  if (!content) return ""

  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="bg-purple-50 text-purple-700 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-50 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>')
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mb-2 mt-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-2 mt-4">$1</h1>')
    .replace(/^\* (.*$)/gm, '<li class="mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-2">$1</ul>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, "<br>")
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user"

  // Handle loading state
  if (message.isLoading) {
    return (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3">
          {/* AI Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm border border-gray-100">
            <Image
              src="/images/talkgpt-logo.png"
              alt="TalkGPT"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-gray-500">Thinking...</span>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (message.isError) {
    return (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3">
          {/* AI Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 max-w-[80%]">
            <p className="text-red-700">{message.content}</p>
          </div>
        </div>
      </div>
    )
  }

  // Debug: Check if content is empty for non-loading messages
  if (!message.content && !message.image) {
    console.warn("[Message Component] Empty message content:", message)
    return (
      <div className="flex justify-start">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
          <span className="text-yellow-700 text-sm">⚠️ Empty message received</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-sm border border-gray-100">
          {isUser ? (
            <span className="text-sm font-medium text-gray-600">👤</span>
          ) : (
            <Image
              src="/images/talkgpt-logo.png"
              alt="TalkGPT"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isUser ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-white border border-gray-100"
            }`}
          >
            {/* Display image if present (for user messages) */}
            {message.image && isUser && (
              <div className="mb-3">
                <img
                  src={message.image || "/placeholder.svg"}
                  alt="Uploaded by user"
                  className="max-w-full h-auto rounded-lg max-h-48 object-contain border border-white/20"
                />
              </div>
            )}

            {/* Display text content */}
            {message.content && (
              <>
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: `<div class="mb-2">${renderContent(message.content)}</div>`,
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Message Footer */}
          <div className={`flex items-center mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-400">
              {isUser ? "You" : "TalkGPT"}
              {message.image && isUser && " • 📸 Image"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
