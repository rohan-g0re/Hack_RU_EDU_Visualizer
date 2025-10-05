<<<<<<< HEAD
# VizKidd Frontend

React + TypeScript + Vite frontend application for educational text visualization.

## Overview

This is the frontend application for VizKidd, an educational platform that transforms complex text into interactive AI-generated visualizations. The app uses React with TypeScript, styled with TailwindCSS, and built with Vite.

## Features

- 📄 **Multiple Input Methods**: Text, PDF upload, URL scraping
- 🤖 **AI-Powered Visualization**: Generate SVG diagrams with Claude or Gemini
- 🎯 **Concept Extraction**: Automatically identify and visualize key concepts
- 🎙️ **Voice Assistant**: Ask questions about your documents
- 🔐 **Secure Authentication**: Supabase Auth integration
- 💳 **Credit System**: Pay-as-you-go visualization credits

## Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_BACKEND_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   VITE_STRIPE_PRICE_SUBSCRIPTION=price_...
   VITE_STRIPE_PRICE_ONETIME=price_...
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Reusable UI components
│   │   ├── feedback/    # Error and status components
│   │   ├── layout/      # Layout components (Header, Footer, Sidebar)
│   │   └── payments/    # Payment and credit components
│   ├── contexts/        # React Context providers
│   ├── features/        # Feature-specific modules
│   │   ├── concept/     # Concept extraction and visualization
│   │   ├── document/    # Document processing
│   │   └── voice/       # Voice assistant
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party library configurations
│   ├── services/        # API and service integrations
│   │   ├── ai/          # AI service clients
│   │   ├── api/         # Backend API client
│   │   ├── pdf/         # PDF processing
│   │   └── voice/       # Speech recognition
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (public) | Yes |
| `VITE_BACKEND_API_URL` | Backend API URL | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Optional |
| `VITE_STRIPE_PRICE_SUBSCRIPTION` | Stripe subscription price ID | Optional |
| `VITE_STRIPE_PRICE_ONETIME` | Stripe one-time price ID | Optional |

## Key Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling
- **Supabase**: Authentication and database
- **PDF.js**: PDF processing
- **Web Speech API**: Voice recognition
- **Lucide React**: Icons

## Deployment

This frontend is designed to be deployed on Netlify. The configuration is in the root `netlify.toml` file.

See `/docs/DEPLOYMENT.md` for detailed deployment instructions.

## Development Tips

1. **Hot Module Replacement**: Changes are reflected instantly during development
2. **Type Safety**: TypeScript catches errors before runtime
3. **Context Providers**: State management via React Context API
4. **Feature Modules**: Organized by feature for better scalability

## Troubleshooting

### Port already in use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Environment variables not loading
Make sure your `.env` file is in the `frontend/` directory and variables start with `VITE_`

### Build errors
Clear the cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper type definitions
4. Test your changes locally before committing

## License

MIT

=======
>>>>>>> dc9f900 (stripe payments working)
