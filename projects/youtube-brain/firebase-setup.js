// YouTube Brain - Firebase Setup
// Simple Firebase Functions for async processing

// Frontend code to call Firebase Function
const processChannel = async (channelUrl, email) => {
    try {
        const response = await fetch('https://YOUR-PROJECT.cloudfunctions.net/processYouTubeChannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                channelUrl,
                email,
                timestamp: Date.now()
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error calling Firebase function:', error);
        throw error;
    }
};

// Firebase Function (to be deployed)
/*
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure email (using Nova's existing setup)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ray.hernandez@gmail.com',
        pass: 'xqbl sbny rffh cvug' // App password
    }
});

exports.processYouTubeChannel = functions
    .runWith({ timeoutSeconds: 540, memory: '2GB' })
    .https.onRequest(async (req, res) => {
        const { channelUrl, email } = req.body;
        
        console.log(`Starting processing for ${channelUrl}`);
        
        // Start async processing
        processChannelAsync(channelUrl, email);
        
        // Return immediately
        res.json({
            status: 'processing_started',
            message: 'Channel processing initiated. Email will be sent when complete.',
            estimatedTime: '15-20 minutes'
        });
    });

async function processChannelAsync(channelUrl, email) {
    try {
        // 1. Fetch all video URLs from channel
        const videos = await fetchChannelVideos(channelUrl);
        console.log(`Found ${videos.length} videos`);
        
        // 2. Process each video (with rate limiting)
        const results = [];
        for (let i = 0; i < videos.length; i++) {
            console.log(`Processing video ${i + 1}/${videos.length}`);
            const transcript = await fetchTranscript(videos[i].url);
            const knowledge = await extractKnowledge(transcript, videos[i]);
            results.push(knowledge);
            
            // Rate limit to avoid hitting API limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 3. Synthesize knowledge across all videos
        const synthesis = synthesizeChannelKnowledge(results);
        
        // 4. Generate export files
        const jsonExport = JSON.stringify(synthesis, null, 2);
        const markdownExport = generateMarkdownExport(synthesis);
        const aiContextExport = generateAIContextExport(synthesis);
        
        // 5. Send email with attachments
        await sendCompletionEmail(email, channelUrl, {
            json: jsonExport,
            markdown: markdownExport,
            aiContext: aiContextExport
        });
        
        console.log('Processing complete, email sent!');
        
    } catch (error) {
        console.error('Processing error:', error);
        
        // Send error email
        await transporter.sendMail({
            from: '"Nova from YouTube Brain" <ray.hernandez@gmail.com>',
            to: email,
            subject: 'YouTube Brain - Processing Error',
            text: `There was an error processing ${channelUrl}. Please try again or contact support.`,
            html: `
                <h2>Processing Error</h2>
                <p>We encountered an error while processing the channel: ${channelUrl}</p>
                <p>Error: ${error.message}</p>
                <p>Please try again or reply to this email for support.</p>
                <br>
                <p>- Nova</p>
            `
        });
    }
}

async function sendCompletionEmail(email, channelUrl, exports) {
    const channelName = extractChannelName(channelUrl);
    
    const mailOptions = {
        from: '"Nova from YouTube Brain" <ray.hernandez@gmail.com>',
        to: email,
        cc: 'mail@stevenray.com',
        subject: `YouTube Brain - ${channelName} Knowledge Base Ready! 🧠`,
        text: `Your knowledge base for ${channelName} is ready!`,
        html: `
            <h2>Your ${channelName} Knowledge Base is Ready! 🧠</h2>
            
            <p>Hey! Nova here. I've finished analyzing ${channelName}'s entire YouTube channel.</p>
            
            <h3>What I Found:</h3>
            <ul>
                <li>Analyzed ${exports.videosAnalyzed} videos</li>
                <li>Extracted ${exports.insightsCount} key insights</li>
                <li>Identified ${exports.mentalModelsCount} mental models</li>
                <li>Found ${exports.themesCount} recurring themes</li>
            </ul>
            
            <h3>How to Use Your Knowledge Base:</h3>
            <ol>
                <li><strong>For ChatGPT:</strong> Upload the JSON file to a GPT or use in Custom Instructions</li>
                <li><strong>For Claude:</strong> Add the markdown file to a Project's knowledge</li>
                <li><strong>For any AI:</strong> Copy/paste the AI Context file as system prompt</li>
            </ol>
            
            <h3>Files Attached:</h3>
            <ul>
                <li><strong>${channelName}-knowledge.json</strong> - Complete structured data</li>
                <li><strong>${channelName}-knowledge.md</strong> - Human-readable summary</li>
                <li><strong>${channelName}-ai-context.txt</strong> - Ready-to-use AI prompt</li>
            </ul>
            
            <p>Now you can make any AI think like ${channelName}!</p>
            
            <p>Want to analyze another channel? Just head back to <a href="https://nova-tools.netlify.app/projects/youtube-brain/app-clean.html">YouTube Brain</a></p>
            
            <br>
            <p>Happy building!<br>
            - Nova 🤖</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 40px;">
            P.S. Ray wanted me to tell you that this tool is still in beta. If you love it (or find bugs), 
            reply to this email and let us know!
            </p>
        `,
        attachments: [
            {
                filename: `${channelName}-knowledge.json`,
                content: exports.json
            },
            {
                filename: `${channelName}-knowledge.md`,
                content: exports.markdown
            },
            {
                filename: `${channelName}-ai-context.txt`,
                content: exports.aiContext
            }
        ]
    };
    
    await transporter.sendMail(mailOptions);
}
*/