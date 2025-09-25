# AI Persona - RAG Chatbot Application

## Overview
AI Persona is a sophisticated chatbot application that allows users to interact with an AI that responds as a specific person (Mallikarjuna Iytha) based on their knowledge base, interviews, articles, and professional documents. The system uses Retrieval-Augmented Generation (RAG) to provide contextually relevant and personalized responses.

## Architecture

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│   React Frontend │ ◄────────────► │  Node.js Backend │
│   (Port 3000)   │                │   (Port 5000)   │
└─────────────────┘                └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   OpenAI API    │
                                    │   (GPT Models)  │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  Supabase Vector│
                                    │     Store       │
                                    └─────────────────┘
```

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication
- **React Markdown** - Markdown rendering for responses
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with modern CSS features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **LangChain** - Framework for building LLM applications
- **OpenAI API** - GPT models for text generation
- **Supabase** - Vector database for document storage
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Rate Limiting** - API request throttling

### AI & ML
- **OpenAI GPT-3.5-turbo** - Primary language model
- **OpenAI Embeddings** - Text vectorization
- **RAG (Retrieval-Augmented Generation)** - Context-aware responses
- **Vector Similarity Search** - Document retrieval

### Database & Storage
- **Supabase Vector Store** - Vector database for embeddings
- **PostgreSQL** - Underlying database (via Supabase)

## Application Workflow

### 1. Document Processing
```
User Upload → Text Splitting → Embedding Generation → Vector Storage
     ↓              ↓              ↓              ↓
Document → Chunks (1000 chars) → OpenAI Embeddings → Supabase Vector DB
```

### 2. Chat Interaction Flow
```
User Message → Vector Search → Context Retrieval → AI Response Generation
     ↓              ↓              ↓              ↓
"Hello" → Find relevant docs → Combine context → Generate persona response
```

### 3. Response Generation Process
1. **Query Processing**: User message is received
2. **Document Search**: Vector similarity search finds relevant documents
3. **Context Building**: Retrieved documents are combined into context
4. **Persona Prompting**: AI is instructed to respond as the specific person
5. **Response Generation**: OpenAI generates contextual, persona-specific response
6. **Source Attribution**: Response includes source documents for transparency

## Key Features

### RAG Implementation
- **Semantic Search**: Uses vector embeddings for intelligent document retrieval
- **Context-Aware Responses**: AI responses are based on actual knowledge base content
- **Source Transparency**: Users can see which documents informed the response

### Persona System
- **Character Consistency**: AI maintains consistent personality and communication style
- **First-Person Responses**: Responds as if it IS the person, not about them
- **Experience-Based Answers**: Draws from the person's actual background and work

### Security & Performance
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **CORS Protection**: Secure cross-origin communication
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Graceful error management and user feedback

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_API_KEY=your_supabase_api_key
SUPABASE_PROJECT_URL=your_supabase_project_url
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_SUPABASE_API_KEY=your_supabase_api_key
VITE_SUPABASE_PROJECT_URL=your_supabase_project_url
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Getting Started

### Prerequisites
- Node.js 18+ (20+ recommended for Supabase compatibility)
- OpenAI API key
- Supabase project with vector store enabled

### Installation
1. Clone the repository
2. Install dependencies: `npm install` (both frontend and backend)
3. Configure environment variables
4. Start backend: `npm start` (from backend directory)
5. Start frontend: `npm start` (from frontend directory)

### Usage
1. Upload documents to build knowledge base
2. Start chatting with the AI persona
3. Ask questions related to the person's expertise
4. View source documents for transparency












