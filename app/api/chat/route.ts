import type { NextRequest } from "next/server"

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Debug logging function
function debugLog(level: "info" | "error" | "warning", message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "")
}

// Custom OpenRouter provider for AI SDK
function createOpenRouterProvider() {
  return {
    chat: async (options: any) => {
      debugLog("info", "OpenRouter provider called", {
        model: options.model,
        messagesCount: options.messages?.length,
      })

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://talkgpt-study.vercel.app",
          "X-Title": "TalkGPT Study Assistant",
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct:free",
          messages: options.messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        debugLog("error", "OpenRouter API error", {
          status: response.status,
          error: errorText,
        })
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
      }

      return response
    },
  }
}

export async function POST(req: NextRequest) {
  debugLog("info", "=== Chat API Request Started ===")

  try {
    // Validate API key
    if (!OPENROUTER_API_KEY) {
      debugLog("error", "OPENROUTER_API_KEY is not configured")
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          details: "OPENROUTER_API_KEY environment variable is missing",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    debugLog("info", "API key is configured", { keyLength: OPENROUTER_API_KEY.length })

    // Parse request body
    let requestBody
    try {
      requestBody = await req.json()
      debugLog("info", "Request body parsed successfully", {
        messagesCount: requestBody.messages?.length,
        hasData: !!requestBody.data,
        hasImage: !!requestBody.data?.image,
      })
    } catch (parseError) {
      debugLog("error", "Failed to parse request body", { error: parseError })
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: "Failed to parse JSON",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const { messages, data } = requestBody

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      debugLog("error", "Invalid messages array", { messages })
      return new Response(
        JSON.stringify({
          error: "Invalid messages",
          details: "Messages must be a non-empty array",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Prepare the messages for the API
    const formattedMessages = messages.map((message: any, index: number) => {
      debugLog("info", `Processing message ${index}`, {
        role: message.role,
        contentLength: message.content?.length,
        hasImage: !!(message.role === "user" && data?.image),
      })

      if (message.role === "user" && data?.image) {
        return {
          role: "user",
          content: [
            {
              type: "text",
              text: message.content || "Please analyze this image and help me understand it.",
            },
            {
              type: "image_url",
              image_url: {
                url: data.image,
              },
            },
          ],
        }
      }
      return {
        role: message.role,
        content: message.content,
      }
    })

    debugLog("info", "Messages formatted for API", { formattedCount: formattedMessages.length })

    // Prepare API request payload
    const apiPayload = {
      model: "qwen/qwen2.5-vl-72b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are TalkGPT, a friendly and enthusiastic AI study assistant designed for Gen Z students. Your personality is:

- Energetic and encouraging, using emojis appropriately
- Clear and concise in explanations
- Patient and supportive
- Able to break down complex topics into digestible parts
- Great at creating study materials like summaries, flashcards, and quizzes
- Skilled at explaining math formulas and solving problems step-by-step
- Helpful with homework and assignments across all subjects

When responding:
- Use markdown formatting for better readability
- Be encouraging and positive
- Provide practical study tips when relevant
- Ask follow-up questions to ensure understanding

Remember: You're here to help students learn and succeed! 🎓✨`,
        },
        ...formattedMessages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    }

    debugLog("info", "Making request to OpenRouter API", {
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: apiPayload.model,
      messageCount: apiPayload.messages.length,
      stream: apiPayload.stream,
    })

    // Make request to OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://talkgpt-study.vercel.app",
        "X-Title": "TalkGPT Study Assistant",
      },
      body: JSON.stringify(apiPayload),
    })

    debugLog("info", "OpenRouter API response received", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog("error", "OpenRouter API returned error", {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      })

      return new Response(
        JSON.stringify({
          error: `OpenRouter API error: ${response.status}`,
          details: errorText,
          status: response.status,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    debugLog("info", "Starting to process streaming response")

    // Create a readable stream that properly formats the OpenRouter response for AI SDK
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          debugLog("error", "No response body reader available")
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              debugLog("info", "Stream reading completed")
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || "" // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmedLine = line.trim()
              if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue

              const data = trimmedLine.slice(6) // Remove "data: " prefix
              if (data === "[DONE]") {
                debugLog("info", "Received [DONE] signal")
                // Send final chunk to close the stream properly
                const finalChunk = `data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\n`
                controller.enqueue(new TextEncoder().encode(finalChunk))
                controller.close()
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content

                if (content) {
                  // Format the response exactly as AI SDK expects
                  const formattedChunk = `data: {"choices":[{"delta":{"content":${JSON.stringify(content)}}}]}\n\n`
                  controller.enqueue(new TextEncoder().encode(formattedChunk))
                }
              } catch (parseError) {
                debugLog("warning", "Failed to parse streaming chunk", {
                  data: data.substring(0, 100),
                  error: parseError instanceof Error ? parseError.message : String(parseError),
                })
                // Continue processing other chunks
              }
            }
          }
        } catch (error) {
          debugLog("error", "Error processing stream", {
            error: error instanceof Error ? error.message : String(error),
          })
          controller.error(error)
        } finally {
          try {
            reader.releaseLock()
          } catch (e) {
            // Ignore lock release errors
          }
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    debugLog("error", "Unexpected error in chat API", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
