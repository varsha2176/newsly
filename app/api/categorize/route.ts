import { NextResponse } from "next/server"

type CategoryMap = Record<string, string[]>

const CATEGORIES: CategoryMap = {
  sports: [
    "cricket", "football", "soccer", "match", "tournament", "goal", "team",
    "series", "final", "ipl", "t20", "odi", "world cup", "player",
    "coach", "stadium", "league", "championship", "score", "won", "defeated",
  ],

  politics: [
    "government", "election", "minister", "prime minister", "president",
    "parliament", "policy", "vote", "voting", "bjp", "congress",
    "democracy", "law", "bill", "assembly", "cabinet", "political",
    "campaign", "party", "leader",
  ],

  business: [
    "stock", "market", "shares", "company", "revenue", "profit", "loss",
    "startup", "investment", "economy", "economic", "finance", "bank",
    "inflation", "trade", "industry", "corporate", "ceo", "funding",
    "merger", "acquisition",
  ],

  technology: [
    "technology", "tech", "ai", "artificial intelligence", "machine learning",
    "google", "apple", "microsoft", "meta", "openai",
    "software", "hardware", "chip", "semiconductor",
    "android", "ios", "app", "application", "robot", "automation",
    "cybersecurity", "cloud", "data",
  ],

  health: [
    "health", "hospital", "doctor", "medical", "medicine", "disease",
    "virus", "covid", "pandemic", "vaccine", "mental health",
    "fitness", "nutrition", "treatment", "patient", "surgery",
    "healthcare", "wellness",
  ],

  science: [
    "science", "scientist", "research", "experiment", "study",
    "space", "nasa", "isro", "astronomy",
    "physics", "biology", "chemistry", "climate",
    "discovery", "innovation", "laboratory",
  ],

  entertainment: [
    "movie", "film", "cinema", "actor", "actress",
    "music", "song", "album", "concert",
    "celebrity", "bollywood", "hollywood",
    "tv", "series", "show", "award", "festival",
  ],

  education: [
    "education", "school", "college", "university",
    "student", "teacher", "exam", "examination",
    "result", "syllabus", "degree", "course",
    "admission", "scholarship", "academic",
  ],

  crime: [
    "crime", "arrest", "police", "murder", "theft",
    "robbery", "fraud", "scam", "court",
    "investigation", "case", "lawyer",
    "accused", "victim", "illegal",
  ],

  environment: [
    "environment", "climate change", "pollution",
    "global warming", "wildlife", "forest",
    "conservation", "carbon", "emission",
    "recycling", "sustainability", "eco",
  ],
}

const CATEGORY_INSIGHTS: Record<string, string> = {
  sports: "This news focuses on a sporting event, competition, or performance.",
  politics: "This news relates to government, leadership, or political processes.",
  business: "This news discusses economic activity, companies, or financial trends.",
  technology: "This news highlights advancements or events in technology and innovation.",
  health: "This news concerns medical, health, or wellness-related topics.",
  science: "This news is based on scientific research or discoveries.",
  entertainment: "This news involves movies, music, celebrities, or media.",
  education: "This news relates to learning, institutions, or academic activities.",
  crime: "This news reports unlawful activities or legal investigations.",
  environment: "This news focuses on nature, climate, or environmental issues.",
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({
        category: "unknown",
        confidence: 0,
        reason: "No valid text provided for analysis.",
        matchedKeywords: [],
        insight: "Unable to analyze the news content.",
      })
    }

    const content = text.toLowerCase()

    let bestCategory = "unknown"
    let highestScore = 0
    let matchedKeywords: string[] = []

    for (const category in CATEGORIES) {
      const matches = CATEGORIES[category].filter(keyword =>
        content.includes(keyword)
      )

      if (matches.length > highestScore) {
        highestScore = matches.length
        bestCategory = category
        matchedKeywords = matches
      }
    }

    const confidence =
      highestScore === 0 ? 0 : Math.min(100, highestScore * 20)

    return NextResponse.json({
      category: bestCategory,
      confidence,
      reason:
        matchedKeywords.length > 0
          ? `Detected keywords such as ${matchedKeywords.join(", ")}`
          : "No strong keyword signals detected.",
      matchedKeywords,
      insight:
        CATEGORY_INSIGHTS[bestCategory] ||
        "This news does not clearly fall into a known category.",
    })
  } catch (error) {
    return NextResponse.json({
      category: "unknown",
      confidence: 0,
      reason: "Error occurred during news categorization.",
      matchedKeywords: [],
      insight: "Classification failed due to a processing error.",
    })
  }
}
