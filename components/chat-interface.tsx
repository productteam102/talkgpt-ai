"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ImageIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Message from "@/components/message"
import SuggestedPrompts from "@/components/suggested-prompts"
import ImageUpload from "@/components/image-upload"
import DebugPanel from "@/components/debug-panel"
import { useDebugLogger } from "@/hooks/use-debug-logger"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { logs, addLog, clearLogs } = useDebugLogger()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    setShowImageUpload(false)
    addLog("info", "Image uploaded", { imageSize: imageData.length })
  }

  const sendMessage = async (messageContent: string, isRetry = false) => {
    if (!messageContent.trim() && !uploadedImage) {
      addLog("warning", "Attempted to send empty message")
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

    addLog("info", "Sending message", {
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

      addLog("info", "Response received, starting to read stream")

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
            addLog("info", "Stream reading completed")
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
              addLog("info", "Received [DONE] signal")
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
              addLog("warning", "Failed to parse chunk", {
                data: data.substring(0, 100),
                error: parseError instanceof Error ? parseError.message : String(parseError),
              })
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      addLog("info", "Message completed", {
        finalLength: assistantContent.length,
      })

      // Clear uploaded image and last failed message after successful send
      setUploadedImage(null)
      setLastFailedMessage(null)
    } catch (error) {
      addLog("error", "Error sending message", {
        error: error instanceof Error ? error.message : String(error),
      })

      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      setLastFailedMessage(messageContent)

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
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    addLog("info", "Selected suggested prompt", { prompt })
  }

  const testAPI = async () => {
    addLog("info", "Testing API connection...")

    try {
      const testPayload = {
        messages: [{ role: "user", content: "Hello, this is a test message. Please respond with 'Test successful!'" }],
        data: {},
      }

      addLog("info", "Sending test request", testPayload)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      })

      addLog("info", "API test response received", {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
      })

      if (!response.ok) {
        const errorText = await response.text()
        addLog("error", "API test failed", { status: response.status, error: errorText })
        return
      }

      // Test streaming response
      const reader = response.body?.getReader()
      if (!reader) {
        addLog("error", "No response body reader available")
        return
      }

      let chunks = 0
      let totalData = ""
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          chunks++
          const chunk = decoder.decode(value, { stream: true })
          totalData += chunk

          if (chunks <= 3) {
            addLog("info", `Received chunk ${chunks}`, {
              chunk: chunk.substring(0, 200),
              chunkLength: chunk.length,
            })
          }
        }

        addLog("info", "API test completed successfully", {
          totalChunks: chunks,
          totalDataLength: totalData.length,
          sampleData: totalData.substring(0, 300),
        })
      } catch (streamError) {
        addLog("error", "Error reading stream", { error: streamError })
      }
    } catch (error) {
      addLog("error", "API test failed with exception", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
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
              {"I’m your AI buddy here to make homework suck less 😎\nAsk anything, upload your notes or math problems, and let’s make learning actually fun."}
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

      {/* Debug Panel */}
      <DebugPanel logs={logs} onClear={clearLogs} onTestAPI={testAPI} />
    </>
  )
}
