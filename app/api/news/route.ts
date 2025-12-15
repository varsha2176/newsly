import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, category, country, fromDate, toDate, pageSize = 10 } = body

    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "NEWS_API_KEY environment variable not set. Please add it in the Vars section.",
        },
        { status: 500 },
      )
    }

    // Determine which endpoint to use
    const useEverything = query || fromDate
    const baseUrl = useEverything ? "https://newsapi.org/v2/everything" : "https://newsapi.org/v2/top-headlines"

    const params = new URLSearchParams({
      apiKey,
      pageSize: Math.min(pageSize, 100).toString(),
    })

    if (query) {
      params.append("q", query)
    }

    if (category && !query) {
      params.append("category", category)
    }

    if (country && !query) {
      params.append("country", country)
    }

    if (fromDate) {
      params.append("from", fromDate)
    }

    if (toDate) {
      params.append("to", toDate)
    }

    // Default to last 7 days for everything endpoint
    if (useEverything && !fromDate) {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      params.append("from", sevenDaysAgo.toISOString().split("T")[0])
    }

    params.append("sortBy", query ? "relevancy" : "publishedAt")

    const url = `${baseUrl}?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    const data = await response.json()

    // Add sentiment analysis
    if (data.status === "ok" && data.articles) {
      data.articles = data.articles.map((article: any) => ({
        ...article,
        sentiment: analyzeSentiment(article),
      }))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error in news API route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function analyzeSentiment(article: any): "positive" | "negative" | "neutral" {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase()

  const positiveWords = [
    "success",
    "win",
    "growth",
    "breakthrough",
    "innovation",
    "positive",
    "gain",
    "rise",
    "boost",
    "improve",
  ]
  const negativeWords = ["crisis", "crash", "fail", "loss", "decline", "threat", "risk", "concern", "warning", "drop"]

  const positiveCount = positiveWords.filter((word) => text.includes(word)).length
  const negativeCount = negativeWords.filter((word) => text.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}
