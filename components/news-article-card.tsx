import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  sentiment?: "positive" | "negative" | "neutral"
}

interface NewsArticleCardProps {
  article: NewsArticle
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />
      case "negative":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      case "negative":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {article.urlToImage && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={article.urlToImage || "/placeholder.svg"}
            alt={article.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight line-clamp-2">{article.title}</CardTitle>
          {article.sentiment && (
            <Badge variant="outline" className={`flex items-center gap-1 ${getSentimentColor()}`}>
              {getSentimentIcon()}
              <span className="capitalize text-xs">{article.sentiment}</span>
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span>{article.source.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{article.description}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Read full article
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  )
}
