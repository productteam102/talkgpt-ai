"use client"

import { useEffect, useCallback } from "react"
import { firebaseAnalytics } from "@/lib/firebase"
import { firestoreService } from "@/lib/firestore"

export function useFirebaseAnalytics() {
  // Initialize session tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Generate session ID if not exists
        if (!window.sessionStorage.getItem("talkgpt-session")) {
          const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          window.sessionStorage.setItem("talkgpt-session", sessionId)
        }

        // Track page view
        firebaseAnalytics.logFeatureUsage("app_opened")
      } catch (error) {
        console.warn("Firebase analytics initialization error:", error)
      }
    }
  }, [])

  const trackChatMessage = useCallback((messageType: "user" | "assistant", hasImage?: boolean) => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logChatMessage(messageType, hasImage)

      // Also log to Firestore for detailed analytics
      firestoreService.logUsageAnalytics({
        eventType: "chat_message",
        eventData: {
          messageType,
          hasImage: hasImage || false,
        },
      })
    } catch (error) {
      console.warn("Error tracking chat message:", error)
    }
  }, [])

  const trackPromptUsage = useCallback((promptText: string) => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logPromptUsage(promptText)

      firestoreService.logUsageAnalytics({
        eventType: "prompt_usage",
        eventData: {
          promptText: promptText.substring(0, 100),
        },
      })
    } catch (error) {
      console.warn("Error tracking prompt usage:", error)
    }
  }, [])

  const trackImageUpload = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logImageUpload()

      firestoreService.logUsageAnalytics({
        eventType: "image_upload",
        eventData: {
          feature: "homework_help",
        },
      })
    } catch (error) {
      console.warn("Error tracking image upload:", error)
    }
  }, [])

  const trackError = useCallback((errorType: string, errorMessage: string) => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logError(errorType, errorMessage)

      firestoreService.logUsageAnalytics({
        eventType: "error",
        eventData: {
          errorType,
          errorMessage: errorMessage.substring(0, 200),
        },
      })
    } catch (error) {
      console.warn("Error tracking error:", error)
    }
  }, [])

  const trackFeatureUsage = useCallback((feature: string) => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logFeatureUsage(feature)

      firestoreService.logUsageAnalytics({
        eventType: "feature_usage",
        eventData: {
          feature,
        },
      })
    } catch (error) {
      console.warn("Error tracking feature usage:", error)
    }
  }, [])

  const trackStudySession = useCallback((messages: any[], duration: number) => {
    if (typeof window === "undefined") return

    try {
      firebaseAnalytics.logStudySession(duration, messages.length)

      // Save complete chat session to Firestore
      firestoreService.saveChatSession(messages, duration)
    } catch (error) {
      console.warn("Error tracking study session:", error)
    }
  }, [])

  return {
    trackChatMessage,
    trackPromptUsage,
    trackImageUpload,
    trackError,
    trackFeatureUsage,
    trackStudySession,
  }
}
