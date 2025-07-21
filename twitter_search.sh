#!/bin/bash

# Twitter Bearer Token
BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAOp22wEAAAAAqpPIuJB1dXf09XQ61Jf8pA6wYhc%3DBVPcguctULvILUw9QhNYIbJLmAQ7PCOQsG8PpPr8BD7BRYbn4w"

# Function to search tweets
search_tweets() {
    local query="$1"
    local category="$2"
    
    echo "Searching for: $query"
    
    # URL encode the query
    encoded_query=$(printf '%s' "$query" | jq -sRr @uri)
    
    # Make API request
    curl -s -X GET "https://api.twitter.com/2/tweets/search/recent?query=${encoded_query}&max_results=10&tweet.fields=public_metrics,created_at,author_id&expansions=author_id&user.fields=username,verified" \
        -H "Authorization: Bearer $BEARER_TOKEN" \
        -H "Content-Type: application/json" > "search_${category}.json"
}

echo "Starting Twitter search for viral content..."
echo "================================================"

# Search 1: Everyday Frustrations
echo -e "\n1. SEARCHING FOR EVERYDAY FRUSTRATIONS"
search_tweets '"I hate when" min_retweets:100' "frustrations1"
sleep 2
search_tweets '"why is it so hard to" min_likes:500' "frustrations2"
sleep 2
search_tweets '"annoying when" min_retweets:50' "frustrations3"
sleep 2

# Search 2: App Ideas
echo -e "\n2. SEARCHING FOR APP IDEAS"
search_tweets '"I wish there was an app" -is:retweet' "appideas1"
sleep 2
search_tweets '"someone should make an app" -is:retweet' "appideas2"
sleep 2
search_tweets '"need an app that" -is:retweet' "appideas3"
sleep 2

# Search 3: Life Hacks
echo -e "\n3. SEARCHING FOR LIFE HACKS"
search_tweets '"life hack" min_retweets:200' "lifehacks1"
sleep 2
search_tweets '"pro tip" min_likes:1000' "lifehacks2"
sleep 2

# Search 4: Tech Complaints
echo -e "\n4. SEARCHING FOR TECH/LIFE COMPLAINTS"
search_tweets '"technology" "hate" min_likes:500' "techcomplaints1"
sleep 2
search_tweets '"why do" "apps" min_retweets:50' "techcomplaints2"
sleep 2

echo -e "\nSearch complete! Processing results..."

# Combine and format results
echo -e "\n================================================"
echo "PROCESSING RESULTS"
echo "================================================"

# Process each JSON file
for file in search_*.json; do
    if [ -f "$file" ]; then
        echo -e "\nProcessing $file..."
        cat "$file" | jq -r '
            if .data then
                .data[] | 
                "Tweet: " + .text[0:200] + "...\n" +
                "Metrics: " + (.public_metrics.like_count | tostring) + " likes, " + 
                (.public_metrics.retweet_count | tostring) + " retweets, " +
                (.public_metrics.reply_count | tostring) + " replies\n" +
                "Engagement Score: " + ((.public_metrics.like_count + .public_metrics.retweet_count * 2 + .public_metrics.reply_count) | tostring) + "\n" +
                "---"
            else
                "No results found or API error"
            end
        ' 2>/dev/null || echo "Error processing $file"
    fi
done

echo -e "\nAll search results saved to search_*.json files"