# Nous.AI Backend API

Secure backend API for Nous.AI that handles AI service calls and protects API keys.

## Features

- 🔐 **Secure API Key Management** - API keys stored securely on the server
- 🛡️ **JWT Authentication** - Supabase JWT token verification
- ⚡ **Rate Limiting** - Prevent API abuse with per-user limits
- 🎨 **AI Services** - Claude & Gemini integration for visualizations
- 📄 **PDF Processing** - Extract text from PDFs using Gemini
- 💬 **Voice Assistant** - Q&A functionality with context

## Setup

### Prerequisites

- Node.js 18+ installed
- Supabase project set up
- Anthropic API key
- Google Gemini API key

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

CORS_ORIGIN=http://localhost:5173
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server health status. No authentication required.

### AI Endpoints

All AI endpoints require authentication (Bearer token in Authorization header).

#### Generate SVG Visualization

```
POST /api/ai/generate-svg
Content-Type: application/json
Authorization: Bearer <token>

{
  "concept": {
    "title": "Neural Network",
    "description": "A neural network with input, hidden, and output layers"
  },
  "type": "neural-network",
  "model": "gemini"
}
```

#### Extract Concepts

```
POST /api/ai/extract-concepts
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Your text here..."
}
```

#### Extract Concepts with Ranges

```
POST /api/ai/extract-concepts-with-ranges
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Your text here..."
}
```

Returns concepts with their position information (startOffset, endOffset) in the original text.

#### Format Text

```
POST /api/ai/format-text
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Your text here...",
  "concepts": [...]
}
```

#### Extract PDF Text

```
POST /api/ai/extract-pdf-text
Content-Type: application/json
Authorization: Bearer <token>

{
  "pdfData": "base64_encoded_pdf"
}
```

#### Answer Question

```
POST /api/ai/answer-question
Content-Type: application/json
Authorization: Bearer <token>

{
  "question": "What is this about?",
  "context": "Context text...",
  "conversationHistory": []
}
```

## Deployment on Render

1. Push your code to GitHub

2. Go to [Render Dashboard](https://dashboard.render.com)

3. Click "New +" and select "Blueprint"

4. Connect your repository and select `render.yaml`

5. Set environment variables in the Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `ANTHROPIC_API_KEY`
   - `GEMINI_API_KEY`
   - `CORS_ORIGIN` (your Netlify frontend URL)

6. Deploy!

## Security

- API keys are never exposed to the frontend
- All endpoints require valid JWT tokens
- Rate limiting prevents abuse
- CORS configured for specific origins only
- Helmet.js for security headers

## Rate Limits

- **AI Endpoints**: 10 requests per minute per user
- **General Endpoints**: 100 requests per minute per IP

## Error Handling

All errors return consistent JSON format:
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

## License

MIT

