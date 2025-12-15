"use client"

import { cn } from "@/lib/utils"
import { Bot, User, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  {props.children}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
              ul: ({ node, ...props }) => <ul {...props} className="my-2 space-y-1" />,
              ol: ({ node, ...props }) => <ol {...props} className="my-2 space-y-1" />,
              li: ({ node, ...props }) => <li {...props} className="ml-4" />,
              h3: ({ node, ...props }) => <h3 {...props} className="font-semibold mt-3 mb-1" />,
              strong: ({ node, ...props }) => <strong {...props} className="font-semibold" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
