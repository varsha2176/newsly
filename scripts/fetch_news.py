"""
News API fetching script
Supports NewsAPI.org for fetching live and historical news
"""
import os
import json
from datetime import datetime, timedelta
from urllib.request import urlopen, Request
from urllib.parse import urlencode, quote

def fetch_news(query=None, category=None, country=None, from_date=None, to_date=None, page_size=10):
    """
    Fetch news from NewsAPI.org
    
    Args:
        query: Search keywords or phrases
        category: business, entertainment, general, health, science, sports, technology
        country: 2-letter ISO 3166-1 code (us, gb, in, etc.)
        from_date: Start date (YYYY-MM-DD)
        to_date: End date (YYYY-MM-DD)
        page_size: Number of results (max 100)
    
    Returns:
        JSON response with articles
    """
    api_key = os.environ.get('NEWS_API_KEY')
    
    if not api_key:
        return {
            'status': 'error',
            'message': 'NEWS_API_KEY environment variable not set. Please add it in the Vars section.'
        }
    
    # Use /everything endpoint for more flexible queries
    base_url = 'https://newsapi.org/v2/everything' if query or from_date else 'https://newsapi.org/v2/top-headlines'
    
    params = {
        'apiKey': api_key,
        'pageSize': min(page_size, 100)
    }
    
    if query:
        params['q'] = query
    
    if category and not query:
        # Category only works with top-headlines
        base_url = 'https://newsapi.org/v2/top-headlines'
        params['category'] = category
    
    if country and not query:
        # Country only works with top-headlines
        base_url = 'https://newsapi.org/v2/top-headlines'
        params['country'] = country
    
    if from_date:
        params['from'] = from_date
    
    if to_date:
        params['to'] = to_date
    
    # If using everything endpoint without dates, default to last 7 days
    if base_url.endswith('everything') and not from_date:
        params['from'] = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    # Sort by relevancy for search queries, publishedAt for general news
    params['sortBy'] = 'relevancy' if query else 'publishedAt'
    
    url = f"{base_url}?{urlencode(params)}"
    
    try:
        req = Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0')
        
        with urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            # Add sentiment analysis (simple keyword-based)
            if data.get('status') == 'ok':
                for article in data.get('articles', []):
                    article['sentiment'] = analyze_sentiment(article)
            
            return data
    
    except Exception as e:
        return {
            'status': 'error',
            'message': f'Error fetching news: {str(e)}'
        }

def analyze_sentiment(article):
    """
    Simple sentiment analysis based on keywords
    """
    text = f"{article.get('title', '')} {article.get('description', '')}".lower()
    
    positive_words = ['success', 'win', 'growth', 'breakthrough', 'innovation', 'positive', 'gain', 'rise', 'boost', 'improve']
    negative_words = ['crisis', 'crash', 'fail', 'loss', 'decline', 'threat', 'risk', 'concern', 'warning', 'drop']
    
    positive_count = sum(1 for word in positive_words if word in text)
    negative_count = sum(1 for word in negative_words if word in text)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'

# Test the function
if __name__ == '__main__':
    result = fetch_news(query='artificial intelligence', page_size=5)
    print(json.dumps(result, indent=2))
