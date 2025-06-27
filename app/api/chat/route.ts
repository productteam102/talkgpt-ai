import type { NextRequest } from "next/server"

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Debug logging function
function debugLog(level: "info" | "error" | "warning", message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "")
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
          userMessage: "Service configuration error. Please contact support.",
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
          userMessage: "Invalid request format. Please try again.",
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
          userMessage: "No messages to process. Please try again.",
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

    // Use only the specified model
    const model = "qwen/qwen2.5-vl-72b-instruct:free"

    // Prepare API request payload
    const apiPayload = {
      model: model,
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

    debugLog("info", `Making request with model: ${model}`, {
      messageCount: apiPayload.messages.length,
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
      contentType: response.headers.get("content-type"),
    })

    if (!response.ok) {
      const errorText = await response.text()
      debugLog("error", "OpenRouter API returned error", {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
      })

      // Determine user-friendly error message
      let userMessage = "I'm having trouble connecting right now. Please try again in a few minutes."

      if (response.status === 429) {
        userMessage = "I'm getting a lot of requests right now! Please wait a moment and try again. 😊"
      } else if (response.status === 404) {
        userMessage = "The AI model is temporarily unavailable. Please try again later."
      } else if (errorText.includes("Rate limit exceeded")) {
        userMessage =
          "Daily usage limit reached. The service will reset tomorrow, or you can upgrade for unlimited access."
      }

      return new Response(
        JSON.stringify({
          error: `OpenRouter API error: ${response.status}`,
          details: errorText,
          userMessage: userMessage,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    debugLog("info", "Starting to process streaming response")

    // Return the streaming response directly
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
            buffer = lines.pop() || ""

            for (const line of lines) {
              const trimmedLine = line.trim()
              if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue

              const data = trimmedLine.slice(6)
              if (data === "[DONE]") {
                debugLog("info", "Received [DONE] signal")
                controller.close()
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content

                if (content) {
                  // Send the content directly as received from OpenRouter
                  const chunk = `data: ${JSON.stringify(parsed)}\n\n`
                  controller.enqueue(new TextEncoder().encode(chunk))
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
        userMessage: "Something went wrong on our end. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
