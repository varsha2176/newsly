# News Chatbot - AI-Powered News Assistant

An intelligent news chatbot built with Next.js, AI SDK, and NewsAPI that helps users discover and understand current events through natural conversation.

## Features

- 🤖 **AI-Powered Conversations** - Natural language interface powered by OpenAI GPT-4
- 📰 **Real-Time News** - Fetches latest news from NewsAPI.org
- 🔍 **Smart Search** - Query by topic, country, category, or date range
- 🎯 **Trending Topics** - Quick access to popular news categories
- 💬 **Rich Formatting** - Beautiful markdown rendering for news articles
- 🌓 **Dark Mode** - Automatic theme support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- NewsAPI.org API key (free tier available)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Add your NewsAPI key in the Vercel project settings or create a `.env.local` file:
   \`\`\`
   NEWS_API_KEY=your_newsapi_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

   Get your free API key at: https://newsapi.org/register

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Example Queries

- "What's happening in the world right now?"
- "Show me AI and technology news from today"
- "Latest news about Bitcoin"
- "Technology news in the United States"
- "Sports news from last week"
- "Business news in India"

### Query Parameters

The chatbot understands:
- **Topics**: Any keyword or phrase (e.g., "climate change", "artificial intelligence")
- **Time ranges**: "today", "yesterday", "last week", "last month"
- **Countries**: 2-letter codes (us, gb, in, etc.)
- **Categories**: business, entertainment, general, health, science, sports, technology

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **AI**: Vercel AI SDK v5 with OpenAI GPT-4
- **News API**: NewsAPI.org via Python route handler
- **UI**: shadcn/ui components with Tailwind CSS v4
- **Styling**: Dark mode support with next-themes

### Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── chat/          # AI SDK chat endpoint with tool calling
│   │   └── news/          # Python news fetching route
│   ├── page.tsx           # Main chat interface
│   ├── layout.tsx         # Root layout with fonts
│   └── globals.css        # Global styles and theme tokens
├── components/
│   ├── chat-message.tsx   # Message display with markdown
│   ├── trending-topics.tsx # Quick topic selection
│   └── ui/                # shadcn/ui components
└── scripts/               # Executable Python scripts
\`\`\`

## API Routes

### `/api/chat` (TypeScript)
- Handles AI conversations
- Uses AI SDK tool calling to fetch news
- Streams responses in real-time

### `/api/news` (Python)
- Fetches news from NewsAPI.org
- Supports filtering by query, date, country, category
- Returns formatted article data

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the `NEWS_API_KEY` environment variable
4. Deploy!

The app will automatically work with Vercel's AI Gateway for OpenAI access.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEWS_API_KEY` | Your NewsAPI.org API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for API calls) | No (defaults to localhost) |

## Limitations

- NewsAPI free tier has rate limits (100 requests/day)
- News articles are limited to the last 30 days on free tier
- Some sources may require attribution

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Built with [v0.dev](https://v0.dev)
- Powered by [NewsAPI.org](https://newsapi.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- AI capabilities from [Vercel AI SDK](https://sdk.vercel.ai)
