#!/bin/bash

# Twitter Bearer Token
BEARER_TOKEN="AAAAAAAAAAAAAAAAAAAAAOp22wEAAAAAqpPIuJB1dXf09XQ61Jf8pA6wYhc%3DBVPcguctULvILUw9QhNYIbJLmAQ7PCOQsG8PpPr8BD7BRYbn4w"

echo "Testing Twitter API with simple search..."

# Try a simple search without advanced operators
curl -X GET "https://api.twitter.com/2/tweets/search/recent?query=frustrating&max_results=5&tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=username" \
    -H "Authorization: Bearer $BEARER_TOKEN" \
    -H "Content-Type: application/json" | jq '.'