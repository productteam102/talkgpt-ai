"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/message"
import SuggestedPrompts from "@/components/suggested-prompts"
import ImageUpload from "@/components/image-upload"
import Image from "next/image"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string // Add optional image field
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [usedPrompts, setUsedPrompts] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    setShowImageUpload(false)
  }

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() && !uploadedImage) {
      return
    }

    // Prevent double submission
    if (isLoading) {
      return
    }

    setError(null)
    setIsLoading(true)

    // Add user message with image if present
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      image: uploadedImage || undefined, // Include image in the message
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Clear uploaded image immediately after submission
    setUploadedImage(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
            image: msg.image, // Include image in the request body
          })),
          data: {
            image: uploadedImage,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP ${response.status}`)
      }

      // Read the streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body reader available")
      }

      const decoder = new TextDecoder()
      let buffer = ""
      let assistantContent = ""

      // Add assistant message placeholder
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue

            const data = trimmedLine.slice(6)
            if (data === "[DONE]") {
              break
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content

              if (content) {
                assistantContent += content

                // Update the assistant message
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: assistantContent } : msg)),
                )
              }
            } catch (parseError) {
              // Continue processing other chunks
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")

      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    // Remove the early return - allow prompts to be used multiple times
    setUsedPrompts((prev) => new Set(prev).add(prompt))
    setInput(prompt)
  }

  const hasMessages = messages.length > 0

  return (
    <div className={`${hasMessages ? "flex flex-col h-[calc(100vh-120px)]" : "space-y-6"}`}>
      {/* Welcome Message - Only show when no messages */}
      {!hasMessages && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Image src="/logo.png" alt="TalkGPT Logo" width={80} height={80} className="rounded-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Yo! 🤖 Ready to crush your studies?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {
              "I'm your AI buddy here to make homework suck less 😎\nAsk anything, upload your notes or math problems, and let's make learning actually fun."
            }
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 font-medium">Connection Error:</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
          <p className="text-red-500 text-sm mt-2">Please check your connection and try again.</p>
        </div>
      )}

      {/* Chat Messages - Scrollable area when messages exist */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Thinking Message - Show above input when loading */}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-gray-500">Thinking...</span>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && <ImageUpload onImageUpload={handleImageUpload} onClose={() => setShowImageUpload(false)} />}

      {/* Image Preview */}
      {uploadedImage && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">📸 Image attached</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUploadedImage(null)}
              className="text-gray-500 hover:text-red-500"
            >
              Remove
            </Button>
          </div>
          <img
            src={uploadedImage || "/placeholder.svg"}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg max-h-48 object-contain"
          />
        </div>
      )}

      {/* Input Form - Fixed at bottom when messages exist */}
      <div
        className={`${hasMessages ? "sticky bottom-0" : ""} bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-purple-100 p-4`}
      >
        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowImageUpload(true)}
              className="shrink-0 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            >
              <ImageIcon className="w-4 h-4 text-purple-600" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your studies... 💭"
                className="resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl pr-12"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    // Trigger form submission instead of calling handleFormSubmit directly
                    formRef.current?.requestSubmit()
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || (!input.trim() && !uploadedImage)}
                className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Suggested Prompts - Only show when no messages, placed below chatbox */}
      {!hasMessages && (
        <div className="mt-8">
          <SuggestedPrompts onPromptSelect={handleSuggestedPrompt} usedPrompts={usedPrompts} />
        </div>
      )}
    </div>
  )
}
