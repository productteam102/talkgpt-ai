"use client"

import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, type Timestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface ChatSession {
  id?: string
  messages: Array<{
    role: "user" | "assistant"
    content: string
    image?: string
    timestamp: Timestamp
  }>
  createdAt: Timestamp
  lastUpdated: Timestamp
  messageCount: number
  sessionDuration?: number
}

export const firestoreService = {
  // Save chat session to Firestore
  saveChatSession: async (messages: any[], sessionDuration?: number) => {
    if (typeof window === "undefined" || !db) {
      console.warn("Firestore not available")
      return null
    }

    try {
      const chatSession: Omit<ChatSession, "id"> = {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          image: msg.image,
          timestamp: serverTimestamp() as Timestamp,
        })),
        createdAt: serverTimestamp() as Timestamp,
        lastUpdated: serverTimestamp() as Timestamp,
        messageCount: messages.length,
        sessionDuration: sessionDuration,
      }

      const docRef = await addDoc(collection(db, "chatSessions"), chatSession)
      console.log("Chat session saved with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("Error saving chat session:", error)
      return null
    }
  },

  // Get recent chat sessions
  getRecentSessions: async (limitCount = 10) => {
    if (typeof window === "undefined" || !db) {
      console.warn("Firestore not available")
      return []
    }

    try {
      const q = query(collection(db, "chatSessions"), orderBy("createdAt", "desc"), limit(limitCount))

      const querySnapshot = await getDocs(q)
      const sessions: ChatSession[] = []

      querySnapshot.forEach((doc) => {
        sessions.push({
          id: doc.id,
          ...doc.data(),
        } as ChatSession)
      })

      return sessions
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
      return []
    }
  },

  // Save user feedback
  saveFeedback: async (feedback: {
    rating: number
    comment?: string
    feature: string
  }) => {
    if (typeof window === "undefined" || !db) {
      console.warn("Firestore not available")
      return null
    }

    try {
      const feedbackDoc = {
        ...feedback,
        timestamp: serverTimestamp(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      }

      const docRef = await addDoc(collection(db, "feedback"), feedbackDoc)
      console.log("Feedback saved with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("Error saving feedback:", error)
      return null
    }
  },

  // Log usage analytics
  logUsageAnalytics: async (event: {
    eventType: string
    eventData: Record<string, any>
  }) => {
    if (typeof window === "undefined" || !db) {
      console.warn("Firestore not available")
      return null
    }

    try {
      const analyticsDoc = {
        ...event,
        timestamp: serverTimestamp(),
        sessionId:
          typeof window !== "undefined" ? window.sessionStorage.getItem("talkgpt-session") || "anonymous" : "anonymous",
      }

      const docRef = await addDoc(collection(db, "analytics"), analyticsDoc)
      return docRef.id
    } catch (error) {
      console.error("Error logging analytics:", error)
      return null
    }
  },
}
