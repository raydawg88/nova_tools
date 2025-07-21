import requests
import json
from datetime import datetime
from collections import defaultdict
import time

# We'll use Reddit's JSON endpoints which don't require authentication
headers = {
    'User-Agent': 'ProductOpportunityScanner/1.0'
}

# Subreddits to search
subreddits = [
    'internetisbeautiful',
    'webdev', 
    'productivity',
    'lifehacks',
    'mildlyinfuriating'
]

# Search patterns
search_patterns = [
    'does anyone know a tool',
    'is there an app',
    'looking for a tool',
    'wish there was',
    'frustrated with',
    'annoying that',
    'would be nice if',
    'someone should make',
    'why isn\'t there',
    'hate when',
    'productivity hack',
    'life hack'
]

opportunities = []

print("Searching Reddit for product opportunities...\n")

for subreddit_name in subreddits:
    print(f"Scanning r/{subreddit_name}...")
    
    # Fetch top posts from the subreddit
    url = f'https://www.reddit.com/r/{subreddit_name}/top.json?t=month&limit=100'
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Process each post
        for post in data['data']['children']:
            submission = post['data']
            title_lower = submission['title'].lower()
            selftext_lower = submission.get('selftext', '').lower()
            
            # Check if post matches our patterns
            matches_pattern = False
            matched_pattern = ""
            
            for pattern in search_patterns:
                if pattern in title_lower or pattern in selftext_lower:
                    matches_pattern = True
                    matched_pattern = pattern
                    break
            
            # Also check for complaint/frustration posts in r/mildlyinfuriating
            if subreddit_name == 'mildlyinfuriating' and submission['score'] > 1000:
                matches_pattern = True
                matched_pattern = "frustration/complaint"
            
            if matches_pattern:
                opportunities.append({
                    'subreddit': f'r/{subreddit_name}',
                    'title': submission['title'],
                    'url': f'https://reddit.com{submission["permalink"]}',
                    'score': submission['score'],
                    'num_comments': submission['num_comments'],
                    'created_utc': datetime.fromtimestamp(submission['created_utc']).strftime('%Y-%m-%d'),
                    'matched_pattern': matched_pattern,
                    'selftext': submission['selftext'][:300] + '...' if submission.get('selftext') and len(submission['selftext']) > 300 else submission.get('selftext', ''),
                    'author': submission.get('author', '[deleted]')
                })
        
        # Rate limiting
        time.sleep(2)
        
    except Exception as e:
        print(f"Error fetching r/{subreddit_name}: {e}")

# Sort by score and get top opportunities
opportunities.sort(key=lambda x: x['score'], reverse=True)

# Group similar opportunities
grouped_opportunities = defaultdict(list)
for opp in opportunities:
    # Simple grouping by keywords
    if 'tool' in opp['title'].lower() or 'app' in opp['title'].lower():
        category = 'Tool/App Requests'
    elif 'hack' in opp['title'].lower():
        category = 'Productivity Hacks'
    elif opp['subreddit'] == 'r/mildlyinfuriating' or 'frustrat' in opp['title'].lower() or 'annoying' in opp['title'].lower():
        category = 'Frustrations/Complaints'
    else:
        category = 'Other Opportunities'
    
    grouped_opportunities[category].append(opp)

# Select top 5 diverse opportunities
final_opportunities = []
for category, opps in grouped_opportunities.items():
    final_opportunities.extend(opps[:2])  # Take top 2 from each category

final_opportunities = sorted(final_opportunities, key=lambda x: x['score'], reverse=True)[:5]

# Display results
print("\n" + "="*80)
print("TOP 5 PRODUCT OPPORTUNITIES FROM REDDIT")
print("="*80)

for i, opp in enumerate(final_opportunities, 1):
    print(f"\n{i}. {opp['title']}")
    print(f"   Subreddit: {opp['subreddit']}")
    print(f"   Upvotes: {opp['score']:,}")
    print(f"   Comments: {opp['num_comments']:,}")
    print(f"   Date: {opp['created_utc']}")
    print(f"   Pattern: {opp['matched_pattern']}")
    print(f"   URL: {opp['url']}")
    
    if opp['selftext']:
        print(f"\n   Post Content: {opp['selftext']}")
    
    # Note: Comments require additional API calls, skipping for now
    
    print("\n   " + "-"*70)

# Save detailed results to JSON
with open('/Users/gameden/nova-workspace/reddit_opportunities.json', 'w') as f:
    json.dump(final_opportunities, f, indent=2)

print(f"\nDetailed results saved to reddit_opportunities.json")
print(f"Total opportunities found: {len(opportunities)}")