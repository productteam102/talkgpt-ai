"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Bug } from "lucide-react"

interface DebugLog {
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
  data?: any
}

interface DebugPanelProps {
  logs: DebugLog[]
  onClear: () => void
  onTestAPI: () => void
}

export default function DebugPanel({ logs, onClear, onTestAPI }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-white shadow-lg border border-gray-200">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Debug Panel</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{logs.length} logs</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="outline" onClick={onTestAPI} className="text-xs bg-transparent">
                Test API
              </Button>
              <Button size="sm" variant="outline" onClick={onClear} className="text-xs bg-transparent">
                Clear
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No debug logs yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded border-l-2 ${
                      log.level === "error"
                        ? "bg-red-50 border-red-400 text-red-800"
                        : log.level === "warning"
                          ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                          : "bg-blue-50 border-blue-400 text-blue-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{log.level.toUpperCase()}</span>
                      <span className="text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="mb-1">{log.message}</div>
                    {log.data && (
                      <pre className="text-xs bg-gray-100 p-1 rounded overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
