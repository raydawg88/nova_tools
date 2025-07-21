// YouTube Brain - Advanced Knowledge Extraction Engine
// This is where the magic happens - deep analysis of content

class KnowledgeEngine {
    constructor() {
        this.conceptGraph = new Map();
        this.confidenceThreshold = 0.7;
    }
    
    // Main extraction pipeline
    async extractKnowledge(transcript, videoInfo = {}) {
        console.log('Starting knowledge extraction...');
        
        // Pre-process transcript
        const processed = this.preprocessTranscript(transcript);
        
        // Layer 1: Basic extraction
        const basicAnalysis = this.performBasicAnalysis(processed);
        
        // Layer 2: Deep analysis
        const deepAnalysis = await this.performDeepAnalysis(processed, basicAnalysis);
        
        // Layer 3: Synthesis
        const synthesis = this.synthesizeKnowledge(basicAnalysis, deepAnalysis);
        
        // Generate final knowledge base
        const knowledgeBase = this.buildKnowledgeBase({
            videoInfo,
            basicAnalysis,
            deepAnalysis,
            synthesis
        });
        
        return knowledgeBase;
    }
    
    // Pre-process transcript for analysis
    preprocessTranscript(transcript) {
        const sentences = this.splitIntoSentences(transcript);
        const paragraphs = this.groupIntoParagraphs(sentences);
        const tokens = this.tokenize(transcript);
        
        return {
            raw: transcript,
            sentences,
            paragraphs,
            tokens,
            wordCount: tokens.length,
            uniqueWords: new Set(tokens.map(t => t.toLowerCase())).size
        };
    }
    
    // Split into sentences with better handling
    splitIntoSentences(text) {
        // Handle abbreviations and edge cases
        const sentences = text
            .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
            .split("|")
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        return sentences.map((sentence, index) => ({
            text: sentence,
            index,
            wordCount: sentence.split(/\s+/).length
        }));
    }
    
    // Group sentences into logical paragraphs
    groupIntoParagraphs(sentences) {
        const paragraphs = [];
        let currentParagraph = [];
        
        sentences.forEach((sentence, i) => {
            currentParagraph.push(sentence);
            
            // Paragraph break heuristics
            const isLongPause = i < sentences.length - 1 && 
                sentences[i + 1].text.match(/^(So|Now|Next|First|Second|Another|Finally)/);
            const isTopicShift = this.detectTopicShift(sentence, sentences[i + 1]);
            
            if (isLongPause || isTopicShift || currentParagraph.length >= 5) {
                paragraphs.push([...currentParagraph]);
                currentParagraph = [];
            }
        });
        
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph);
        }
        
        return paragraphs;
    }
    
    // Detect topic shifts
    detectTopicShift(sentence1, sentence2) {
        if (!sentence1 || !sentence2) return false;
        
        const keywords1 = this.extractKeywords(sentence1.text);
        const keywords2 = this.extractKeywords(sentence2.text);
        
        const overlap = keywords1.filter(k => keywords2.includes(k)).length;
        const similarity = overlap / Math.max(keywords1.length, keywords2.length);
        
        return similarity < 0.2; // Low similarity indicates topic shift
    }
    
    // Tokenize text
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s'-]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }
    
    // Layer 1: Basic Analysis
    performBasicAnalysis(processed) {
        return {
            themes: this.extractThemes(processed),
            insights: this.extractInsights(processed),
            patterns: this.extractPatterns(processed),
            mentalModels: this.extractMentalModels(processed),
            references: this.extractReferences(processed),
            quotes: this.extractQuotes(processed),
            statistics: this.extractStatistics(processed)
        };
    }
    
    // Extract themes with better accuracy
    extractThemes(processed) {
        const themePatterns = {
            'success_and_achievement': {
                keywords: ['success', 'achieve', 'accomplish', 'goal', 'win', 'excel'],
                weight: 0
            },
            'learning_and_growth': {
                keywords: ['learn', 'grow', 'improve', 'develop', 'skill', 'knowledge'],
                weight: 0
            },
            'innovation_and_creativity': {
                keywords: ['create', 'innovate', 'invent', 'new', 'novel', 'original'],
                weight: 0
            },
            'problem_solving': {
                keywords: ['solve', 'solution', 'problem', 'challenge', 'obstacle', 'issue'],
                weight: 0
            },
            'systems_and_processes': {
                keywords: ['system', 'process', 'method', 'framework', 'structure', 'organize'],
                weight: 0
            },
            'relationships_and_networking': {
                keywords: ['relationship', 'network', 'connect', 'people', 'team', 'collaborate'],
                weight: 0
            },
            'mindset_and_philosophy': {
                keywords: ['think', 'believe', 'mindset', 'philosophy', 'principle', 'value'],
                weight: 0
            },
            'wealth_and_business': {
                keywords: ['money', 'wealth', 'business', 'invest', 'equity', 'capital'],
                weight: 0
            }
        };
        
        // Count keyword occurrences
        processed.tokens.forEach(token => {
            Object.entries(themePatterns).forEach(([theme, data]) => {
                if (data.keywords.includes(token)) {
                    data.weight++;
                }
            });
        });
        
        // Extract top themes with context
        const themes = Object.entries(themePatterns)
            .filter(([_, data]) => data.weight > 5)
            .sort((a, b) => b[1].weight - a[1].weight)
            .slice(0, 5)
            .map(([theme, data]) => ({
                name: theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                weight: data.weight,
                confidence: Math.min(data.weight / processed.tokens.length * 10, 1),
                examples: this.findThemeExamples(theme, processed)
            }));
        
        return themes;
    }
    
    // Find examples of themes in text
    findThemeExamples(theme, processed) {
        const examples = [];
        const keywords = {
            'wealth_and_business': ['money', 'wealth', 'business', 'equity'],
            'learning_and_growth': ['learn', 'grow', 'improve', 'skill']
        }[theme] || [];
        
        processed.sentences.forEach(sentence => {
            const hasKeyword = keywords.some(k => 
                sentence.text.toLowerCase().includes(k)
            );
            
            if (hasKeyword && examples.length < 3) {
                examples.push(sentence.text);
            }
        });
        
        return examples;
    }
    
    // Extract insights with confidence scoring
    extractInsights(processed) {
        const insights = [];
        const insightPatterns = [
            {
                pattern: /(?:the key|key insight|important thing) (?:is|to understand)/i,
                type: 'key_principle',
                confidence: 0.9
            },
            {
                pattern: /(?:what I learned|lesson learned|takeaway)/i,
                type: 'lesson',
                confidence: 0.85
            },
            {
                pattern: /(?:you need to|you have to|you must)/i,
                type: 'advice',
                confidence: 0.8
            },
            {
                pattern: /(?:the truth is|reality is|fact is)/i,
                type: 'reality_check',
                confidence: 0.85
            },
            {
                pattern: /(?:most people|everyone thinks|common belief)/i,
                type: 'contrarian',
                confidence: 0.75
            },
            {
                pattern: /(?:the secret|hidden|not obvious)/i,
                type: 'hidden_insight',
                confidence: 0.8
            }
        ];
        
        processed.sentences.forEach((sentence, idx) => {
            insightPatterns.forEach(({ pattern, type, confidence }) => {
                if (pattern.test(sentence.text)) {
                    // Get context (previous and next sentence)
                    const context = this.getContext(processed.sentences, idx, 1);
                    
                    insights.push({
                        text: sentence.text,
                        type,
                        confidence,
                        context,
                        timestamp: this.estimateTimestamp(idx, processed.sentences.length),
                        importance: this.calculateImportance(sentence, processed)
                    });
                }
            });
        });
        
        // Sort by importance and deduplicate
        return this.deduplicateInsights(insights)
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 10);
    }
    
    // Calculate importance of an insight
    calculateImportance(sentence, processed) {
        let importance = 0.5;
        
        // Boost if repeated concept
        const keywords = this.extractKeywords(sentence.text);
        keywords.forEach(keyword => {
            const frequency = processed.tokens.filter(t => t === keyword).length;
            importance += frequency * 0.02;
        });
        
        // Boost if emphatic language
        if (/really|very|extremely|most|critical|crucial/.test(sentence.text)) {
            importance += 0.2;
        }
        
        // Boost if actionable
        if (/do|make|create|build|start|stop/.test(sentence.text)) {
            importance += 0.15;
        }
        
        return Math.min(importance, 1);
    }
    
    // Extract speaking patterns
    extractPatterns(processed) {
        const patterns = [];
        
        // Sentence length analysis
        const avgLength = processed.sentences.reduce((sum, s) => sum + s.wordCount, 0) / processed.sentences.length;
        patterns.push({
            type: 'sentence_style',
            value: avgLength < 15 ? 'Concise and punchy' : avgLength > 25 ? 'Detailed and elaborate' : 'Balanced',
            metric: avgLength
        });
        
        // Storytelling detection
        const storyIndicators = processed.sentences.filter(s => 
            /(?:let me tell|story|once|I remember|example)/i.test(s.text)
        ).length;
        
        if (storyIndicators > 2) {
            patterns.push({
                type: 'communication_style',
                value: 'Uses stories and examples',
                examples: processed.sentences
                    .filter(s => /(?:let me tell|story|example)/i.test(s.text))
                    .slice(0, 2)
                    .map(s => s.text)
            });
        }
        
        // Question usage
        const questions = processed.sentences.filter(s => s.text.includes('?')).length;
        if (questions > 3) {
            patterns.push({
                type: 'engagement',
                value: 'Uses questions to engage',
                frequency: questions
            });
        }
        
        // Repetition for emphasis
        const repeatedPhrases = this.findRepeatedPhrases(processed);
        if (repeatedPhrases.length > 0) {
            patterns.push({
                type: 'emphasis',
                value: 'Repeats key phrases for emphasis',
                examples: repeatedPhrases.slice(0, 3)
            });
        }
        
        return patterns;
    }
    
    // Find repeated phrases
    findRepeatedPhrases(processed) {
        const phrases = new Map();
        
        processed.sentences.forEach(sentence => {
            // Extract 3-5 word phrases
            const words = sentence.text.split(/\s+/);
            for (let len = 3; len <= 5; len++) {
                for (let i = 0; i <= words.length - len; i++) {
                    const phrase = words.slice(i, i + len).join(' ').toLowerCase();
                    if (!phrase.match(/^(the|and|but|or|if|to|of|in|a)/)) {
                        phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
                    }
                }
            }
        });
        
        return Array.from(phrases.entries())
            .filter(([_, count]) => count > 2)
            .sort((a, b) => b[1] - a[1])
            .map(([phrase, count]) => ({ phrase, count }));
    }
    
    // Extract mental models
    extractMentalModels(processed) {
        const models = [];
        const modelPatterns = {
            'first_principles': {
                patterns: [/first principle/i, /fundamental/i, /basic truth/i, /ground up/i],
                description: 'Breaking down complex problems to fundamental truths'
            },
            'systems_thinking': {
                patterns: [/system/i, /interconnect/i, /holistic/i, /feedback loop/i],
                description: 'Understanding how parts relate to the whole'
            },
            'compound_effect': {
                patterns: [/compound/i, /accumulate/i, /over time/i, /exponential/i],
                description: 'Small actions accumulating to large results'
            },
            '80_20_principle': {
                patterns: [/80.20/i, /pareto/i, /most important/i, /focus on/i],
                description: 'Focus on the vital few over the trivial many'
            },
            'inversion': {
                patterns: [/invert/i, /opposite/i, /reverse/i, /avoid/i],
                description: 'Solving problems by considering what to avoid'
            },
            'opportunity_cost': {
                patterns: [/opportunity cost/i, /trade.off/i, /instead of/i, /alternative/i],
                description: 'Considering what you give up with each choice'
            },
            'leverage': {
                patterns: [/leverage/i, /multiply/i, /scale/i, /force multiplier/i],
                description: 'Using tools or systems to multiply output'
            }
        };
        
        Object.entries(modelPatterns).forEach(([model, data]) => {
            const matches = processed.sentences.filter(sentence => 
                data.patterns.some(pattern => pattern.test(sentence.text))
            );
            
            if (matches.length > 0) {
                models.push({
                    name: model.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    description: data.description,
                    examples: matches.slice(0, 2).map(m => m.text),
                    frequency: matches.length,
                    confidence: Math.min(matches.length * 0.3, 1)
                });
            }
        });
        
        return models.sort((a, b) => b.confidence - a.confidence);
    }
    
    // Extract references
    extractReferences(processed) {
        const references = {
            people: [],
            books: [],
            concepts: [],
            tools: [],
            companies: []
        };
        
        processed.sentences.forEach(sentence => {
            // Extract people (capitalized names)
            const peoplePattern = /(?:according to|as|said by|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;
            let match;
            while ((match = peoplePattern.exec(sentence.text)) !== null) {
                references.people.push({
                    name: match[1],
                    context: sentence.text,
                    confidence: 0.8
                });
            }
            
            // Extract book titles (in quotes or with "book" keyword)
            const bookPattern = /(?:book|read)\s+(?:called\s+)?["']([^"']+)["']|["']([^"']+)["']\s+(?:book|by)/gi;
            while ((match = bookPattern.exec(sentence.text)) !== null) {
                references.books.push({
                    title: match[1] || match[2],
                    context: sentence.text,
                    confidence: 0.9
                });
            }
            
            // Extract tools/technologies
            const toolKeywords = ['Python', 'JavaScript', 'React', 'Docker', 'AWS', 'GitHub'];
            toolKeywords.forEach(tool => {
                if (sentence.text.includes(tool)) {
                    references.tools.push({
                        name: tool,
                        context: sentence.text,
                        confidence: 0.95
                    });
                }
            });
        });
        
        // Deduplicate
        Object.keys(references).forEach(key => {
            references[key] = this.deduplicateReferences(references[key]);
        });
        
        return references;
    }
    
    // Extract memorable quotes
    extractQuotes(processed) {
        const quotes = [];
        
        processed.sentences.forEach((sentence, idx) => {
            const isQuotable = 
                sentence.wordCount > 10 && 
                sentence.wordCount < 30 &&
                (sentence.text.includes('"') || 
                 /(?:always|never|remember|key|secret|truth)/i.test(sentence.text));
            
            if (isQuotable) {
                quotes.push({
                    text: sentence.text.replace(/['"]/g, ''),
                    context: this.getContext(processed.sentences, idx, 1),
                    impact: this.calculateQuoteImpact(sentence, processed),
                    type: this.classifyQuote(sentence.text)
                });
            }
        });
        
        return quotes
            .sort((a, b) => b.impact - a.impact)
            .slice(0, 5);
    }
    
    // Calculate quote impact
    calculateQuoteImpact(sentence, processed) {
        let impact = 0.5;
        
        // Boost for universal truths
        if (/always|never|everyone|no one/i.test(sentence.text)) {
            impact += 0.2;
        }
        
        // Boost for actionable
        if (/you|your|do|don't|make|create/i.test(sentence.text)) {
            impact += 0.15;
        }
        
        // Boost for memorable phrasing
        if (sentence.text.includes(',') || sentence.text.includes(':')) {
            impact += 0.1;
        }
        
        return Math.min(impact, 1);
    }
    
    // Classify quote type
    classifyQuote(text) {
        if (/success|achieve|win/i.test(text)) return 'motivational';
        if (/learn|know|understand/i.test(text)) return 'educational';
        if (/life|happiness|meaning/i.test(text)) return 'philosophical';
        if (/do|don't|should|must/i.test(text)) return 'actionable';
        return 'general';
    }
    
    // Extract statistics and data
    extractStatistics(processed) {
        const stats = [];
        
        processed.sentences.forEach(sentence => {
            // Look for percentages
            const percentPattern = /(\d+(?:\.\d+)?)\s*%/g;
            let match;
            while ((match = percentPattern.exec(sentence.text)) !== null) {
                stats.push({
                    type: 'percentage',
                    value: match[1] + '%',
                    context: sentence.text
                });
            }
            
            // Look for quantities
            const quantityPattern = /(\d{1,3}(?:,\d{3})*|\d+)\s+(people|users|customers|companies|years|months|days|dollars)/gi;
            while ((match = quantityPattern.exec(sentence.text)) !== null) {
                stats.push({
                    type: 'quantity',
                    value: match[1],
                    unit: match[2],
                    context: sentence.text
                });
            }
        });
        
        return stats;
    }
    
    // Layer 2: Deep Analysis
    async performDeepAnalysis(processed, basicAnalysis) {
        return {
            conceptMap: this.buildConceptMap(processed, basicAnalysis),
            contradictions: this.findContradictions(processed),
            uniquePerspectives: this.findUniquePerspectives(processed, basicAnalysis),
            actionableInsights: this.extractActionableInsights(processed),
            questions: this.generateQuestions(basicAnalysis),
            knowledgeGaps: this.identifyKnowledgeGaps(processed, basicAnalysis),
            emotionalTone: this.analyzeEmotionalTone(processed),
            credibilityMarkers: this.assessCredibility(processed)
        };
    }
    
    // Build concept map
    buildConceptMap(processed, basicAnalysis) {
        const concepts = new Map();
        
        // Extract key concepts from themes and insights
        basicAnalysis.themes.forEach(theme => {
            concepts.set(theme.name.toLowerCase(), {
                type: 'theme',
                weight: theme.weight,
                connections: []
            });
        });
        
        // Find connections between concepts
        concepts.forEach((concept, name) => {
            concepts.forEach((otherConcept, otherName) => {
                if (name !== otherName) {
                    const connection = this.findConceptConnection(name, otherName, processed);
                    if (connection.strength > 0.3) {
                        concept.connections.push({
                            to: otherName,
                            strength: connection.strength,
                            type: connection.type
                        });
                    }
                }
            });
        });
        
        return Array.from(concepts.entries()).map(([name, data]) => ({
            name,
            ...data
        }));
    }
    
    // Find connection between concepts
    findConceptConnection(concept1, concept2, processed) {
        let coOccurrences = 0;
        let proximity = 0;
        
        processed.sentences.forEach((sentence, idx) => {
            const hasConcept1 = sentence.text.toLowerCase().includes(concept1);
            const hasConcept2 = sentence.text.toLowerCase().includes(concept2);
            
            if (hasConcept1 && hasConcept2) {
                coOccurrences++;
            } else if (hasConcept1) {
                // Check nearby sentences
                for (let i = 1; i <= 3; i++) {
                    if (processed.sentences[idx + i]?.text.toLowerCase().includes(concept2)) {
                        proximity += 1 / i;
                    }
                }
            }
        });
        
        const strength = (coOccurrences * 0.5 + proximity * 0.3) / processed.sentences.length;
        const type = coOccurrences > 0 ? 'direct' : proximity > 0 ? 'related' : 'none';
        
        return { strength, type };
    }
    
    // Find contradictions
    findContradictions(processed) {
        const contradictions = [];
        const oppositePatterns = [
            { pos: /always/i, neg: /never/i },
            { pos: /everyone/i, neg: /no one/i },
            { pos: /easy/i, neg: /hard|difficult/i },
            { pos: /success/i, neg: /failure/i },
            { pos: /good/i, neg: /bad/i }
        ];
        
        processed.sentences.forEach((sentence, idx) => {
            processed.sentences.forEach((otherSentence, otherIdx) => {
                if (idx !== otherIdx) {
                    oppositePatterns.forEach(({ pos, neg }) => {
                        if ((pos.test(sentence.text) && neg.test(otherSentence.text)) ||
                            (neg.test(sentence.text) && pos.test(otherSentence.text))) {
                            
                            const keywords1 = this.extractKeywords(sentence.text);
                            const keywords2 = this.extractKeywords(otherSentence.text);
                            const overlap = keywords1.filter(k => keywords2.includes(k)).length;
                            
                            if (overlap > 2) {
                                contradictions.push({
                                    statement1: sentence.text,
                                    statement2: otherSentence.text,
                                    type: 'opposite_claims',
                                    confidence: overlap / Math.max(keywords1.length, keywords2.length)
                                });
                            }
                        }
                    });
                }
            });
        });
        
        return this.deduplicateContradictions(contradictions);
    }
    
    // Find unique perspectives
    findUniquePerspectives(processed, basicAnalysis) {
        const perspectives = [];
        const contrarianPhrases = [
            /(?:most people think|everyone believes|common wisdom)/i,
            /(?:but actually|but the truth|but really)/i,
            /(?:counterintuitive|surprising|unexpected)/i,
            /(?:wrong about|misunderstand|miss the point)/i
        ];
        
        processed.sentences.forEach((sentence, idx) => {
            contrarianPhrases.forEach(pattern => {
                if (pattern.test(sentence.text)) {
                    const context = this.getContext(processed.sentences, idx, 2);
                    perspectives.push({
                        perspective: sentence.text,
                        context: context.map(s => s.text).join(' '),
                        type: 'contrarian',
                        confidence: 0.8
                    });
                }
            });
        });
        
        return perspectives;
    }
    
    // Extract actionable insights
    extractActionableInsights(processed) {
        const actionable = [];
        const actionPatterns = [
            { pattern: /(?:step \d|first|then|finally)/i, type: 'process' },
            { pattern: /(?:do|don't|make|create|build|write|start|stop)/i, type: 'action' },
            { pattern: /(?:tip|hack|trick|technique|method)/i, type: 'technique' },
            { pattern: /(?:exercise|practice|habit|routine)/i, type: 'habit' }
        ];
        
        processed.sentences.forEach((sentence, idx) => {
            actionPatterns.forEach(({ pattern, type }) => {
                if (pattern.test(sentence.text)) {
                    actionable.push({
                        action: sentence.text,
                        type,
                        context: this.getContext(processed.sentences, idx, 1),
                        difficulty: this.assessDifficulty(sentence.text),
                        timeframe: this.extractTimeframe(sentence.text)
                    });
                }
            });
        });
        
        return actionable
            .sort((a, b) => a.difficulty - b.difficulty)
            .slice(0, 10);
    }
    
    // Generate questions
    generateQuestions(basicAnalysis) {
        const questions = [];
        
        // Questions about themes
        basicAnalysis.themes.forEach(theme => {
            questions.push({
                question: `How can I apply ${theme.name.toLowerCase()} in my own context?`,
                type: 'application',
                relevance: theme.weight
            });
        });
        
        // Questions about insights
        basicAnalysis.insights.slice(0, 3).forEach(insight => {
            questions.push({
                question: `What would happen if the opposite of "${insight.text}" were true?`,
                type: 'critical_thinking',
                relevance: insight.importance
            });
        });
        
        // Questions about gaps
        questions.push({
            question: 'What prerequisites or foundational knowledge do I need?',
            type: 'learning_path',
            relevance: 0.8
        });
        
        return questions;
    }
    
    // Identify knowledge gaps
    identifyKnowledgeGaps(processed, basicAnalysis) {
        const gaps = [];
        
        // Look for assumed knowledge
        const assumptionPhrases = [
            /(?:as you know|obviously|of course|clearly)/i,
            /(?:assuming|given that|since)/i
        ];
        
        processed.sentences.forEach(sentence => {
            assumptionPhrases.forEach(pattern => {
                if (pattern.test(sentence.text)) {
                    gaps.push({
                        type: 'assumed_knowledge',
                        context: sentence.text,
                        severity: 'medium'
                    });
                }
            });
        });
        
        // Look for undefined terms
        const technicalTerms = this.findTechnicalTerms(processed);
        technicalTerms.forEach(term => {
            if (!this.isTermExplained(term, processed)) {
                gaps.push({
                    type: 'undefined_term',
                    term,
                    severity: 'low'
                });
            }
        });
        
        return gaps;
    }
    
    // Layer 3: Synthesis
    synthesizeKnowledge(basicAnalysis, deepAnalysis) {
        return {
            summary: this.generateSummary(basicAnalysis, deepAnalysis),
            keyTakeaways: this.identifyKeyTakeaways(basicAnalysis, deepAnalysis),
            learningPath: this.suggestLearningPath(basicAnalysis, deepAnalysis),
            applications: this.suggestApplications(basicAnalysis, deepAnalysis),
            relatedTopics: this.identifyRelatedTopics(basicAnalysis)
        };
    }
    
    // Generate summary
    generateSummary(basicAnalysis, deepAnalysis) {
        const topThemes = basicAnalysis.themes.slice(0, 3).map(t => t.name).join(', ');
        const topInsight = basicAnalysis.insights[0]?.text || 'No clear insight';
        const uniqueCount = deepAnalysis.uniquePerspectives.length;
        
        return {
            oneLiner: `Explores ${topThemes} with ${uniqueCount} unique perspectives`,
            mainPoint: topInsight,
            approach: this.determineApproach(basicAnalysis.patterns),
            credibility: deepAnalysis.credibilityMarkers
        };
    }
    
    // Identify key takeaways
    identifyKeyTakeaways(basicAnalysis, deepAnalysis) {
        const takeaways = [];
        
        // Top insights
        basicAnalysis.insights.slice(0, 3).forEach(insight => {
            takeaways.push({
                type: 'insight',
                content: insight.text,
                importance: insight.importance,
                actionable: deepAnalysis.actionableInsights.some(a => 
                    a.action.includes(insight.text.substring(0, 20))
                )
            });
        });
        
        // Top mental models
        basicAnalysis.mentalModels.slice(0, 2).forEach(model => {
            takeaways.push({
                type: 'framework',
                content: `${model.name}: ${model.description}`,
                importance: model.confidence,
                actionable: true
            });
        });
        
        return takeaways.sort((a, b) => b.importance - a.importance);
    }
    
    // Build final knowledge base
    buildKnowledgeBase(data) {
        const { videoInfo, basicAnalysis, deepAnalysis, synthesis } = data;
        
        return {
            metadata: {
                title: videoInfo.title || 'Unknown Video',
                channel: videoInfo.channel || 'Unknown Channel',
                duration: videoInfo.duration || 0,
                extractedAt: new Date().toISOString(),
                confidence: this.calculateOverallConfidence(basicAnalysis, deepAnalysis)
            },
            
            creatorProfile: {
                communicationStyle: this.profileCommunicationStyle(basicAnalysis.patterns),
                expertiseAreas: basicAnalysis.themes.map(t => t.name),
                uniquePerspectives: deepAnalysis.uniquePerspectives.map(p => p.perspective),
                credibilityMarkers: deepAnalysis.credibilityMarkers
            },
            
            knowledge: {
                themes: basicAnalysis.themes,
                insights: basicAnalysis.insights,
                mentalModels: basicAnalysis.mentalModels,
                actionableItems: deepAnalysis.actionableInsights,
                quotes: basicAnalysis.quotes,
                statistics: basicAnalysis.statistics
            },
            
            analysis: {
                conceptMap: deepAnalysis.conceptMap,
                contradictions: deepAnalysis.contradictions,
                questions: deepAnalysis.questions,
                knowledgeGaps: deepAnalysis.knowledgeGaps
            },
            
            synthesis: synthesis,
            
            references: basicAnalysis.references,
            
            exportFormats: {
                json: this.generateJSON(data),
                markdown: this.generateMarkdown(data),
                aiContext: this.generateAIContext(data)
            }
        };
    }
    
    // Helper methods
    getContext(sentences, index, range) {
        const start = Math.max(0, index - range);
        const end = Math.min(sentences.length, index + range + 1);
        return sentences.slice(start, end);
    }
    
    extractKeywords(text) {
        return text
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 4 && !this.isStopWord(word));
    }
    
    isStopWord(word) {
        const stopWords = ['about', 'after', 'again', 'against', 'because', 'before', 'below', 'between', 'could', 'during', 'however', 'should', 'through', 'under', 'where', 'which', 'while', 'would'];
        return stopWords.includes(word);
    }
    
    estimateTimestamp(sentenceIndex, totalSentences) {
        const percentage = sentenceIndex / totalSentences;
        const minutes = Math.floor(percentage * 30); // Assume 30 min video
        const seconds = Math.floor((percentage * 30 * 60) % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    deduplicateInsights(insights) {
        const seen = new Set();
        return insights.filter(insight => {
            const key = insight.text.substring(0, 50);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    deduplicateReferences(refs) {
        const seen = new Set();
        return refs.filter(ref => {
            const key = ref.name || ref.title;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    deduplicateContradictions(contradictions) {
        const seen = new Set();
        return contradictions.filter(c => {
            const key = [c.statement1, c.statement2].sort().join('|');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    findTechnicalTerms(processed) {
        const terms = [];
        const technicalPattern = /[A-Z][a-zA-Z]*[A-Z]|[a-z]+[A-Z]/g;
        
        processed.tokens.forEach(token => {
            if (technicalPattern.test(token) || token.length > 10) {
                terms.push(token);
            }
        });
        
        return [...new Set(terms)];
    }
    
    isTermExplained(term, processed) {
        return processed.sentences.some(s => 
            s.text.includes(term) && s.text.includes('is') && s.text.includes('that')
        );
    }
    
    assessDifficulty(text) {
        if (/easy|simple|quick|just/i.test(text)) return 1;
        if (/hard|difficult|complex|challenge/i.test(text)) return 3;
        return 2;
    }
    
    extractTimeframe(text) {
        if (/day|daily|everyday/i.test(text)) return 'daily';
        if (/week|weekly/i.test(text)) return 'weekly';
        if (/month|monthly/i.test(text)) return 'monthly';
        if (/year|yearly|annual/i.test(text)) return 'yearly';
        return 'ongoing';
    }
    
    analyzeEmotionalTone(processed) {
        const tones = {
            positive: 0,
            negative: 0,
            neutral: 0
        };
        
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'success'];
        const negativeWords = ['bad', 'terrible', 'hate', 'fail', 'wrong', 'difficult', 'problem'];
        
        processed.tokens.forEach(token => {
            if (positiveWords.includes(token)) tones.positive++;
            else if (negativeWords.includes(token)) tones.negative++;
            else tones.neutral++;
        });
        
        const total = tones.positive + tones.negative + tones.neutral;
        return {
            positive: tones.positive / total,
            negative: tones.negative / total,
            neutral: tones.neutral / total,
            dominant: Object.entries(tones).sort((a, b) => b[1] - a[1])[0][0]
        };
    }
    
    assessCredibility(processed) {
        const markers = {
            evidence: 0,
            experience: 0,
            citations: 0,
            hedging: 0
        };
        
        processed.sentences.forEach(sentence => {
            if (/study|research|data|evidence/i.test(sentence.text)) markers.evidence++;
            if (/I've|we've|my experience|I learned/i.test(sentence.text)) markers.experience++;
            if (/according to|cited|reference/i.test(sentence.text)) markers.citations++;
            if (/might|maybe|perhaps|possibly/i.test(sentence.text)) markers.hedging++;
        });
        
        return {
            score: (markers.evidence + markers.experience + markers.citations - markers.hedging) / processed.sentences.length,
            markers
        };
    }
    
    determineApproach(patterns) {
        const approaches = patterns.map(p => p.value);
        if (approaches.includes('Uses stories and examples')) return 'Story-driven';
        if (approaches.includes('Uses questions to engage')) return 'Socratic';
        if (approaches.includes('Structured, step-by-step approach')) return 'Systematic';
        return 'Conversational';
    }
    
    profileCommunicationStyle(patterns) {
        return {
            sentenceStyle: patterns.find(p => p.type === 'sentence_style')?.value || 'Unknown',
            engagement: patterns.find(p => p.type === 'engagement')?.value || 'Direct',
            emphasis: patterns.find(p => p.type === 'emphasis')?.value || 'Consistent'
        };
    }
    
    calculateOverallConfidence(basicAnalysis, deepAnalysis) {
        const factors = [
            basicAnalysis.themes.length > 0 ? 0.2 : 0,
            basicAnalysis.insights.length > 3 ? 0.2 : 0.1,
            basicAnalysis.mentalModels.length > 0 ? 0.2 : 0,
            deepAnalysis.conceptMap.length > 5 ? 0.2 : 0.1,
            deepAnalysis.credibilityMarkers.score
        ];
        
        return Math.min(factors.reduce((a, b) => a + b, 0), 1);
    }
    
    suggestLearningPath(basicAnalysis, deepAnalysis) {
        const path = [];
        
        // Prerequisites based on gaps
        deepAnalysis.knowledgeGaps.forEach(gap => {
            if (gap.type === 'undefined_term') {
                path.push({
                    step: `Learn about: ${gap.term}`,
                    priority: 'high',
                    resources: 'Search for tutorials or definitions'
                });
            }
        });
        
        // Build on mental models
        basicAnalysis.mentalModels.forEach(model => {
            path.push({
                step: `Master ${model.name}`,
                priority: 'medium',
                resources: 'Practice applying this in different contexts'
            });
        });
        
        return path;
    }
    
    suggestApplications(basicAnalysis, deepAnalysis) {
        return deepAnalysis.actionableInsights.map(action => ({
            what: action.action,
            how: `Apply this ${action.timeframe}`,
            difficulty: action.difficulty,
            impact: 'Implement and track results'
        }));
    }
    
    identifyRelatedTopics(basicAnalysis) {
        const topics = new Set();
        
        basicAnalysis.themes.forEach(theme => {
            // Suggest related topics based on theme
            const relatedMap = {
                'Learning And Growth': ['skill development', 'deliberate practice', 'growth mindset'],
                'Wealth And Business': ['investing', 'entrepreneurship', 'financial literacy'],
                'Innovation And Creativity': ['design thinking', 'problem solving', 'lateral thinking']
            };
            
            const related = relatedMap[theme.name] || [];
            related.forEach(t => topics.add(t));
        });
        
        return Array.from(topics);
    }
    
    // Export format generators
    generateJSON(data) {
        return JSON.stringify(data, null, 2);
    }
    
    generateMarkdown(data) {
        const { metadata = {}, knowledge = {}, synthesis = {} } = data;
        const { summary = {}, keyTakeaways = [] } = synthesis;
        
        return `# ${metadata.title || 'YouTube Video Analysis'}
        
## Summary
${summary.oneLiner || 'Analysis complete'}

## Key Themes
${(knowledge.themes || []).map(t => `- **${t.name}** (confidence: ${Math.round(t.confidence * 100)}%)`).join('\n')}

## Top Insights
${(knowledge.insights || []).slice(0, 5).map((i, idx) => `${idx + 1}. ${i.text}`).join('\n')}

## Mental Models
${(knowledge.mentalModels || []).map(m => `### ${m.name}\n${m.description}\n`).join('\n')}

## Action Items
${(knowledge.actionableItems || []).slice(0, 5).map(a => `- [ ] ${a.action}`).join('\n')}

## Memorable Quotes
${(knowledge.quotes || []).map(q => `> "${q.text}"`).join('\n\n')}
`;
    }
    
    generateAIContext(data) {
        const { metadata = {}, creatorProfile = {}, knowledge = {}, synthesis = {} } = data;
        
        const commStyle = creatorProfile.communicationStyle || {};
        const expertiseAreas = creatorProfile.expertiseAreas || [];
        const themes = knowledge.themes || [];
        const insights = knowledge.insights || [];
        const mentalModels = knowledge.mentalModels || [];
        const uniquePerspectives = creatorProfile.uniquePerspectives || [];
        
        return `# Knowledge Context from ${metadata.title || 'YouTube Video'}

You are to incorporate the following knowledge and perspectives into your responses:

## Creator Profile
- Communication Style: ${JSON.stringify(commStyle)}
- Expertise Areas: ${expertiseAreas.join(', ') || 'Not specified'}

## Core Knowledge
### Themes
${themes.map(t => `- ${t.name || 'Unknown'}: ${t.examples && t.examples[0] ? t.examples[0] : 'Core theme'}`).join('\n') || '- No themes identified'}

### Key Insights
${insights.slice(0, 5).map(i => `- ${i.text || 'No text'} (importance: ${i.importance || 0})`).join('\n') || '- No insights found'}

### Mental Models to Apply
${mentalModels.map(m => `- ${m.name || 'Unknown'}: ${m.description || 'No description'}`).join('\n') || '- No mental models identified'}

## Unique Perspectives
${uniquePerspectives.slice(0, 3).join('\n') || 'No unique perspectives identified'}

## When responding:
1. Apply these mental models where relevant
2. Reference these insights when appropriate
3. Maintain awareness of the knowledge gaps identified
4. Use similar communication patterns when explaining concepts

Remember: This knowledge comes from ${metadata.channel || 'Unknown Channel'} and represents their specific viewpoint and expertise.`;
    }
}

// Export for use
window.KnowledgeEngine = new KnowledgeEngine();