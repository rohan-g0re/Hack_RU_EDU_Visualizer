# VizKidd - Educational Visualization Platform

Transform complex text into interactive AI-generated visualizations for enhanced learning.

## 🎯 Overview

VizKidd is an educational platform that leverages AI (Claude & Gemini) to convert complex technical text into easy-to-understand visual representations. The platform supports multiple input methods, real-time concept extraction, and voice-assisted learning.

## 🏗️ Repository Structure

This is a monorepo containing:

- **`frontend/`** - React + TypeScript + Vite frontend application (deployed to Netlify)
- **`backend/`** - Express.js + TypeScript backend API (deployed to Render)
- **`docs/`** - Documentation files (deployment guides, architecture docs)

## ✨ Features

- 📄 **Multi-Source Input**: Text, PDF upload, or URL scraping
- 🤖 **Dual AI Support**: Choose between Claude 3.7 Sonnet or Gemini 2.0 Flash
- 🎯 **Smart Concept Extraction**: Automatically identify key concepts
- 📊 **Interactive Visualizations**: Generate technical diagrams, flowcharts, and neural networks
- 🎙️ **Voice Assistant**: Ask questions about your documents
- 🔐 **Secure Authentication**: Supabase Auth with JWT
- 💳 **Credit System**: Pay-as-you-go pricing with Stripe

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account
- API keys for Claude and Gemini
- (Optional) Stripe account for payments

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

Backend runs on `http://localhost:5000`

### Full Setup Guide

For detailed setup instructions, see:
- **Quick Start**: [`docs/QUICK_START.md`](docs/QUICK_START.md)
- **Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- **Architecture Overview**: [`docs/ARCHITECTURE.md`](docs/architecture_documentation.md)

## 📁 Project Structure

```
Hack_RU_EDU_Visualizer/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── contexts/         # React Context providers
│   │   ├── features/         # Feature modules
│   │   ├── services/         # API clients
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── README.md
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── config/           # Environment config
│   │   ├── middleware/       # Auth, rate limiting
│   │   ├── routes/           # API routes
│   │   └── services/         # AI service integrations
│   ├── package.json
│   └── README.md
│
├── docs/                     # Documentation
│   ├── DEPLOYMENT.md
│   ├── QUICK_START.md
│   └── ARCHITECTURE.md
│
├── .gitignore
├── netlify.toml              # Frontend deployment config
└── render.yaml               # Backend deployment config
```

## 🔧 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Supabase (auth & database)
- PDF.js (PDF processing)
- Web Speech API (voice)

### Backend
- Express.js + TypeScript
- Anthropic Claude SDK
- Google Gemini SDK
- JWT authentication
- Rate limiting
- Helmet.js (security)

### Infrastructure
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe

## 🔐 Security

- ✅ API keys stored securely on backend
- ✅ JWT authentication on all AI endpoints
- ✅ Rate limiting (10 req/min per user)
- ✅ CORS protection
- ✅ Security headers with Helmet.js
- ✅ Row Level Security on database

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Netlify and Render
- **[Architecture Documentation](docs/architecture_documentation.md)** - Deep dive into the codebase
- **[Security Migration](docs/SECURITY_MIGRATION_SUMMARY.md)** - Security implementation details

## 🧪 Development

### Running Locally

Start both services:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Linting

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

## 🌐 Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set base directory to `frontend`
3. Configure environment variables
4. Deploy!

### Backend (Render)
1. Use Blueprint deployment with `render.yaml`
2. Configure environment variables
3. Deploy!

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed instructions.

## 💰 Pricing

- **Starter**: 10 free credits on signup
- **Pay-as-you-go**: $5 for 5 credits
- **Subscription**: $20/month for 100 credits

**Credit Usage:**
- Visualize: 1 credit
- Regenerate: 0.5 credit

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Claude 3.7 Sonnet** by Anthropic
- **Gemini 2.0 Flash** by Google
- **Supabase** for auth and database
- **React** and **TypeScript** communities

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review [troubleshooting guides](docs/QUICK_START.md#troubleshooting)

---

**Built with ❤️ for better education through visualization**