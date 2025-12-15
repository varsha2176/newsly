"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { TrendingTopics } from "@/components/trending-topics"
import { Send, Newspaper, Tag } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type CategoryResult = {
  category: string
  confidence: number
  reason: string
  matchedKeywords: string[]
  insight: string
}

export default function NewslyDashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [categorizeInput, setCategorizeInput] = useState("")
  const [categoryResult, setCategoryResult] = useState<CategoryResult | null>(null)
  const [isCategorizing, setIsCategorizing] = useState(false)

  const submitMessage = async (message: string) => {
    if (!message.trim()) return

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: message },
    ])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: Array.isArray(data.articles)
            ? data.articles
                .map(
                  (a: any, i: number) =>
                    `${i + 1}. ${a.title} (${a.source.name})\n${a.description || ""}\n`
                )
                .join("\n")
            : data.response || "No news found.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrendingTopicClick = (topic: string) => {
    const msg = `Show me the latest news about ${topic}`
    setInput(msg)
    submitMessage(msg)
  }

  const handleCategorize = async () => {
    if (!categorizeInput.trim()) return
    setIsCategorizing(true)
    setCategoryResult(null)

    try {
      const res = await fetch("/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: categorizeInput }),
      })
      const data = await res.json()
      setCategoryResult(data)
    } finally {
      setIsCategorizing(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-blue-100 p-6 gap-4">
      <h1 className="text-3xl font-extrabold text-blue-900 text-center">
        Newsly: Your Smart Companion for Trusted News
      </h1>

      <div className="flex flex-1 gap-4">
        {/* CHATBOT */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
          <header className="p-4 bg-red-600 text-white flex items-center gap-3">
            <Newspaper className="h-6 w-6" />
            <h2 className="text-xl font-bold">News Chatbot</h2>
          </header>

          {messages.length === 0 && (
            <div className="p-4 bg-red-50 border-b">
              <TrendingTopics onTopicClick={handleTrendingTopicClick} />
            </div>
          )}

          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-xl font-semibold mb-2">Start Exploring News</h3>
                <p className="text-gray-600">
                  Ask about breaking news or trending topics.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((m) => (
                  <ChatMessage key={m.id} role={m.role} content={m.content} />
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about news..."
              disabled={isLoading}
            />
            <Button onClick={() => submitMessage(input)} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CATEGORIZATION */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">
          <header className="p-4 bg-green-600 text-white flex items-center gap-3">
            <Tag className="h-6 w-6" />
            <h2 className="text-xl font-bold">News Categorization</h2>
          </header>

          <div className="p-4 flex flex-col gap-3">
            <textarea
              className="w-full h-32 p-3 border rounded-md resize-none"
              placeholder="Paste a news headline or article here..."
              value={categorizeInput}
              onChange={(e) => setCategorizeInput(e.target.value)}
            />

            <Button
              onClick={handleCategorize}
              disabled={isCategorizing || !categorizeInput.trim()}
            >
              {isCategorizing ? "Analyzing..." : "Detect Category"}
            </Button>

            {categoryResult && (
              <div className="mt-2 space-y-3 rounded-lg bg-green-50 p-4 border border-green-300">
                <div className="text-lg font-bold text-green-800 capitalize">
                  🏷 Category: {categoryResult.category}
                </div>

                <div className="text-sm">
                  <b>Confidence:</b> {categoryResult.confidence}%
                </div>

                <div className="text-sm">
                  <b>Reason:</b> {categoryResult.reason}
                </div>

                {categoryResult.matchedKeywords.length > 0 && (
                  <div>
                    <b className="text-sm">Matched Keywords:</b>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {categoryResult.matchedKeywords.map((k) => (
                        <span
                          key={k}
                          className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="italic text-sm text-green-700">
                  💡 {categoryResult.insight}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}