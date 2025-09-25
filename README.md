# AI Persona - RAG Chatbot Application
A Multi-persona conversational AI system that emulates distinct expert personalities through retrrieval-augumented generation (RAG) and context-aware response generation.

https://github.com/user-attachments/assets/d6cf3d88-e943-46f5-a7e4-23e8cb40a153

# Project Overview
Built for Believe India, this chatbot system switches between different AI personas, each with unique expertise and communication styles. The styles uses modern AI techniques to create personalized, enagaging user experiences.

# Technical Stack 

# Backend & AI:
 - **Node.js** - Server and API endpoints
 - **Express.js** - Web application framework
 - **LangChain** - RAG pipeline and AI orchestration
 - **OpenAI API** - GPT models for text generation
 - **Supabase** - Vector database for embeddings storage
 - **dotenv** - Environment variable management
 - **CORS** - Cross-origin resource sharing
 - **Helmet** - Security middleware
 - **Morgan** - HTTP request logger
 - **Rate Limiting** - API request throttling

# Frontend:
- **React.js** - Dynamic user interface
- **Modern UI components** - Responsive design
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and development server
- 

## System Architecture
  ------------      -------------------       -------------------    --------------     --------------
 | User Input | -> | Persona Detection | ->  | Context Retrival | -> | AI Response | -> | UI Display |
  -----------       -------------------       -------------------    --------------     --------------


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












