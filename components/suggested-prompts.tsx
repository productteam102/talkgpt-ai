"use client"

import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  onPromptSelect: (prompt: string) => void
  usedPrompts: Set<string>
}

const prompts = [
  {
    text: "Summarize this thing",
    emoji: "📝",
    description: "TL;DR your notes in one click",
  },
  {
    text: "Math lookin' scary?",
    emoji: "🧮",
    description: "I gotchu – let's break it down",
  },
  {
    text: "Stuck on a question?",
    emoji: "🤔",
    description: "Step-by-step help like a genius bestie",
  },
  {
    text: "Flashcard Mode: ON",
    emoji: "🃏",
    description: "Cram time = game time",
  },
  {
    text: "Quiz me like you mean it",
    emoji: "❓",
    description: "Let's see what you really know...",
  },
  {
    text: "Make a study plan",
    emoji: "📅",
    description: "Turn chaos into checklist",
  },
]

export default function SuggestedPrompts({ onPromptSelect, usedPrompts }: SuggestedPromptsProps) {
  return (
    <div className="space-y-4 text-left">
      <h3 className="text-lg font-semibold text-gray-700 text-left">✨ Study Prompt Boxes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onPromptSelect(prompt.text)}
            className="h-auto p-4 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group text-left justify-start"
          >
            <div className="text-left space-y-1 w-full">
              <div className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform">{prompt.emoji}</span>
                <span className="font-medium text-gray-800">{prompt.text}</span>
              </div>
              <p className="text-xs text-gray-500 text-left">{prompt.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
