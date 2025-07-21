import requests
import json
from datetime import datetime
from collections import defaultdict
import time

# We'll use Reddit's JSON endpoints
headers = {
    'User-Agent': 'ProductOpportunityScanner/2.0'
}

# Subreddits to search
subreddits = [
    'webdev',
    'productivity', 
    'lifehacks',
    'startups',
    'SomebodyMakeThis',
    'Lightbulb',
    'InternetIsBeautiful'
]

# More specific search patterns for product opportunities
search_patterns = {
    'tool_requests': [
        'does anyone know a tool',
        'is there an app',
        'looking for a tool',
        'need a tool',
        'any tools that',
        'recommend a tool',
        'looking for software',
        'need software',
        'anyone know of a',
        'is there a way to'
    ],
    'pain_points': [
        'wish there was',
        'frustrated with',
        'annoying that',
        'would be nice if',
        'someone should make',
        'why isn\'t there',
        'hate when',
        'tired of',
        'sick of',
        'wish i could',
        'if only there was'
    ],
    'productivity_needs': [
        'productivity hack',
        'workflow improvement',
        'automate',
        'time saver',
        'efficiency',
        'streamline',
        'organize better'
    ]
}

opportunities = []

print("Searching Reddit for specific product opportunities...\n")

# Search each subreddit
for subreddit_name in subreddits:
    print(f"Scanning r/{subreddit_name}...")
    
    # Search for recent posts (hot and new)
    for sort_type in ['hot', 'new']:
        url = f'https://www.reddit.com/r/{subreddit_name}/{sort_type}.json?limit=50'
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Process each post
            for post in data['data']['children']:
                submission = post['data']
                title_lower = submission['title'].lower()
                selftext_lower = submission.get('selftext', '').lower()
                combined_text = title_lower + ' ' + selftext_lower
                
                # Check which patterns match
                matched_categories = []
                
                for category, patterns in search_patterns.items():
                    for pattern in patterns:
                        if pattern in combined_text:
                            matched_categories.append((category, pattern))
                            break
                
                # Only include if it matches patterns and has engagement
                if matched_categories and (submission['score'] > 10 or submission['num_comments'] > 5):
                    opportunities.append({
                        'subreddit': f'r/{subreddit_name}',
                        'title': submission['title'],
                        'url': f'https://reddit.com{submission["permalink"]}',
                        'score': submission['score'],
                        'num_comments': submission['num_comments'],
                        'created_utc': datetime.fromtimestamp(submission['created_utc']).strftime('%Y-%m-%d %H:%M'),
                        'matched_categories': matched_categories,
                        'selftext': submission.get('selftext', '')[:500],
                        'author': submission.get('author', '[deleted]'),
                        'engagement_score': submission['score'] + (submission['num_comments'] * 10)
                    })
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"Error fetching r/{subreddit_name} ({sort_type}): {e}")

# Sort by engagement score
opportunities.sort(key=lambda x: x['engagement_score'], reverse=True)

# Filter and group opportunities
print("\n" + "="*80)
print("TOP PRODUCT OPPORTUNITIES FROM REDDIT")
print("="*80)

# Group by category
categorized_opportunities = {
    'Tool/App Requests': [],
    'Pain Points & Frustrations': [],
    'Productivity Improvements': []
}

for opp in opportunities[:20]:  # Top 20 by engagement
    categories = [cat for cat, pattern in opp['matched_categories']]
    
    if 'tool_requests' in categories:
        categorized_opportunities['Tool/App Requests'].append(opp)
    elif 'pain_points' in categories:
        categorized_opportunities['Pain Points & Frustrations'].append(opp)
    elif 'productivity_needs' in categories:
        categorized_opportunities['Productivity Improvements'].append(opp)

# Display top 5 opportunities with detailed analysis
top_5_opportunities = []
opportunity_count = 0

for category, opps in categorized_opportunities.items():
    if opportunity_count >= 5:
        break
        
    print(f"\n## {category.upper()}")
    print("-" * 80)
    
    for opp in opps[:2]:  # Top 2 from each category
        if opportunity_count >= 5:
            break
            
        opportunity_count += 1
        top_5_opportunities.append(opp)
        
        print(f"\n{opportunity_count}. {opp['title']}")
        print(f"   📍 Subreddit: {opp['subreddit']}")
        print(f"   📊 Metrics: {opp['score']:,} upvotes | {opp['num_comments']:,} comments")
        print(f"   📅 Posted: {opp['created_utc']}")
        print(f"   🔍 Matched: {', '.join([pattern for _, pattern in opp['matched_categories']])}")
        print(f"   🔗 URL: {opp['url']}")
        
        if opp['selftext']:
            print(f"\n   💭 Context: {opp['selftext'][:200]}...")
            
        print(f"\n   💡 OPPORTUNITY ANALYSIS:")
        
        # Analyze the opportunity
        if 'tool_requests' in [cat for cat, _ in opp['matched_categories']]:
            print(f"      - User is actively seeking a solution")
            print(f"      - High engagement ({opp['engagement_score']} score) indicates broader interest")
            print(f"      - Potential for quick validation through comments")
            
        elif 'pain_points' in [cat for cat, _ in opp['matched_categories']]:
            print(f"      - Clear frustration with current solutions")
            print(f"      - Community validation through upvotes")
            print(f"      - Opportunity for innovative solution")
            
        elif 'productivity_needs' in [cat for cat, _ in opp['matched_categories']]:
            print(f"      - Focus on efficiency and time-saving")
            print(f"      - Target audience: productivity enthusiasts")
            print(f"      - Potential for subscription/SaaS model")

# Save detailed results
output_data = {
    'search_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'total_opportunities_found': len(opportunities),
    'top_5_opportunities': top_5_opportunities,
    'all_opportunities': opportunities[:50]  # Save top 50 for reference
}

with open('/Users/gameden/nova-workspace/reddit_product_opportunities.json', 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"\n\n📊 SUMMARY:")
print(f"- Total opportunities found: {len(opportunities)}")
print(f"- Tool/App requests: {len(categorized_opportunities['Tool/App Requests'])}")
print(f"- Pain points: {len(categorized_opportunities['Pain Points & Frustrations'])}")
print(f"- Productivity needs: {len(categorized_opportunities['Productivity Improvements'])}")
print(f"\n💾 Full results saved to reddit_product_opportunities.json")