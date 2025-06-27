"use client"

// Google Analytics helper functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-XLRPK4BDWT", {
      page_path: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track chat interactions
export const trackChatMessage = (messageType: "user" | "assistant", hasImage?: boolean) => {
  trackEvent("chat_message", "engagement", messageType, hasImage ? 1 : 0)
}

// Track prompt usage
export const trackPromptUsage = (promptText: string) => {
  trackEvent("prompt_used", "engagement", promptText.substring(0, 50))
}

// Track image uploads
export const trackImageUpload = () => {
  trackEvent("image_upload", "engagement", "homework_help")
}

// Track errors
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent("error", "technical", `${errorType}: ${errorMessage.substring(0, 50)}`)
}

// Track feature usage
export const trackFeatureUsage = (feature: string) => {
  trackEvent("feature_used", "engagement", feature)
}
