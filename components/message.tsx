"use client"

import type { Message as MessageType } from "ai"

interface MessageProps {
  message: MessageType & { image?: string } // Add image property to message type
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

  // Debug: Check if content is empty
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
      <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
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
                alt="Uploaded content"
                className="max-w-full h-auto rounded-lg max-h-64 object-contain border border-white/20"
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

          {/* Show placeholder text if only image and no text */}
          {message.image && !message.content && isUser && <p className="text-white/90 italic">📸 Image uploaded</p>}
        </div>
        <div className={`flex items-center mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-xs text-gray-400">{isUser ? "👤 You" : "🤖 TalkGPT"}</span>
        </div>
      </div>
    </div>
  )
}
