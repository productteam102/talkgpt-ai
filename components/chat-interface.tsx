"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ImageIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/message"
import SuggestedPrompts from "@/components/suggested-prompts"
import ImageUpload from "@/components/image-upload"
import { useFirebaseAnalytics } from "@/hooks/use-firebase-analytics"
import Image from "next/image"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string
  isLoading?: boolean
  isError?: boolean
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const [sessionStartTime] = useState<number>(Date.now())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { trackChatMessage, trackPromptUsage, trackImageUpload, trackError, trackFeatureUsage, trackStudySession } =
    useFirebaseAnalytics()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Track study session when component unmounts or messages change significantly
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)
        trackStudySession(messages, sessionDuration)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      handleBeforeUnload() // Also track when component unmounts
    }
  }, [messages, sessionStartTime, trackStudySession])

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    setShowImageUpload(false)
    console.log("Image uploaded", { imageSize: imageData.length })
    trackImageUpload()
  }

  const sendMessage = async (messageContent: string, isRetry = false) => {
    if (!messageContent.trim() && !uploadedImage) {
      console.warn("Attempted to send empty message")
      return
    }

    setError(null)
    setIsLoading(true)

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      image: uploadedImage || undefined,
    }

    if (!isRetry) {
      setMessages((prev) => [...prev, userMessage])
      // Track user message
      trackChatMessage("user", !!uploadedImage)
    }

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    }

    setMessages((prev) => [...prev, loadingMessage])

    if (!isRetry) {
      setInput("")
    }

    console.log("Sending message", {
      content: messageContent.substring(0, 100),
      hasImage: !!uploadedImage,
      isRetry: isRetry,
    })

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
          })),
          data: {
            image: uploadedImage,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.userMessage || errorData.details || `HTTP ${response.status}`)
      }

      console.log("Response received, starting to read stream")

      // Read the streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body reader available")
      }

      const decoder = new TextDecoder()
      let buffer = ""
      let assistantContent = ""

      // Replace loading message with assistant message
      const assistantMessage: ChatMessage = {
        id: loadingMessage.id,
        role: "assistant",
        content: "",
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log("Stream reading completed")
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
              console.log("Received [DONE] signal")
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
              console.warn("Failed to parse chunk", {
                data: data.substring(0, 100),
                error: parseError instanceof Error ? parseError.message : String(parseError),
              })
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      console.log("Message completed", {
        finalLength: assistantContent.length,
      })

      // Track assistant message
      trackChatMessage("assistant")

      // Clear uploaded image and last failed message after successful send
      setUploadedImage(null)
      setLastFailedMessage(null)
    } catch (error) {
      console.error("Error sending message", {
        error: error instanceof Error ? error.message : String(error),
      })

      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      setLastFailedMessage(messageContent)

      // Track error
      trackError("chat_api_error", errorMessage)

      // Remove the loading message and show error
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1) // Remove loading message

        // Add error message
        const errorMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`,
          isError: true,
        }

        return [...newMessages, errorMsg]
      })

      // If it's not a retry and not a user message duplication issue, remove the user message too
      if (!isRetry) {
        setMessages((prev) => prev.slice(0, -2))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastFailedMessage) {
      // Remove the error message
      setMessages((prev) => prev.slice(0, -1))
      sendMessage(lastFailedMessage, true)
      trackFeatureUsage("retry_message")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    console.log("Selected suggested prompt", { prompt })
    trackPromptUsage(prompt)
    trackFeatureUsage("suggested_prompt")
  }

  const hasMessages = messages.length > 0

  return (
    <>
      <div className={`${hasMessages ? "flex flex-col h-[calc(100vh-120px)]" : "space-y-6"}`}>
        {/* Welcome Message - Only show when no messages */}
        {!hasMessages && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden bg-white shadow-lg border border-gray-100">
              <Image
                src="/images/talkgpt-logo.png"
                alt="TalkGPT Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{"Yo! 🤖 Ready to crush your studies?"}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {
                "I'm your AI buddy here to make homework suck less 😎\nAsk anything, upload your notes or math problems, and let's make learning actually fun."
              }
            </p>
          </div>
        )}

        {/* Error Display with Retry */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <span className="text-red-700 font-medium">Connection Error:</span>
              </div>
              {lastFailedMessage && (
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              )}
            </div>
            <p className="text-red-600 mt-1">{error}</p>
            <p className="text-red-500 text-sm mt-2">
              Check the debug panel for more details or try the "Test API" button.
            </p>
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
          <form onSubmit={handleFormSubmit} className="space-y-3">
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
                      handleFormSubmit(e)
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
            <SuggestedPrompts onPromptSelect={handleSuggestedPrompt} />
          </div>
        )}
      </div>
    </>
  )
}
