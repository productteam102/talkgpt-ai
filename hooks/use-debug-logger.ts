"use client"

import { useState, useCallback } from "react"

interface DebugLog {
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
  data?: any
}

export function useDebugLogger() {
  const [logs, setLogs] = useState<DebugLog[]>([])

  const addLog = useCallback((level: "info" | "error" | "warning", message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const newLog: DebugLog = { timestamp, level, message, data }

    setLogs((prev) => {
      // Limit logs to prevent memory issues
      const newLogs = [...prev, newLog]
      return newLogs.length > 100 ? newLogs.slice(-50) : newLogs
    })

    // Also log to console for development
    if (level === "error") {
      console.error(`[TalkGPT Debug] ${message}`, data)
    } else if (level === "warning") {
      console.warn(`[TalkGPT Debug] ${message}`, data)
    } else {
      console.log(`[TalkGPT Debug] ${message}`, data)
    }
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return { logs, addLog, clearLogs }
}
