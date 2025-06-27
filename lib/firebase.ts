"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics, logEvent } from "firebase/analytics"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFK4gmJ-pHZWJeuEssYgli0yjz8slTz-8",
  authDomain: "talkgpt-a.firebaseapp.com",
  projectId: "talkgpt-a",
  storageBucket: "talkgpt-a.firebasestorage.app",
  messagingSenderId: "583432041298",
  appId: "1:583432041298:web:bd6aa0b95d3caef158008b",
  measurementId: "G-XLRPK4BDWT",
}

// Initialize Firebase
let app: FirebaseApp
let analytics: Analytics | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (typeof window !== "undefined") {
  try {
    // Initialize Firebase only on client side
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

    analytics = getAnalytics(app)
    db = getFirestore(app)
    auth = getAuth(app)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
    // Set services to null if initialization fails
    analytics = null
    db = null
    auth = null
  }
}

// Firebase Analytics helper functions
export const firebaseAnalytics = {
  logChatMessage: (messageType: "user" | "assistant", hasImage?: boolean) => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "chat_message", {
          message_type: messageType,
          has_image: hasImage || false,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },

  logPromptUsage: (promptText: string) => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "prompt_selected", {
          prompt_category: "suggested",
          prompt_preview: promptText.substring(0, 50),
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },

  logImageUpload: () => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "image_upload", {
          feature: "homework_help",
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },

  logError: (errorType: string, errorMessage: string) => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "app_error", {
          error_type: errorType,
          error_message: errorMessage.substring(0, 100),
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },

  logFeatureUsage: (feature: string) => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "feature_used", {
          feature_name: feature,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },

  logStudySession: (duration: number, messageCount: number) => {
    if (typeof window !== "undefined" && analytics) {
      try {
        logEvent(analytics, "study_session", {
          session_duration: duration,
          message_count: messageCount,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.warn("Firebase Analytics error:", error)
      }
    }
  },
}

export { app, analytics, db, auth }
