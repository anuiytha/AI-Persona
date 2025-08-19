const fs = require('fs');
const path = require('path');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { SupabaseVectorStore } = require('@langchain/community/vectorstores/supabase');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function splitDocument() {
    try {
        console.log('📚 Starting document processing...');

        // Load document
        const documentPath = path.join(__dirname, 'person1.txt');
        const content = fs.readFileSync(documentPath, 'utf-8');
        console.log(`📖 Document loaded: ${content.length} characters`);

        // Split into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await textSplitter.splitText(content);
        console.log(`✂️  Document split into ${docs.length} chunks`);

        // Load environment variables
        const sbApiKey = process.env.SUPABASE_API_KEY;
        const sbUrl = process.env.SUPABASE_PROJECT_URL;
        const openAIApiKey = process.env.OPENAI_API_KEY;


        if (!sbApiKey || !sbUrl || !openAIApiKey) {
            console.log('\n❌ Missing environment variables.');
            console.log('Please ensure the following are set in your .env file:');
            console.log('- VITE_SUPABASE_API_KEY');
            console.log('- VITE_SUPABASE_PROJECT_URL');
            console.log('- VITE_OPENAI_API_KEY');
            return;
        }

        // Initialize Supabase client
        const supabase = createClient(sbUrl, sbApiKey);
        console.log('🔗 Supabase client initialized');

        // Initialize OpenAI embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: openAIApiKey,
        });
        console.log('🧠 OpenAI embeddings initialized');

        // Optional: Add metadata to each chunk
        const metadata = docs.map((chunk, index) => ({
            chunkIndex: index,
            source: 'person1.txt',
            timestamp: new Date().toISOString(),
        }));

        // Upload to Supabase vector store
        console.log('🚀 Uploading chunks to Supabase...');
        await SupabaseVectorStore.fromTexts(
            docs,
            metadata,
            embeddings,
            {
                client: supabase,
                tableName: 'documents',
            }
        );

        console.log('✅ Upload complete! All chunks embedded and stored.');

    } catch (error) {
        console.error('❌ Error during upload:', error.message);
        process.exit(1);
    }
}

// Run the function
splitDocument();
