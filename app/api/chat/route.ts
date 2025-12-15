import { z } from "zod"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request body: 'message' is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Parse query for NewsAPI
    const query = encodeURIComponent(message)
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) throw new Error("NEWS_API_KEY is missing in .env")

    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=5&apiKey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    // Return articles array directly
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[Chat API] Error:", error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
