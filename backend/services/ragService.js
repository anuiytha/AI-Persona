// Import required modules for text processing, AI embeddings, and database operations
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');  // Splits large documents into smaller chunks
const { OpenAIEmbeddings } = require('@langchain/openai');                     // Generates vector embeddings using OpenAI
const { SupabaseVectorStore } = require('@langchain/community/vectorstores/supabase'); // Stores and searches vector embeddings
const { createClient } = require('@supabase/supabase-js');                     // Supabase client for database operations
const OpenAI = require('openai');                                              // OpenAI client for text generation

// Main RAG (Retrieval-Augmented Generation) service class
class RAGService {
    constructor() {
        // ===== INITIALIZE SUPABASE CLIENT =====
        // Create connection to Supabase database for storing document embeddings
        this.supabase = createClient(
            process.env.SUPABASE_PROJECT_URL,    // Supabase project URL from environment variables
            process.env.SUPABASE_API_KEY         // Supabase API key from environment variables
        );

        // ===== INITIALIZE OPENAI CLIENT =====
        // Create OpenAI client for generating text responses and embeddings
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY   // OpenAI API key from environment variables
        });

        // ===== INITIALIZE EMBEDDINGS MODEL =====
        // Create embeddings model for converting text to vectors
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY  // OpenAI API key for embeddings
        });

        // ===== INITIALIZE VECTOR STORE =====
        // Vector store will be initialized after constructor
        this.vectorStore = null;
        this.initializeVectorStore();

        // ===== PERSONA CONFIGURATION =====
        // Define the AI persona that the system will emulate
        this.persona = {
            name: "Mallikarjuna Iytha",                                    // Person's name
            role: "AI/ML Engineer and Technology Leader",                   // Person's professional role
            background: "Experienced professional in artificial intelligence, machine learning, and technology leadership", // Person's background
            style: "Professional, knowledgeable, and helpful with a focus on AI/ML and technology topics" // Communication style
        };
    }

    // ===== VECTOR STORE INITIALIZATION =====
    // Set up the vector database connection for storing and searching document embeddings
    async initializeVectorStore() {
        try {
            // Create vector store instance connected to Supabase
            this.vectorStore = new SupabaseVectorStore(this.embeddings, {
                client: this.supabase,           // Supabase client instance
                tableName: 'documents',          // Database table name for storing documents
                queryName: 'match_documents'     // Function name for similarity search
            });
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
        }
    }

    // ===== DOCUMENT UPLOAD AND PROCESSING =====
    // Upload a document, split it into chunks, and store in vector database
    async uploadDocument(content, metadata = {}) {
        try {
            // ===== DOCUMENT CHUNKING =====
            // Split large documents into smaller, manageable chunks for better processing
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,                 // Each chunk will be approximately 1000 characters
                chunkOverlap: 200,               // Overlap 200 characters between chunks to maintain context
            });

            // Create document chunks with metadata
            const docs = await textSplitter.createDocuments([content], [metadata]);

            // ===== STORE IN VECTOR DATABASE =====
            // Add the document chunks to the vector store if it's initialized
            if (this.vectorStore) {
                await this.vectorStore.addDocuments(docs);
            }

            // Return success response with chunk count and metadata
            return {
                success: true,                    // Operation successful
                message: 'Document uploaded successfully', // Success message
                chunks: docs.length,             // Number of chunks created
                metadata                         // Document metadata
            };
        } catch (error) {
            console.error('Upload document error:', error);
            throw new Error(`Failed to upload document: ${error.message}`);
        }
    }

    // ===== CHAT FUNCTIONALITY =====
    // Main chat function that processes user messages and generates AI responses
    async chat(message, sessionId = null) {
        try {
            // ===== DOCUMENT SEARCH =====
            // Search for documents relevant to the user's message
            const results = await this.searchDocuments(message, 5);

            // ===== CONTEXT BUILDING =====
            // Combine relevant document content into a single context string
            const context = results.map(doc => doc.pageContent).join('\n\n');

            // ===== AI RESPONSE GENERATION =====
            // Generate a response using OpenAI, pretending to be the specific person
            const response = await this.generatePersonaResponse(message, context);

            // Return the complete response with sources and session info
            return {
                response,                        // AI-generated response
                sources: results.map(doc => ({   // Source documents used for the response
                    content: doc.pageContent,    // Document content
                    metadata: doc.metadata      // Document metadata
                })),
                sessionId                       // Chat session identifier
            };
        } catch (error) {
            console.error('Chat error:', error);
            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    // ===== DOCUMENT SEARCH FUNCTION =====
    // Search for documents similar to the user's query using vector similarity
    async searchDocuments(query, limit = 5) {
        try {
            // Check if vector store is properly initialized
            if (!this.vectorStore) {
                throw new Error('Vector store not initialized');
            }

            // Perform similarity search to find relevant documents
            const results = await this.vectorStore.similaritySearch(query, limit);
            return results;
        } catch (error) {
            console.error('Search documents error:', error);

            // ===== ERROR HANDLING =====
            // Handle specific OpenAI quota errors with user-friendly messages
            if (error.message && error.message.includes('429')) {
                throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
            }

            if (error.message && error.message.includes('InsufficientQuotaError')) {
                throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
            }

            throw new Error(`Failed to search documents: ${error.message}`);
        }
    }

    // ===== PERSONA RESPONSE GENERATION =====
    // Generate AI responses that mimic the specific person's communication style
    async generatePersonaResponse(query, context) {
        try {
            // ===== PROMPT ENGINEERING =====
            // Create a detailed prompt that instructs the AI to act as the specific person
            const prompt = `You are ${this.persona.name}, ${this.persona.role}. You should respond as if you are this person, using your knowledge, experience, and personal style.

Your background: ${this.persona.background}
Your communication style: ${this.persona.style}

Use the following context from your documents, interviews, articles, and videos to answer the user's question. Respond as if you are speaking directly to them, drawing from your personal experience and knowledge:

Context:
${context}

Question: ${query}

Remember: You ARE ${this.persona.name}. Respond in first person, using phrases like "I believe", "In my experience", "Based on my work", etc. Be authentic to your persona while being helpful and informative.`;

            // ===== OPENAI API CALL =====
            // Send the prompt to OpenAI to generate a contextual response
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',         // Use GPT-3.5-turbo model for cost-effectiveness
                messages: [
                    {
                        role: 'system',          // System message to set the AI's role
                        content: `You are ${this.persona.name}, ${this.persona.role}. You are an AI assistant that responds as this specific person would, based on their documents, interviews, articles, and videos. Always respond in first person as if you are ${this.persona.name} speaking directly to the user.`
                    },
                    {
                        role: 'user',            // User message containing the actual prompt
                        content: prompt
                    }
                ],
                max_tokens: 600,                 // Limit response length to 600 tokens
                temperature: 0.7                 // Add some creativity (0.7) while maintaining consistency
            });

            // Return the generated response text
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Generate persona response error:', error);

            // ===== ERROR HANDLING =====
            // Handle OpenAI quota errors specifically
            if (error.message && error.message.includes('429')) {
                throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
            }

            if (error.message && error.message.includes('InsufficientQuotaError')) {
                throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
            }

            throw new Error(`Failed to generate response: ${error.message}`);
        }
    }

    // ===== DIRECT QUERY FUNCTION =====
    // Alternative way to query documents without chat context
    async directQuery(query) {
        try {
            // Search for relevant documents
            const results = await this.searchDocuments(query, 3);
            // Build context from search results
            const context = results.map(doc => doc.pageContent).join('\n\n');
            // Generate persona response
            const response = await this.generatePersonaResponse(query, context);

            // Return query results with sources
            return {
                query,                          // Original query
                response,                        // AI-generated response
                sources: results.map(doc => ({   // Source documents
                    content: doc.pageContent,    // Document content
                    metadata: doc.metadata      // Document metadata
                }))
            };
        } catch (error) {
            console.error('Direct query error:', error);
            throw new Error(`Failed to process direct query: ${error.message}`);
        }
    }

    // ===== SESSION MANAGEMENT =====
    // Get chat session information (placeholder for future implementation)
    async getSession(sessionId) {
        // This would typically interact with a database
        // For now, return a mock session
        return {
            id: sessionId,                      // Session identifier
            createdAt: new Date().toISOString(), // When session was created
            messageCount: 0                     // Number of messages in session
        };
    }

    // ===== STATISTICS AND MONITORING =====
    // Get system statistics including document count and vector store status
    async getStats() {
        try {
            // Query Supabase to count total documents
            const { count, error } = await this.supabase
                .from('documents')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            // Return comprehensive statistics
            return {
                totalDocuments: count || 0,     // Total number of documents in database
                vectorStoreStatus: this.vectorStore ? 'active' : 'inactive', // Vector store health
                timestamp: new Date().toISOString() // When stats were collected
            };
        } catch (error) {
            console.error('Get stats error:', error);
            // Return error information if stats collection fails
            return {
                totalDocuments: 0,              // Default to 0 documents
                vectorStoreStatus: 'error',     // Mark vector store as having errors
                error: error.message,           // Error details
                timestamp: new Date().toISOString() // When error occurred
            };
        }
    }

    // ===== HEALTH CHECK FUNCTION =====
    // Check if the RAG system is functioning properly
    async healthCheck() {
        try {
            // Get system statistics to assess health
            const stats = await this.getStats();
            return {
                status: 'healthy',               // System status
                vectorStore: stats.vectorStoreStatus, // Vector store health
                documents: stats.totalDocuments, // Document count
                timestamp: new Date().toISOString() // Health check timestamp
            };
        } catch (error) {
            // Return unhealthy status if health check fails
            return {
                status: 'unhealthy',             // System status
                error: error.message,            // Error details
                timestamp: new Date().toISOString() // When health check failed
            };
        }
    }
}

// Export a singleton instance of the RAG service
// This ensures only one instance exists throughout the application
module.exports = new RAGService();
