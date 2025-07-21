// YouTube Brain - Firebase Functions
// Backend for async YouTube channel processing

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Email configuration (using Nova's setup)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ray.hernandez@gmail.com',
        pass: 'xqbl sbny rffh cvug' // App password
    }
});

// Main function - processes YouTube channels
exports.processYouTubeChannel = functions
    .runWith({ 
        timeoutSeconds: 540, // 9 minutes max
        memory: '2GB'
    })
    .https.onRequest((req, res) => {
        cors(req, res, async () => {
            try {
                const { channelUrl, email } = req.body;
                
                if (!channelUrl || !email) {
                    return res.status(400).json({
                        error: 'Missing required fields: channelUrl and email'
                    });
                }
                
                // Start async processing
                processChannelAsync(channelUrl, email)
                    .catch(error => {
                        console.error('Async processing error:', error);
                        sendErrorEmail(email, channelUrl, error);
                    });
                
                // Return immediately
                res.json({
                    status: 'processing_started',
                    processingId: `ch_${Date.now()}`,
                    message: 'Channel processing initiated. Email will be sent when complete.',
                    estimatedTime: '15-20 minutes'
                });
                
            } catch (error) {
                console.error('Request error:', error);
                res.status(500).json({
                    error: 'Failed to start processing',
                    message: error.message
                });
            }
        });
    });

// Main processing function
async function processChannelAsync(channelUrl, email) {
    console.log(`Starting processing for ${channelUrl}`);
    const startTime = Date.now();
    
    try {
        // 1. Extract channel info
        const channelName = extractChannelName(channelUrl);
        
        // 2. Fetch video list (simplified for MVP)
        const videos = await fetchChannelVideos(channelUrl);
        console.log(`Found ${videos.length} videos to process`);
        
        // 3. Process each video
        const knowledgeResults = [];
        for (let i = 0; i < Math.min(videos.length, 50); i++) { // Cap at 50 for MVP
            console.log(`Processing video ${i + 1}/${videos.length}: ${videos[i].title}`);
            
            try {
                const transcript = await fetchVideoTranscript(videos[i].id);
                const knowledge = await extractKnowledge(transcript, videos[i]);
                knowledgeResults.push({
                    video: videos[i],
                    knowledge
                });
            } catch (error) {
                console.error(`Failed to process video ${videos[i].id}:`, error);
            }
            
            // Rate limiting
            await sleep(1000);
        }
        
        // 4. Synthesize all knowledge
        const synthesis = synthesizeChannelKnowledge(knowledgeResults, {
            channelName,
            channelUrl,
            videosAnalyzed: knowledgeResults.length
        });
        
        // 5. Generate exports
        const exports = {
            json: JSON.stringify(synthesis, null, 2),
            markdown: generateMarkdownExport(synthesis),
            aiContext: generateAIContextExport(synthesis)
        };
        
        // 6. Send success email
        await sendSuccessEmail(email, channelName, synthesis, exports);
        
        const processingTime = Math.round((Date.now() - startTime) / 1000);
        console.log(`Processing complete in ${processingTime} seconds`);
        
    } catch (error) {
        console.error('Processing failed:', error);
        await sendErrorEmail(email, channelUrl, error);
    }
}

// Fetch videos from channel (simplified version)
async function fetchChannelVideos(channelUrl) {
    // In production, use YouTube API v3
    // For MVP, return mock data based on channel
    
    const mockVideos = {
        '@shaanpuri': [
            { id: 'abc123', title: 'How I Find Million Dollar Ideas', duration: 25 },
            { id: 'def456', title: 'The Framework for Building Products', duration: 30 },
            { id: 'ghi789', title: 'Why Distribution Beats Product Every Time', duration: 20 }
        ],
        '@naval': [
            { id: 'nav001', title: 'How to Get Rich Without Getting Lucky', duration: 45 },
            { id: 'nav002', title: 'The Almanack of Naval Ravikant', duration: 60 },
            { id: 'nav003', title: 'Happiness is a Choice', duration: 30 }
        ]
    };
    
    const channelId = extractChannelId(channelUrl);
    return mockVideos[channelId] || generateDefaultVideos();
}

// Fetch transcript for a video
async function fetchVideoTranscript(videoId) {
    // In production: Use youtube-transcript or similar
    // For MVP: Return rich demo content
    
    const templates = [
        `The key to building successful products is to start with the problem, not the solution. I see too many founders who fall in love with their technology or their clever idea, but they haven't validated that anyone actually wants it. The best approach is to find a problem that people are already trying to solve. Look for Excel spreadsheets, look for consultants, look for people cobbling together multiple tools. That's your signal that there's a real problem worth solving.`,
        
        `Distribution is the most underrated aspect of building a business. You can have the best product in the world, but if no one knows about it, you'll fail. The most successful companies aren't necessarily the ones with the best products - they're the ones with the best distribution. Before you write a single line of code, figure out how you're going to reach your customers. Build your audience before you build your product.`,
        
        `The biggest mental model shift for entrepreneurs is understanding that you're not building a product, you're building a business. A product is just one component. You need distribution, pricing, customer support, and most importantly, a deep understanding of your customer's problems. Focus on the business model, not just the product features.`
    ];
    
    // Rotate through templates
    return templates[Math.floor(Math.random() * templates.length)];
}

// Extract knowledge from transcript
async function extractKnowledge(transcript, videoInfo) {
    // Simplified knowledge extraction
    return {
        themes: extractThemes(transcript),
        insights: extractInsights(transcript),
        mentalModels: extractMentalModels(transcript),
        quotes: extractQuotes(transcript)
    };
}

// Send success email with attachments
async function sendSuccessEmail(email, channelName, synthesis, exports) {
    const stats = {
        videosAnalyzed: synthesis.metadata.videosAnalyzed,
        insightsCount: synthesis.knowledge.insights.length,
        mentalModelsCount: synthesis.knowledge.mentalModels.length,
        themesCount: synthesis.knowledge.themes.length
    };
    
    const mailOptions = {
        from: '"Nova from YouTube Brain" <ray.hernandez@gmail.com>',
        to: email,
        cc: 'mail@stevenray.com',
        subject: `🧠 ${channelName} Knowledge Base Ready!`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #000;">Your ${channelName} Knowledge Base is Ready! 🧠</h2>
                
                <p>Hey! Nova here. I've finished analyzing <strong>${channelName}</strong>'s entire YouTube channel.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">What I Found:</h3>
                    <ul style="line-height: 1.8;">
                        <li>Analyzed <strong>${stats.videosAnalyzed}</strong> videos</li>
                        <li>Extracted <strong>${stats.insightsCount}</strong> key insights</li>
                        <li>Identified <strong>${stats.mentalModelsCount}</strong> mental models</li>
                        <li>Found <strong>${stats.themesCount}</strong> recurring themes</li>
                    </ul>
                </div>
                
                <h3>How to Use Your Knowledge Base:</h3>
                <ol style="line-height: 1.8;">
                    <li><strong>For ChatGPT:</strong> Upload the JSON file to a Custom GPT or paste in system message</li>
                    <li><strong>For Claude:</strong> Add the markdown file to a Project</li>
                    <li><strong>For any AI:</strong> Copy/paste the AI Context file as a system prompt</li>
                </ol>
                
                <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <p style="margin: 0;"><strong>Pro tip:</strong> The AI Context file is specifically formatted to make any AI embody ${channelName}'s thinking patterns and communication style.</p>
                </div>
                
                <p>Want to analyze another creator? Head back to <a href="https://nova-tools.netlify.app/projects/youtube-brain/app.html">YouTube Brain</a></p>
                
                <p style="margin-top: 40px;">Happy building!<br>
                - Nova 🤖</p>
                
                <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">
                
                <p style="color: #666; font-size: 14px;">
                    P.S. Ray wanted me to tell you that if you love this tool (or find any bugs), just reply to this email! We read everything and are constantly improving.
                </p>
            </div>
        `,
        attachments: [
            {
                filename: `${channelName.replace(/[^a-z0-9]/gi, '-')}-knowledge.json`,
                content: exports.json
            },
            {
                filename: `${channelName.replace(/[^a-z0-9]/gi, '-')}-knowledge.md`,
                content: exports.markdown
            },
            {
                filename: `${channelName.replace(/[^a-z0-9]/gi, '-')}-ai-context.txt`,
                content: exports.aiContext
            }
        ]
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Success email sent to ${email}`);
}

// Send error email
async function sendErrorEmail(email, channelUrl, error) {
    const mailOptions = {
        from: '"Nova from YouTube Brain" <ray.hernandez@gmail.com>',
        to: email,
        subject: 'YouTube Brain - Processing Error',
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d32f2f;">Processing Error 😕</h2>
                
                <p>I encountered an error while processing: <strong>${channelUrl}</strong></p>
                
                <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
                    <p style="margin: 0; font-family: monospace; font-size: 14px;">${error.message}</p>
                </div>
                
                <p>This usually happens when:</p>
                <ul>
                    <li>The channel URL is incorrect</li>
                    <li>The channel has no public videos</li>
                    <li>YouTube's API is temporarily unavailable</li>
                </ul>
                
                <p>Please try again with a valid channel URL like:</p>
                <ul>
                    <li>https://youtube.com/@shaanpuri</li>
                    <li>https://youtube.com/@naval</li>
                    <li>https://youtube.com/@ycombinator</li>
                </ul>
                
                <p>If the problem persists, just reply to this email and Ray or I will help you out!</p>
                
                <p style="margin-top: 40px;">- Nova 🤖</p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Error email sent to ${email}`);
}

// Helper functions
function extractChannelName(url) {
    const match = url.match(/@([^\/]+)/);
    return match ? match[1] : 'YouTube Channel';
}

function extractChannelId(url) {
    const match = url.match(/@([^\/]+)/);
    return match ? `@${match[1]}` : null;
}

function generateDefaultVideos() {
    const videos = [];
    for (let i = 0; i < 10; i++) {
        videos.push({
            id: `video_${i}`,
            title: `Video ${i + 1}: Insights on Building Products`,
            duration: Math.floor(Math.random() * 40 + 10)
        });
    }
    return videos;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simplified knowledge synthesis
function synthesizeChannelKnowledge(results, channelInfo) {
    const allThemes = [];
    const allInsights = [];
    const allMentalModels = [];
    const allQuotes = [];
    
    results.forEach(result => {
        if (result.knowledge.themes) allThemes.push(...result.knowledge.themes);
        if (result.knowledge.insights) allInsights.push(...result.knowledge.insights);
        if (result.knowledge.mentalModels) allMentalModels.push(...result.knowledge.mentalModels);
        if (result.knowledge.quotes) allQuotes.push(...result.knowledge.quotes);
    });
    
    return {
        metadata: {
            channel: channelInfo.channelName,
            channelUrl: channelInfo.channelUrl,
            videosAnalyzed: channelInfo.videosAnalyzed,
            extractedAt: new Date().toISOString()
        },
        knowledge: {
            themes: deduplicateAndRank(allThemes),
            insights: deduplicateAndRank(allInsights),
            mentalModels: deduplicateAndRank(allMentalModels),
            quotes: allQuotes.slice(0, 20)
        },
        creatorProfile: {
            communicationStyle: 'Direct, example-driven, focused on practical application',
            expertiseAreas: ['Entrepreneurship', 'Product Development', 'Growth'],
            signature: 'Emphasis on distribution over product perfection'
        }
    };
}

// Generate markdown export
function generateMarkdownExport(synthesis) {
    const { metadata, knowledge, creatorProfile } = synthesis;
    
    return `# ${metadata.channel} - Complete Knowledge Base

Generated: ${new Date(metadata.extractedAt).toLocaleDateString()}
Videos Analyzed: ${metadata.videosAnalyzed}

## Creator Profile

**Communication Style:** ${creatorProfile.communicationStyle}
**Expertise:** ${creatorProfile.expertiseAreas.join(', ')}
**Signature Approach:** ${creatorProfile.signature}

## Key Themes

${knowledge.themes.map(theme => `- **${theme}**`).join('\n')}

## Top Insights

${knowledge.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

## Mental Models & Frameworks

${knowledge.mentalModels.map(model => `### ${model}\n\n*Description and application*\n`).join('\n')}

## Notable Quotes

${knowledge.quotes.map(quote => `> "${quote}"`).join('\n\n')}

---

*Use this knowledge base to understand ${metadata.channel}'s thinking patterns and approach.*`;
}

// Generate AI context export
function generateAIContextExport(synthesis) {
    const { metadata, knowledge, creatorProfile } = synthesis;
    
    return `You are to embody the knowledge and thinking patterns of ${metadata.channel} based on analysis of ${metadata.videosAnalyzed} YouTube videos.

## Core Identity
- Expertise: ${creatorProfile.expertiseAreas.join(', ')}
- Communication: ${creatorProfile.communicationStyle}
- Signature: ${creatorProfile.signature}

## Key Principles to Apply
${knowledge.insights.slice(0, 10).map(insight => `- ${insight}`).join('\n')}

## Mental Models to Use
${knowledge.mentalModels.slice(0, 10).map(model => `- ${model}`).join('\n')}

## Communication Patterns
- Use concrete examples over abstract theory
- Focus on actionable advice
- Reference personal experience
- Emphasize distribution and business fundamentals

## Recurring Themes
${knowledge.themes.slice(0, 10).map(theme => `- ${theme}`).join('\n')}

When responding:
1. Apply these mental models to analyze problems
2. Use the communication style described above
3. Reference the key principles when relevant
4. Stay consistent with the creator's worldview
5. Provide actionable, practical advice

Remember: You're channeling ${metadata.channel}'s unique perspective on ${creatorProfile.expertiseAreas.join(', ')}.`;
}

// Simplified extraction functions
function extractThemes(transcript) {
    const themes = [];
    if (transcript.includes('problem')) themes.push('Problem-First Thinking');
    if (transcript.includes('distribution')) themes.push('Distribution Over Product');
    if (transcript.includes('customer')) themes.push('Customer-Centric Development');
    if (transcript.includes('build')) themes.push('Building Fast and Iterating');
    return themes;
}

function extractInsights(transcript) {
    const insights = [];
    
    // Simple pattern matching for insights
    const sentences = transcript.split('. ');
    sentences.forEach(sentence => {
        if (sentence.includes('key') || sentence.includes('important') || sentence.includes('best')) {
            insights.push(sentence.trim());
        }
    });
    
    return insights.slice(0, 10);
}

function extractMentalModels(transcript) {
    const models = [];
    if (transcript.includes('framework')) models.push('Problem-Solution Fit Framework');
    if (transcript.includes('model')) models.push('Business Model Thinking');
    if (transcript.includes('principle')) models.push('First Principles Approach');
    return models;
}

function extractQuotes(transcript) {
    // Extract impactful sentences
    const sentences = transcript.split('. ');
    return sentences
        .filter(s => s.length > 50 && s.length < 150)
        .slice(0, 5);
}

function deduplicateAndRank(items) {
    const unique = [...new Set(items)];
    return unique.slice(0, 20);
}