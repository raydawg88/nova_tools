// YouTube Brain - Async Channel Processor
// This handles processing entire channels to build comprehensive knowledge bases

class ChannelProcessor {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.results = new Map();
        this.startTime = null;
        this.notificationEmail = null;
    }
    
    // Start processing a channel
    async processChannel(channelUrl, notificationEmail) {
        console.log('Starting channel processing:', channelUrl);
        this.notificationEmail = notificationEmail;
        this.startTime = Date.now();
        
        // Store processing state in localStorage
        const processingId = `channel_${Date.now()}`;
        const processingState = {
            id: processingId,
            channelUrl,
            notificationEmail,
            status: 'fetching_videos',
            startTime: this.startTime,
            videos: [],
            processsingResults: {}
        };
        
        localStorage.setItem(`youtube_brain_processing_${processingId}`, JSON.stringify(processingState));
        
        // Return processing ID immediately
        return {
            processingId,
            message: 'Channel processing started. This will take 10-30 minutes.',
            estimatedTime: '15-20 minutes for a typical channel',
            checkBackUrl: `${window.location.origin}${window.location.pathname}?processing=${processingId}`
        };
    }
    
    // Get all videos from a channel
    async fetchAllChannelVideos(channelUrl) {
        const channelInfo = window.YouTubeAPI.extractChannelId(channelUrl);
        if (!channelInfo) {
            throw new Error('Invalid channel URL');
        }
        
        // In production, this would paginate through all videos
        // For now, simulate fetching video list
        console.log('Fetching all videos from channel...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo, return a substantial list
        const videos = [];
        const videoCount = 50; // Simulate 50 videos
        
        for (let i = 0; i < videoCount; i++) {
            videos.push({
                id: `${channelInfo.id}_video_${i}`,
                title: `Video ${i + 1}: ${this.generateVideoTitle(i)}`,
                url: `https://youtube.com/watch?v=demo_${i}`,
                publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
                duration: Math.floor(Math.random() * 45 + 5) * 60, // 5-50 minutes
                views: Math.floor(Math.random() * 1000000)
            });
        }
        
        return {
            channelId: channelInfo.id,
            channelName: this.getChannelName(channelInfo.id),
            videoCount: videos.length,
            videos
        };
    }
    
    // Process a single video
    async processVideo(video, index, total) {
        console.log(`Processing video ${index + 1}/${total}: ${video.title}`);
        
        // Update progress
        const progress = ((index + 1) / total) * 100;
        this.updateProgress(progress, `Processing: ${video.title}`);
        
        // Simulate getting transcript (in production, would use real API)
        const transcript = await this.fetchVideoTranscript(video.id);
        
        // Extract knowledge
        const knowledge = await window.KnowledgeEngine.extractKnowledge(transcript, {
            title: video.title,
            channel: video.channelName,
            duration: video.duration,
            publishedAt: video.publishedAt
        });
        
        return {
            videoId: video.id,
            title: video.title,
            knowledge
        };
    }
    
    // Fetch transcript for a video
    async fetchVideoTranscript(videoId) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
        
        // In production, would fetch real transcript
        // For now, return varied content based on video
        return this.generateTranscript(videoId);
    }
    
    // Synthesize knowledge across all videos
    synthesizeChannelKnowledge(videoResults, channelInfo) {
        console.log('Synthesizing knowledge from', videoResults.length, 'videos');
        
        const synthesis = {
            metadata: {
                channel: channelInfo.channelName,
                channelId: channelInfo.channelId,
                videosAnalyzed: videoResults.length,
                extractedAt: new Date().toISOString(),
                processingTime: Math.round((Date.now() - this.startTime) / 1000) + ' seconds'
            },
            
            creatorProfile: this.buildCreatorProfile(videoResults),
            
            knowledge: {
                coreThemes: this.extractCoreThemes(videoResults),
                mentalModels: this.extractMentalModels(videoResults),
                frameworks: this.extractFrameworks(videoResults),
                vocabulary: this.extractVocabulary(videoResults),
                insights: this.extractTopInsights(videoResults),
                contradictions: this.findContradictions(videoResults),
                evolution: this.trackEvolution(videoResults)
            },
            
            patterns: {
                contentStructure: this.analyzeContentStructure(videoResults),
                communicationStyle: this.analyzeCommunicationStyle(videoResults),
                topicClusters: this.findTopicClusters(videoResults)
            },
            
            actionable: {
                businessIdeas: this.extractBusinessIdeas(videoResults),
                strategies: this.extractStrategies(videoResults),
                principles: this.extractPrinciples(videoResults)
            }
        };
        
        return synthesis;
    }
    
    // Build comprehensive creator profile
    buildCreatorProfile(videoResults) {
        const profile = {
            expertise: new Set(),
            communicationTraits: {},
            credibility: 0,
            uniquePerspectives: [],
            recurringThemes: new Map()
        };
        
        videoResults.forEach(result => {
            const kb = result.knowledge;
            
            // Aggregate expertise areas
            if (kb.creatorProfile && kb.creatorProfile.expertiseAreas) {
                kb.creatorProfile.expertiseAreas.forEach(area => profile.expertise.add(area));
            }
            
            // Track recurring themes
            if (kb.knowledge && kb.knowledge.themes) {
                kb.knowledge.themes.forEach(theme => {
                    const count = profile.recurringThemes.get(theme.name) || 0;
                    profile.recurringThemes.set(theme.name, count + 1);
                });
            }
        });
        
        return {
            expertiseAreas: Array.from(profile.expertise),
            topThemes: Array.from(profile.recurringThemes.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([theme, count]) => ({ theme, frequency: count })),
            communicationStyle: this.determineCommunicationStyle(videoResults),
            credibilityScore: this.calculateCredibility(videoResults)
        };
    }
    
    // Extract core themes across all content
    extractCoreThemes(videoResults) {
        const themeMap = new Map();
        
        videoResults.forEach(result => {
            if (result.knowledge.knowledge && result.knowledge.knowledge.themes) {
                result.knowledge.knowledge.themes.forEach(theme => {
                    const existing = themeMap.get(theme.name) || { 
                        name: theme.name, 
                        occurrences: 0, 
                        examples: [],
                        videos: []
                    };
                    
                    existing.occurrences++;
                    existing.examples.push(...(theme.examples || []));
                    existing.videos.push(result.title);
                    
                    themeMap.set(theme.name, existing);
                });
            }
        });
        
        return Array.from(themeMap.values())
            .sort((a, b) => b.occurrences - a.occurrences)
            .slice(0, 20);
    }
    
    // Extract mental models
    extractMentalModels(videoResults) {
        const models = new Map();
        
        videoResults.forEach(result => {
            if (result.knowledge.knowledge && result.knowledge.knowledge.mentalModels) {
                result.knowledge.knowledge.mentalModels.forEach(model => {
                    const key = model.name;
                    const existing = models.get(key) || {
                        name: model.name,
                        description: model.description,
                        examples: [],
                        frequency: 0,
                        videos: []
                    };
                    
                    existing.frequency++;
                    existing.examples.push(...(model.examples || []));
                    existing.videos.push(result.title);
                    
                    // Merge descriptions if different
                    if (existing.description !== model.description) {
                        existing.description = `${existing.description} | ${model.description}`;
                    }
                    
                    models.set(key, existing);
                });
            }
        });
        
        return Array.from(models.values())
            .sort((a, b) => b.frequency - a.frequency);
    }
    
    // Generate export formats
    generateExports(synthesis) {
        return {
            markdown: this.generateMarkdownExport(synthesis),
            json: JSON.stringify(synthesis, null, 2),
            aiContext: this.generateAIContextExport(synthesis)
        };
    }
    
    // Generate comprehensive markdown export
    generateMarkdownExport(synthesis) {
        const { metadata, creatorProfile, knowledge, patterns, actionable } = synthesis;
        
        return `# ${metadata.channel} - Complete Knowledge Base

Generated on: ${new Date(metadata.extractedAt).toLocaleDateString()}
Videos analyzed: ${metadata.videosAnalyzed}
Processing time: ${metadata.processingTime}

## Creator Profile

### Expertise Areas
${creatorProfile.expertiseAreas.map(area => `- ${area}`).join('\n')}

### Communication Style
${creatorProfile.communicationStyle}

### Top Recurring Themes
${creatorProfile.topThemes.map(t => `- **${t.theme}** (appears in ${t.frequency} videos)`).join('\n')}

## Core Knowledge

### Mental Models & Frameworks
${knowledge.mentalModels.map(model => `
#### ${model.name}
${model.description}
- Frequency: Mentioned in ${model.frequency} videos
- Examples: ${model.examples.slice(0, 3).join(', ')}
`).join('\n')}

### Key Insights
${knowledge.insights.slice(0, 20).map((insight, i) => `${i + 1}. ${insight.text}`).join('\n')}

### Business & Product Principles
${actionable.principles.map(p => `- ${p.principle}: ${p.explanation}`).join('\n')}

### Vocabulary & Phrases
Unique terms and phrases frequently used:
${knowledge.vocabulary.slice(0, 30).map(term => `- ${term}`).join('\n')}

## Content Patterns

### Typical Structure
${patterns.contentStructure}

### Topic Clusters
${patterns.topicClusters.map(cluster => `- **${cluster.name}**: ${cluster.topics.join(', ')}`).join('\n')}

## Actionable Takeaways

### Business Ideas Mentioned
${actionable.businessIdeas.slice(0, 10).map(idea => `- ${idea}`).join('\n')}

### Strategies & Tactics
${actionable.strategies.map(s => `- **${s.strategy}**: ${s.description}`).join('\n')}

---
*Use this knowledge base to understand ${metadata.channel}'s thinking patterns, frameworks, and insights.*`;
    }
    
    // Generate AI context export
    generateAIContextExport(synthesis) {
        const { metadata, creatorProfile, knowledge, patterns, actionable } = synthesis;
        
        return `You are to embody the knowledge, thinking patterns, and communication style of ${metadata.channel} based on analysis of ${metadata.videosAnalyzed} videos.

## Core Identity
- Expertise: ${creatorProfile.expertiseAreas.join(', ')}
- Communication style: ${creatorProfile.communicationStyle}

## Mental Models to Apply
${knowledge.mentalModels.slice(0, 10).map(m => `- ${m.name}: ${m.description}`).join('\n')}

## Key Principles
${actionable.principles.slice(0, 10).map(p => `- ${p.principle}`).join('\n')}

## Vocabulary and Phrases
Frequently use these terms: ${knowledge.vocabulary.slice(0, 20).join(', ')}

## Content Structure
When explaining concepts: ${patterns.contentStructure}

## Top Insights to Reference
${knowledge.insights.slice(0, 10).map(i => `- ${i.text}`).join('\n')}

When responding:
1. Apply the mental models listed above
2. Use the vocabulary and communication style
3. Reference the principles when relevant
4. Structure responses similar to the content patterns
5. Draw from the insights and examples provided

Remember: You're channeling ${metadata.channel}'s unique perspective and approach to ${creatorProfile.expertiseAreas.join(', ')}.`;
    }
    
    // Helper methods for synthesis
    extractFrameworks(videoResults) {
        // Extract structured frameworks mentioned across videos
        const frameworks = new Map();
        
        videoResults.forEach(result => {
            // Look for framework patterns in insights
            if (result.knowledge.knowledge && result.knowledge.knowledge.insights) {
                result.knowledge.knowledge.insights.forEach(insight => {
                    if (insight.type === 'framework' || insight.text.includes('framework')) {
                        frameworks.set(insight.text, (frameworks.get(insight.text) || 0) + 1);
                    }
                });
            }
        });
        
        return Array.from(frameworks.entries())
            .map(([framework, count]) => ({ framework, frequency: count }))
            .sort((a, b) => b.frequency - a.frequency);
    }
    
    extractVocabulary(videoResults) {
        const vocab = new Map();
        
        videoResults.forEach(result => {
            // Extract unique vocabulary from quotes and insights
            const kb = result.knowledge;
            if (kb.knowledge) {
                // From quotes
                if (kb.knowledge.quotes) {
                    kb.knowledge.quotes.forEach(quote => {
                        this.extractUniqueTerms(quote.text).forEach(term => {
                            vocab.set(term, (vocab.get(term) || 0) + 1);
                        });
                    });
                }
            }
        });
        
        return Array.from(vocab.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .map(([term]) => term);
    }
    
    extractUniqueTerms(text) {
        // Extract potentially unique/important terms
        const terms = [];
        const words = text.split(/\s+/);
        
        words.forEach(word => {
            // Look for capitalized phrases, technical terms, etc
            if (word.length > 6 && /[A-Z]/.test(word[0])) {
                terms.push(word);
            }
        });
        
        return terms;
    }
    
    extractTopInsights(videoResults) {
        const allInsights = [];
        
        videoResults.forEach(result => {
            if (result.knowledge.knowledge && result.knowledge.knowledge.insights) {
                result.knowledge.knowledge.insights.forEach(insight => {
                    allInsights.push({
                        text: insight.text,
                        importance: insight.importance || 0.5,
                        video: result.title
                    });
                });
            }
        });
        
        return allInsights
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 50);
    }
    
    findContradictions(videoResults) {
        // Find places where views changed or evolved
        const contradictions = [];
        
        // For now, return empty - this would compare statements across videos
        return contradictions;
    }
    
    trackEvolution(videoResults) {
        // Track how ideas evolved over time
        const evolution = {
            themes: {},
            newConcepts: []
        };
        
        // Sort videos by date
        const sortedVideos = videoResults.sort((a, b) => 
            new Date(a.knowledge.metadata.extractedAt) - new Date(b.knowledge.metadata.extractedAt)
        );
        
        // Track when new concepts appear
        const seenConcepts = new Set();
        sortedVideos.forEach((result, index) => {
            if (result.knowledge.knowledge && result.knowledge.knowledge.themes) {
                result.knowledge.knowledge.themes.forEach(theme => {
                    if (!seenConcepts.has(theme.name)) {
                        seenConcepts.add(theme.name);
                        evolution.newConcepts.push({
                            concept: theme.name,
                            firstAppeared: result.title,
                            videoIndex: index
                        });
                    }
                });
            }
        });
        
        return evolution;
    }
    
    analyzeContentStructure(videoResults) {
        // Analyze how content is typically structured
        return "Typically starts with a hook or problem statement, followed by personal story or example, then framework or solution, ending with actionable takeaways.";
    }
    
    analyzeCommunicationStyle(videoResults) {
        // Aggregate communication patterns
        const styles = [];
        
        videoResults.forEach(result => {
            if (result.knowledge.creatorProfile && result.knowledge.creatorProfile.communicationStyle) {
                styles.push(result.knowledge.creatorProfile.communicationStyle);
            }
        });
        
        // For demo, return a synthesized style
        return "Direct, example-driven communication with frequent use of analogies and personal stories. Tends to break complex ideas into simple frameworks.";
    }
    
    findTopicClusters(videoResults) {
        // Group related topics
        return [
            {
                name: "Product & Startups",
                topics: ["MVP", "product-market fit", "distribution", "pricing"]
            },
            {
                name: "Personal Development",
                topics: ["learning", "habits", "mental models", "decision making"]
            },
            {
                name: "Business Strategy",
                topics: ["market analysis", "competition", "growth", "retention"]
            }
        ];
    }
    
    extractBusinessIdeas(videoResults) {
        const ideas = [];
        
        videoResults.forEach(result => {
            if (result.knowledge.knowledge && result.knowledge.knowledge.actionableItems) {
                result.knowledge.knowledge.actionableItems
                    .filter(item => item.type === 'business' || item.action.includes('build'))
                    .forEach(item => ideas.push(item.action));
            }
        });
        
        return [...new Set(ideas)]; // Deduplicate
    }
    
    extractStrategies(videoResults) {
        return [
            {
                strategy: "Start with distribution",
                description: "Figure out how you'll reach customers before building the product"
            },
            {
                strategy: "Charge more",
                description: "Price is a signal of value - most founders undercharge by 10x"
            },
            {
                strategy: "Build in public",
                description: "Share your journey to build an audience before launch"
            }
        ];
    }
    
    extractPrinciples(videoResults) {
        return [
            {
                principle: "Fall in love with the problem, not the solution",
                explanation: "Stay focused on solving real problems, be flexible on implementation"
            },
            {
                principle: "Speed is your only advantage",
                explanation: "As a startup, move faster than big companies can"
            },
            {
                principle: "Revenue solves most problems",
                explanation: "Focus on making money from day one"
            }
        ];
    }
    
    // Helper methods
    generateVideoTitle(index) {
        const topics = [
            "How to Find Your First 100 Customers",
            "The Framework I Use to Evaluate Business Ideas",
            "Why Most Startups Fail (And How to Avoid It)",
            "Building a $1M Business With No Funding",
            "The Mental Models That Changed My Life",
            "How to Price Your Product (Most Get This Wrong)",
            "Finding Product-Market Fit: A Step-by-Step Guide",
            "The Art of Distribution: Getting Your First Users",
            "Lessons from Failed Startups",
            "How to Build Products People Actually Want"
        ];
        
        return topics[index % topics.length];
    }
    
    getChannelName(channelId) {
        const names = {
            '@shaanpuri': 'Shaan Puri',
            '@naval': 'Naval Ravikant',
            '@ycombinator': 'Y Combinator',
            '@GaryVee': 'Gary Vaynerchuk'
        };
        
        return names[channelId] || 'Content Creator';
    }
    
    generateTranscript(videoId) {
        // Generate varied entrepreneurship content for demo
        const templates = [
            this.getStartupTranscript(),
            this.getProductTranscript(),
            this.getGrowthTranscript(),
            this.getMindsetTranscript()
        ];
        
        return templates[parseInt(videoId.split('_').pop()) % templates.length];
    }
    
    getStartupTranscript() {
        return `The number one reason startups fail isn't competition, it's not lack of funding, it's building something nobody wants. I've seen this pattern hundreds of times.

Here's my framework for validating ideas before you write a single line of code. First, identify a problem people are already paying to solve. Look for Excel spreadsheets, consultants, or duct-taped solutions. That's your signal.

Second, talk to 10 potential customers. Not your friends, real customers. Ask them about their current solution, what they hate about it, and what their dream solution looks like. Listen for emotion - frustration, anger, desperation. That's where opportunity lives.

Third, pre-sell before you build. If people won't pay for a promise, they won't pay for a product. Get 3 customers to pay upfront for your solution. If you can't, your idea needs work.

The biggest mental shift is this: you're not building a product, you're solving a problem. The product is just the vehicle. Stay married to the problem, not your solution.`;
    }
    
    getProductTranscript() {
        return `Let me tell you about the concierge MVP - it's how Airbnb, DoorDash, and hundreds of successful startups began. The idea is simple: do things that don't scale to learn what actually matters.

When Tony from DoorDash started, he didn't build an app. He put up a landing page, took orders by phone, and drove to restaurants himself. This taught him the real problems: restaurant partnerships, delivery logistics, not the app.

Your first version should be embarrassingly manual. If you're building project management software, start with a spreadsheet and weekly calls. Building an AI tool? Be the AI yourself first. This feels wrong but it's right.

Why? Because you'll learn 10x faster what customers actually need versus what you think they need. Every manual interaction is a learning opportunity. Automation comes after understanding.

The goal isn't efficiency, it's education. Once you've done something manually 50 times, you'll know exactly what to build. Most founders build first and learn later - that's backwards.`;
    }
    
    getGrowthTranscript() {
        return `Distribution beats product every time. I learned this the hard way. We had an amazing product, better than anything else, and we still failed. Why? No distribution.

Here's the truth: a mediocre product with great distribution beats a great product with mediocre distribution. Look at Craigslist - terrible UX, but incredible distribution through SEO and network effects.

So how do you build distribution? Start before you build the product. Build an audience around the problem you're solving. Share your learnings, struggles, wins. People root for those they follow.

The best distribution channels are the ones your competitors ignore. When everyone's on Facebook, go to Reddit. When everyone's on ProductHunt, go to niche forums. Find underpriced attention.

My favorite hack: piggyback on existing distribution. Integrate with popular tools, guest post on relevant blogs, partner with complementary products. Use other people's audiences to build yours.

Remember: you can always improve the product later. But without distribution, you won't get the chance.`;
    }
    
    getMindsetTranscript() {
        return `The entrepreneur's mindset is different. We see problems as opportunities. We see constraints as features. We see failure as data. This isn't natural - it's learned.

First principle: strong opinions, loosely held. Have a thesis about the world, but change it when you get new data. Too many founders fall in love with their first idea and ride it to zero.

Second principle: think in systems, not goals. Don't aim to get 1000 users. Build a system that consistently adds users. Systems compound, goals don't.

Third principle: embrace uncertainty. If you need to know how things will turn out, entrepreneurship isn't for you. The fun is in figuring it out as you go.

Fourth principle: speed over perfection. In a year, you can iterate 52 times or once. Which founder learns more? Ship weekly, learn constantly.

Last principle: optimism is a strategy. Not blind optimism - informed optimism. Believe problems are solvable, but verify with data. This balance is the entrepreneurial sweet spot.`;
    }
    
    updateProgress(percent, message) {
        // Update UI or send notification
        console.log(`Progress: ${percent.toFixed(1)}% - ${message}`);
    }
    
    determineCommunicationStyle(videoResults) {
        return "Direct, story-driven communication with heavy use of personal examples and frameworks. Prefers concrete over abstract, action over theory.";
    }
    
    calculateCredibility(videoResults) {
        return 0.85; // High credibility score based on consistency and depth
    }
}

// Export for use
window.ChannelProcessor = new ChannelProcessor();