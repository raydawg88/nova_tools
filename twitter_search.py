#!/usr/bin/env python3
"""
Twitter/X.com search script to find viral tweets about:
1. Everyday frustrations
2. "I wish there was an app for..." posts
3. Popular life hacks that could be productized
4. Trending complaints about technology/life
"""

import requests
import json
from datetime import datetime
import time

# Twitter API v2 endpoint
SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"

# Bearer token
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAOp22wEAAAAAqpPIuJB1dXf09XQ61Jf8pA6wYhc%3DBVPcguctULvILUw9QhNYIbJLmAQ7PCOQsG8PpPr8BD7BRYbn4w"

# Headers for authentication
headers = {
    "Authorization": f"Bearer {BEARER_TOKEN}",
    "Content-Type": "application/json"
}

def search_tweets(query, max_results=10):
    """Search tweets with engagement metrics"""
    params = {
        "query": query,
        "max_results": max_results,
        "tweet.fields": "public_metrics,created_at,author_id,conversation_id",
        "expansions": "author_id",
        "user.fields": "username,verified"
    }
    
    try:
        response = requests.get(SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error searching for '{query}': {e}")
        if response.status_code == 429:
            print("Rate limit hit. Waiting 15 minutes...")
            time.sleep(900)
        return None

def format_tweet_data(data):
    """Format tweet data with engagement metrics"""
    if not data or 'data' not in data:
        return []
    
    tweets = []
    users = {user['id']: user for user in data.get('includes', {}).get('users', [])}
    
    for tweet in data['data']:
        metrics = tweet.get('public_metrics', {})
        author = users.get(tweet['author_id'], {})
        
        # Calculate engagement rate
        engagement = (
            metrics.get('like_count', 0) + 
            metrics.get('retweet_count', 0) * 2 + 
            metrics.get('reply_count', 0) + 
            metrics.get('quote_count', 0)
        )
        
        tweets.append({
            'text': tweet['text'],
            'author': f"@{author.get('username', 'unknown')}",
            'verified': author.get('verified', False),
            'created_at': tweet.get('created_at', ''),
            'likes': metrics.get('like_count', 0),
            'retweets': metrics.get('retweet_count', 0),
            'replies': metrics.get('reply_count', 0),
            'quotes': metrics.get('quote_count', 0),
            'engagement_score': engagement,
            'url': f"https://twitter.com/{author.get('username', 'unknown')}/status/{tweet['id']}"
        })
    
    # Sort by engagement score
    return sorted(tweets, key=lambda x: x['engagement_score'], reverse=True)

def main():
    # Search queries for different categories
    searches = [
        {
            'category': 'Everyday Frustrations (High Engagement)',
            'queries': [
                '"I hate when" min_retweets:100',
                '"why is it so hard to" min_likes:500',
                '"annoying when" min_retweets:50',
                '"frustrating" min_likes:1000',
                '"can we normalize" min_retweets:100'
            ]
        },
        {
            'category': 'App Ideas - "I wish there was an app"',
            'queries': [
                '"I wish there was an app" -is:retweet',
                '"someone should make an app" -is:retweet',
                '"need an app that" -is:retweet',
                '"app idea" min_likes:100',
                '"million dollar app idea" -is:retweet'
            ]
        },
        {
            'category': 'Life Hacks That Could Be Products',
            'queries': [
                '"life hack" min_retweets:200',
                '"pro tip" min_likes:1000',
                '"game changer" min_retweets:100',
                '"this trick" min_likes:500',
                '"productivity hack" min_retweets:50'
            ]
        },
        {
            'category': 'Tech/Life Complaints',
            'queries': [
                '"technology" "hate" min_likes:500',
                '"why do" "apps" min_retweets:50',
                '"modern life" "frustrating" min_likes:200',
                '"2024" "problem" min_retweets:100',
                '"first world problems" min_likes:1000'
            ]
        }
    ]
    
    all_results = []
    
    for search_group in searches:
        print(f"\n{'='*60}")
        print(f"CATEGORY: {search_group['category']}")
        print('='*60)
        
        category_tweets = []
        
        for query in search_group['queries']:
            print(f"\nSearching: {query}")
            data = search_tweets(query, max_results=10)
            
            if data:
                tweets = format_tweet_data(data)
                category_tweets.extend(tweets)
                # Add slight delay to avoid rate limits
                time.sleep(1)
        
        # Get top 5 tweets per category by engagement
        top_tweets = sorted(category_tweets, key=lambda x: x['engagement_score'], reverse=True)[:5]
        
        for i, tweet in enumerate(top_tweets, 1):
            print(f"\n--- Tweet #{i} ---")
            print(f"Author: {tweet['author']} {'✓' if tweet['verified'] else ''}")
            print(f"Tweet: {tweet['text'][:280]}")
            print(f"Engagement: {tweet['likes']:,} likes | {tweet['retweets']:,} retweets | {tweet['replies']:,} replies")
            print(f"Total Engagement Score: {tweet['engagement_score']:,}")
            print(f"URL: {tweet['url']}")
            
            all_results.append({
                'category': search_group['category'],
                'rank': i,
                **tweet
            })
    
    # Save results to JSON
    with open('twitter_search_results.json', 'w') as f:
        json.dump(all_results, f, indent=2)
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total viral tweets found: {len(all_results)}")
    print("Results saved to: twitter_search_results.json")
    
    # Find the most viral tweet overall
    if all_results:
        most_viral = max(all_results, key=lambda x: x['engagement_score'])
        print(f"\nMost viral tweet overall:")
        print(f"Category: {most_viral['category']}")
        print(f"Engagement Score: {most_viral['engagement_score']:,}")
        print(f"Text: {most_viral['text'][:200]}...")

if __name__ == "__main__":
    main()