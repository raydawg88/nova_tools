import requests
import json
from datetime import datetime
import time

headers = {
    'User-Agent': 'ProductOpportunityDeepSearch/1.0'
}

# Search for specific queries across Reddit
search_queries = [
    'does anyone know a tool that',
    'is there an app for',
    'wish there was an app',
    'someone should build',
    'looking for software that',
    'need a simple tool',
    'frustrated trying to find'
]

all_results = []

print("Deep searching Reddit for specific product opportunities...\n")

for query in search_queries:
    print(f"Searching for: '{query}'")
    
    # Reddit search API
    url = f'https://www.reddit.com/search.json?q="{query}"&sort=relevance&t=month&limit=25'
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        for post in data['data']['children']:
            submission = post['data']
            
            # Only include self posts (text posts) with good engagement
            if submission.get('is_self') and (submission['score'] > 50 or submission['num_comments'] > 10):
                all_results.append({
                    'title': submission['title'],
                    'subreddit': submission['subreddit_name_prefixed'],
                    'url': f'https://reddit.com{submission["permalink"]}',
                    'score': submission['score'],
                    'num_comments': submission['num_comments'],
                    'created_utc': datetime.fromtimestamp(submission['created_utc']).strftime('%Y-%m-%d'),
                    'selftext': submission.get('selftext', '')[:800],
                    'search_query': query
                })
        
        time.sleep(2)  # Rate limiting
        
    except Exception as e:
        print(f"Error searching for '{query}': {e}")

# Sort by engagement
all_results.sort(key=lambda x: x['score'] + x['num_comments'] * 5, reverse=True)

# Display top 5 opportunities
print("\n" + "="*80)
print("TOP 5 SPECIFIC PRODUCT OPPORTUNITIES")
print("="*80)

for i, result in enumerate(all_results[:5], 1):
    print(f"\n{i}. {result['title']}")
    print(f"   Subreddit: {result['subreddit']}")
    print(f"   Upvotes: {result['score']:,} | Comments: {result['num_comments']:,}")
    print(f"   Date: {result['created_utc']}")
    print(f"   URL: {result['url']}")
    print(f"   Search match: \"{result['search_query']}\"")
    
    if result['selftext']:
        # Extract the most relevant part
        text = result['selftext'].replace('\n', ' ')
        print(f"\n   Problem Description:")
        print(f"   {text[:300]}...")
        
    print(f"\n   🎯 PRODUCT OPPORTUNITY:")
    
    # Analyze based on title and content
    title_lower = result['title'].lower()
    
    if 'organize' in title_lower or 'manage' in title_lower:
        print("   - Organization/management tool opportunity")
        print("   - Target: People struggling with information overload")
        
    elif 'track' in title_lower or 'monitor' in title_lower:
        print("   - Tracking/monitoring tool opportunity")
        print("   - Target: Users wanting better visibility/analytics")
        
    elif 'automate' in title_lower or 'automatic' in title_lower:
        print("   - Automation tool opportunity")
        print("   - Target: Users looking to save time on repetitive tasks")
        
    elif 'convert' in title_lower or 'transfer' in title_lower:
        print("   - Conversion/migration tool opportunity")
        print("   - Target: Users dealing with incompatible formats/systems")
        
    else:
        print("   - General productivity tool opportunity")
        print("   - High engagement suggests unmet need in the market")
    
    print("   - Validation: Strong community interest with high engagement")
    print("\n" + "-"*80)

# Save results
with open('/Users/gameden/nova-workspace/reddit_deep_search_results.json', 'w') as f:
    json.dump({
        'search_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_results': len(all_results),
        'top_opportunities': all_results[:10]
    }, f, indent=2)

print(f"\nTotal opportunities found: {len(all_results)}")
print("Detailed results saved to reddit_deep_search_results.json")