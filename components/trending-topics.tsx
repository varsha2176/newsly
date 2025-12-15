"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, Globe, Cpu, Leaf, Briefcase, Trophy, Heart, Microscope } from "lucide-react"

const trendingTopics = [
  { name: "World News", icon: Globe, query: "world" },
  { name: "AI & Tech", icon: Cpu, query: "artificial intelligence technology" },
  { name: "Climate", icon: Leaf, query: "climate change environment" },
  { name: "Business", icon: Briefcase, query: "business economy" },
  { name: "Sports", icon: Trophy, query: "sports" },
  { name: "Health", icon: Heart, query: "health medical" },
  { name: "Science", icon: Microscope, query: "science research" },
]

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void
}

export function TrendingTopics({ onTopicClick }: TrendingTopicsProps) {
  return (
    <div className="flex flex-col gap-3 p-4 border-b bg-muted/30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span>Trending Topics</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <Badge
              key={topic.name}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5"
              onClick={() => onTopicClick(topic.query)}
            >
              <Icon className="h-3.5 w-3.5" />
              {topic.name}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
