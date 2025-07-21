// YouTube Brain - Transcript Fetching System
// This handles all YouTube data retrieval

class YouTubeAPI {
    constructor() {
        // In production, this would use proper API keys
        // For now, we'll use a hybrid approach
        this.cache = new Map();
        this.initCache();
    }
    
    initCache() {
        // Load cached transcripts from localStorage
        const cached = localStorage.getItem('youtube_brain_cache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                Object.entries(data).forEach(([key, value]) => {
                    this.cache.set(key, value);
                });
            } catch (e) {
                console.log('Cache load failed, starting fresh');
            }
        }
    }
    
    saveCache() {
        const cacheObj = {};
        this.cache.forEach((value, key) => {
            cacheObj[key] = value;
        });
        localStorage.setItem('youtube_brain_cache', JSON.stringify(cacheObj));
    }
    
    // Extract video ID from any YouTube URL format
    extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
            /youtube\.com\/.*[?&]v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    }
    
    // Extract channel ID or username
    extractChannelId(url) {
        const patterns = [
            /youtube\.com\/channel\/([^\/\n?#]+)/,
            /youtube\.com\/c\/([^\/\n?#]+)/,
            /youtube\.com\/@([^\/\n?#]+)/,
            /youtube\.com\/user\/([^\/\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return { id: match[1], type: pattern.toString().includes('@') ? 'handle' : 'id' };
        }
        
        return null;
    }
    
    // Get video metadata
    async getVideoInfo(videoId) {
        // Check cache first
        const cacheKey = `info_${videoId}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // In production, this would use YouTube Data API
        // For demo, we'll use structured data
        const info = {
            id: videoId,
            title: await this.fetchVideoTitle(videoId),
            channel: await this.fetchChannelName(videoId),
            duration: await this.fetchDuration(videoId),
            publishedAt: new Date().toISOString(),
            description: '',
            viewCount: Math.floor(Math.random() * 1000000),
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        };
        
        this.cache.set(cacheKey, info);
        this.saveCache();
        return info;
    }
    
    // Fetch video title (simplified for demo)
    async fetchVideoTitle(videoId) {
        // In production: API call
        // For demo: return formatted title
        const titles = {
            '3qHkcs3kG44': 'Naval Ravikant - How to Get Rich',
            'PUv66718DII': 'Bret Victor - Inventing on Principle',
            'rfscVS0vtbw': 'Learn Python - Full Course for Beginners'
        };
        return titles[videoId] || 'YouTube Video';
    }
    
    // Fetch channel name
    async fetchChannelName(videoId) {
        const channels = {
            '3qHkcs3kG44': 'Naval',
            'PUv66718DII': 'Bret Victor',
            'rfscVS0vtbw': 'freeCodeCamp.org'
        };
        return channels[videoId] || 'YouTube Channel';
    }
    
    // Fetch video duration
    async fetchDuration(videoId) {
        return Math.floor(Math.random() * 60 + 10); // 10-70 minutes
    }
    
    // Main function: Get transcript from video URL
    async getTranscript(url) {
        const videoId = this.extractVideoId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }
        
        // Check cache
        const cacheKey = `transcript_${videoId}`;
        if (this.cache.has(cacheKey)) {
            return {
                videoId,
                transcript: this.cache.get(cacheKey),
                cached: true
            };
        }
        
        // Fetch transcript
        const transcript = await this.fetchTranscript(videoId);
        
        // Cache it
        this.cache.set(cacheKey, transcript);
        this.saveCache();
        
        return {
            videoId,
            transcript,
            cached: false
        };
    }
    
    // Fetch transcript (would use real API in production)
    async fetchTranscript(videoId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, return rich transcripts based on video ID
        const transcripts = {
            '3qHkcs3kG44': this.getNavalTranscript(),
            'PUv66718DII': this.getBretVictorTranscript(),
            'rfscVS0vtbw': this.getPythonTutorialTranscript()
        };
        
        return transcripts[videoId] || this.getDefaultTranscript();
    }
    
    // Get channel videos
    async getChannelVideos(channelUrl, limit = 10) {
        const channel = this.extractChannelId(channelUrl);
        if (!channel) {
            throw new Error('Invalid channel URL');
        }
        
        // Simulate fetching channel videos
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return mock video list
        const videos = [];
        for (let i = 0; i < limit; i++) {
            videos.push({
                id: `video_${i}_${Date.now()}`,
                title: `Video ${i + 1}: Insights on ${['Success', 'Learning', 'Building', 'Growth'][i % 4]}`,
                duration: Math.floor(Math.random() * 60 + 10),
                views: Math.floor(Math.random() * 100000),
                publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
            });
        }
        
        return {
            channel: channel.id,
            videos
        };
    }
    
    // Rich transcript examples
    getNavalTranscript() {
        return `The fundamental principle of getting rich is that you need to own equity in a business. You need to have ownership. The reason for that is that humans are constantly creating wealth through specialization and trade. And if you want to get your share of that wealth, you need to own a piece of the wealth creation machine.

Specific knowledge is knowledge that you cannot be trained for. If society can train you, it can train someone else and replace you. Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now. Building specific knowledge will feel like play to you but will look like work to others.

The most important skill for getting rich is becoming a perpetual learner. You have to know how to learn anything you want to learn. The old model of making money is going to school for four years, getting your degree, and working as a professional for thirty years. But things change fast now. Now, you have to come up to speed on a new profession within nine months or a year. And your old profession can be obsolete within five or ten years.

Leverage comes in multiple forms. The oldest form of leverage is labor - other people working for you. Then there's capital leverage - using money to make money. The newest forms of leverage are permissionless: code and media. You can create software and content that works for you while you sleep. An army of robots is freely available - it's just packed in data centers for heat and efficiency. Use it.

Learn to sell, learn to build. If you can do both, you will be unstoppable. These are the two skills to master. Building is about creating the product. Selling is about distribution, marketing, pricing, and talking to customers.

Reading is faster than listening. Doing is faster than watching. The best way to learn is by doing. The second best is by reading. Everything else is just entertainment disguised as learning.

Code and media are permissionless leverage. They're the leverage behind the newly rich. You can create software and media that works for you while you sleep. If you can't code, write books and blogs, record videos and podcasts.

There are no get-rich-quick schemes. Those are just someone else getting rich off you. All the benefits in life come from compound interest, whether in money, relationships, love, health, activities, or habits.

The internet has massively broadened the possible space of careers. Most people haven't figured this out yet. You can go on the internet, and you can find your audience. And you can build a business, and create a product, and build wealth.

Play long-term games with long-term people. All returns in life come from compound interest over many turns of long-term games. Pick an industry where you can play long-term games with long-term people.`;
    }
    
    getBretVictorTranscript() {
        return `The most dangerous thought you can have as a creative person is to think you know what you're doing. Because once you think you know what you're doing, you stop looking around for other ways of doing things. And you stop being able to see other ways of doing things. You become blind.

I've spent a lot of time over the years making creative tools, making creative environments, and in the process I've come up with some guiding principles. The first principle is that creators need an immediate connection to what they're creating.

When you're making something, if you make a change or make a decision, you need to see the effect of that immediately. There can't be a delay. There can't be anything hidden. Creators have to be able to see what they're doing.

The second principle is that creators need to be able to try ideas as quickly as possible. Because the creative process is about exploring the space of possibilities. And if you can't explore quickly, you can't explore much.

The problem with traditional programming is that you have this text editor, and you type your code, and then you have to compile it, and run it, and see what happens. And if it's not what you want, you have to go back to the code, try to figure out what went wrong, make a change, compile, run, and repeat. This cycle is too long.

What I'm going to show you here is a coding environment where the feedback is instantaneous. As I type, as I make changes, I can see the results immediately. This fundamentally changes how you think about programming. You're no longer guessing and checking. You're having a conversation with your creation.

This principle, immediate connection, doesn't just apply to programming. It applies to any creative discipline. When artists paint, they see each stroke immediately. When musicians play, they hear each note. But so many of our tools introduce this artificial delay between the creative thought and seeing the result.

Tools influence the thoughts we can think. Marshall McLuhan said, "We shape our tools, and thereafter our tools shape us." The tools we use have a profound and devious influence on our thinking habits, and therefore on our thinking abilities.

So if you're designing a tool, you have a responsibility. You have a responsibility to understand how your tool influences and shapes the thoughts of the people who use it. And you have a responsibility to give those people the greatest possible freedom to think new thoughts.`;
    }
    
    getPythonTutorialTranscript() {
        return `Python is one of the most popular programming languages in the world. It's used for web development, data science, artificial intelligence, and automation. Today, we're going to learn Python from the ground up.

Let's start with variables. In Python, you don't need to declare the type of a variable. Python figures it out automatically. You can create a variable by simply assigning a value to it. For example: name = "John", age = 25, is_student = True.

The fundamental data types in Python are: integers (whole numbers), floats (decimal numbers), strings (text), and booleans (True or False). Python also has complex data structures like lists, tuples, dictionaries, and sets.

Lists are ordered collections that can be modified. You create them with square brackets: my_list = [1, 2, 3, 4, 5]. You can add items with append(), remove items with remove(), and access items by index.

Functions are reusable blocks of code. You define them with the 'def' keyword. Functions can take parameters and return values. This is a fundamental concept in programming - breaking down complex problems into smaller, manageable functions.

Control flow is how you make decisions in your code. The if statement lets you execute code conditionally. The for loop lets you repeat code for each item in a collection. The while loop repeats code while a condition is true.

Object-oriented programming is a paradigm where you model real-world things as objects. Objects have attributes (data) and methods (functions). You create objects from classes, which are like blueprints.

Error handling is crucial for robust programs. Python uses try/except blocks to handle errors gracefully. This prevents your program from crashing when something unexpected happens.

Python's real power comes from its vast ecosystem of libraries. NumPy for numerical computing, Pandas for data analysis, Django for web development, TensorFlow for machine learning. Whatever you want to do, there's probably a Python library for it.

The key to learning Python - or any programming language - is practice. Start with small projects. Build things that interest you. Make mistakes. Debug them. That's how you really learn.`;
    }
    
    getDefaultTranscript() {
        return `Welcome to this video. Today we're going to explore some interesting concepts that I think will really change how you think about this topic.

The first key insight is that everything is connected. When you start to see the patterns, you realize that the same principles apply across different domains. This is what makes learning so powerful - once you understand the fundamental principles, you can apply them everywhere.

Let me tell you a story about when I first discovered this. I was working on a problem that seemed impossible. I had tried every approach I could think of. Then I realized I was thinking about it all wrong. The solution wasn't to work harder - it was to work smarter.

The breakthrough came when I started asking different questions. Instead of "How can I do this?" I asked "What would this look like if it were easy?" That simple reframe changed everything. Suddenly, I could see possibilities I had been blind to before.

This brings me to the second major point: constraints are actually your friend. When you have unlimited options, you get paralyzed. But when you have constraints, you get creative. The best solutions often come from working within tight constraints.

Another critical insight is the power of compounding. Small improvements, made consistently over time, lead to dramatic results. This applies to learning, to building products, to relationships - really to every area of life. The key is consistency.

Let's talk about mental models. A mental model is simply a way of understanding how something works. The more mental models you have, the better you can understand and navigate the world. Some of my favorite mental models include first principles thinking, inversion, and the 80/20 principle.

The most successful people I know all share one trait: they're perpetual learners. They're constantly reading, experimenting, asking questions. They're not afraid to admit what they don't know. In fact, they're excited by it - because it means there's more to discover.

I want to leave you with this thought: the future belongs to those who can learn, unlearn, and relearn. The world is changing faster than ever. The skills that got you here won't necessarily get you there. Stay curious. Stay humble. Keep learning.`;
    }
}

// Export for use
window.YouTubeAPI = new YouTubeAPI();