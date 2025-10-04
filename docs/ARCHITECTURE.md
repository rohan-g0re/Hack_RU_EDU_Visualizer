# VizKidd - Complete Architecture Documentation

## Executive Summary
VizKidd is a React-based text visualization application that transforms complex text into interactive visual representations using AI services. The application supports multiple input methods (text, PDF, URL), concept extraction, and dynamic SVG generation.

## Project Overview
- **Technology Stack**: React 18 + TypeScript + Vite + TailwindCSS
- **AI Services**: Claude (Anthropic) + Gemini (Google)
- **Backend**: Supabase Edge Functions (Deno)
- **Architecture Pattern**: Context-based state management with feature-based organization

## Entry Points & Application Flow

### 1. Application Entry Point
```
index.html → src/main.tsx → src/App.tsx
```

**Flow:**
1. `index.html` - HTML shell with meta tags and title "Nous.AI | Text Visualization"
2. `src/main.tsx` - React app initialization with StrictMode
3. `src/App.tsx` - Main application component with provider hierarchy

### 2. Provider Hierarchy
```typescript
AppProvider → ConceptProvider → VoiceProvider → AppContent
```

**Context Providers:**
- **AppProvider**: Global app state (tabs, loading, errors, modals, mobile menu)
- **ConceptProvider**: Concept extraction, visualization results, navigation
- **VoiceProvider**: Voice assistant state, conversation history, push-to-talk

## Core Architecture Components

### 1. Frontend Structure

#### Layout Components (`src/components/layout/`)
- **Header.tsx**: Navigation header with "Nous.AI" branding
- **Sidebar.tsx**: Left sidebar with "Nous.AI" logo and navigation
- **Footer.tsx**: Footer with "Nous.AI" copyright notice

#### Feature Components
- **LandingPage.tsx**: Marketing page with "Nous.AI" branding and feature descriptions
- **InputTab.tsx**: Text input interface with PDF upload and URL input
- **VisualizationTab.tsx**: Results display with concept navigation
- **VoiceAssistant.tsx**: Voice interaction interface

#### Common Components (`src/components/common/`)
- **Button.tsx**: Reusable button component
- **Modal.tsx**: Modal dialog system
- **Spinner.tsx**: Loading indicators
- **Tabs.tsx**: Tab navigation component
- **ExpandedVisualization.tsx**: Full-screen visualization view

### 2. State Management Architecture

#### AppContext (`src/contexts/AppContext.tsx`)
**Global Application State:**
- Tab management (input/visualization)
- Loading states and error handling
- Modal and confirmation dialogs
- Mobile menu state
- Text formatting and input text
- Expanded view state
- Landing page visibility

#### ConceptContext (`src/contexts/ConceptContext.tsx`)
**Concept Processing & Visualization:**
- Visualization results management
- Concept navigation (previous/next/jump)
- Concept extraction with text ranges
- Processing state tracking (pending/completed)
- Model selection (Claude vs Gemini)
- Visualization generation and regeneration

#### VoiceContext (`src/contexts/VoiceContext.tsx`)
**Voice Assistant Features:**
- Voice assistant open/close state
- Push-to-talk functionality (spacebar)
- Conversation history management
- Auto-clear on navigation

### 3. Service Layer Architecture

#### AI Services (`src/services/ai/`)

**Claude Service (`claude.ts`):**
- Anthropic Claude 3.7 Sonnet integration
- SVG visualization generation
- Concept extraction from text
- Technical diagram creation

**Gemini Service (`gemini.ts`):**
- Google Gemini 2.0 Flash integration
- SVG visualization generation
- Text formatting with concept highlighting
- PDF text extraction
- Q&A functionality for voice assistant

#### Document Processing (`src/services/pdf/`)
- **pdfProcessor.ts**: PDF.js integration for client-side PDF handling

#### Voice Services (`src/services/voice/`)
- **speechRecognition.ts**: Web Speech API integration
- **speechRecognitionUtils.ts**: Voice command processing

### 4. Feature Modules (`src/features/`)

#### Concept Feature (`src/features/concept/`)
- **ConceptExtractor.tsx**: AI-powered concept extraction
- **ConceptList.tsx**: Display extracted concepts
- **ConceptNavigator.tsx**: Navigation between concepts
- **ConceptVisualizer.tsx**: SVG visualization rendering

#### Document Feature (`src/features/document/`)
- **DocumentUploader.tsx**: File upload interface
- **PdfProcessor.tsx**: PDF processing component
- **TextFormatter.tsx**: Text formatting utilities
- **UrlInput.tsx**: URL input and processing

#### Voice Feature (`src/features/voice/`)
- **VoiceAssistant.tsx**: Main voice interface
- **VoiceAssistantButton.tsx**: Voice activation button
- **VoiceCommandHandler.tsx**: Command processing

### 5. Backend Architecture

#### Supabase Edge Functions (`supabase/functions/scrape/`)
**Web Scraping Service (`index.ts`):**
- Deno-based edge function
- CORS-enabled web scraping
- Cheerio for HTML parsing
- Content extraction from web pages

**API Endpoints:**
- `GET /functions/v1/scrape?url=<website_url>` - Scrape web content

### 6. Data Flow Architecture

#### Input Processing Flow
```
User Input → DocumentProcessor → AI Service → ConceptExtraction → Visualization
```

1. **Text Input**: Direct text entry
2. **PDF Upload**: PDF.js → Gemini extraction → Text processing
3. **URL Input**: Supabase scrape → Text processing
4. **Concept Extraction**: AI analysis → Concept identification with text ranges
5. **Visualization**: AI-generated SVG for each concept
6. **Display**: Interactive visualization with navigation

#### State Updates Flow
```
User Action → Context Hook → State Update → Component Re-render → UI Update
```

### 7. Type System (`src/types/`)

#### Core Type Definitions
- **app.types.ts**: Application-wide types, component props, voice interfaces
- **concept.types.ts**: Concept-related types, visualization results
- **document.types.ts**: Document processing types, PDF interfaces

### 8. Utility Layer (`src/utils/`)

#### Helper Functions
- **fileHandling.ts**: File processing utilities
- **svgHelpers.ts**: SVG manipulation helpers
- **textProcessing.ts**: Text analysis utilities
- **urlHandling.ts**: URL validation and processing

### 9. Custom Hooks (`src/hooks/`)

#### State Management Hooks
- **useConceptExtraction.ts**: Concept extraction logic
- **useDocumentProcessor.ts**: Document processing logic
- **useKeyboardShortcuts.ts**: Global keyboard shortcuts
- **useScrollTracking.ts**: Scroll-based navigation
- **useTextHighlighting.ts**: Text highlighting utilities

### 10. Configuration & Constants

#### Build Configuration
- **vite.config.ts**: Vite build configuration
- **tailwind.config.js**: TailwindCSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts

#### Application Constants (`src/constants/`)
- **config.ts**: Application configuration
- **keyboardShortcuts.ts**: Keyboard shortcut definitions
- **messages.ts**: Error and status messages

## API Integrations

### 1. Anthropic Claude API
- **Model**: claude-3-7-sonnet-20250219
- **Usage**: SVG generation, concept extraction
- **Authentication**: VITE_ANTHROPIC_API_KEY environment variable

### 2. Google Gemini API
- **Model**: gemini-2.0-flash
- **Usage**: SVG generation, text formatting, PDF processing, Q&A
- **Authentication**: VITE_GEMINI_API_KEY environment variable

### 3. Supabase Edge Functions
- **Runtime**: Deno
- **Usage**: Web scraping, CORS proxy
- **Authentication**: Supabase project configuration

### 4. Web Speech API
- **Usage**: Voice recognition for voice assistant
- **Browser Support**: Modern browsers with speech recognition

## Security Considerations

### 1. API Key Management
- Environment variables for API keys
- Client-side API calls (dangerouslyAllowBrowser for Claude)
- No server-side API key storage

### 2. CORS Configuration
- Supabase edge functions configured for cross-origin requests
- Proper CORS headers for web scraping endpoint

### 3. File Processing
- Client-side PDF processing using PDF.js
- No file uploads to external servers
- Direct AI service integration for file analysis

## Performance Optimizations

### 1. Concurrent Processing
- Parallel concept visualization generation
- Promise.all for concurrent AI requests
- Chunked text processing for large documents

### 2. State Management
- Context-based state with minimal re-renders
- Optimized state updates with proper dependencies
- Memory management for conversation history

### 3. Bundle Optimization
- Vite for fast development and optimized builds
- Tree-shaking for unused code elimination
- Dynamic imports for code splitting

## Development Workflow

### 1. Development Server
```bash
npm run dev  # Start Vite dev server
```

### 2. Build Process
```bash
npm run build  # Production build
npm run preview  # Preview production build
```

### 3. Code Quality
```bash
npm run lint  # ESLint code analysis
```

## Deployment Architecture

### 1. Frontend Deployment
- Static site deployment (Vercel, Netlify, etc.)
- Environment variables for API keys
- CDN distribution for assets

### 2. Backend Deployment
- Supabase edge functions for web scraping
- Deno runtime environment
- Automatic scaling and deployment

## Key Architectural Decisions

### 1. Context-Based State Management
- **Rationale**: Avoids prop drilling, provides clean separation of concerns
- **Implementation**: Three main contexts for different feature areas

### 2. Feature-Based Organization
- **Rationale**: Scalable structure, clear feature boundaries
- **Implementation**: Separate directories for concepts, documents, voice features

### 3. AI Service Abstraction
- **Rationale**: Support multiple AI providers, easy switching
- **Implementation**: Separate service files with consistent interfaces

### 4. Client-Side Processing
- **Rationale**: Privacy-focused, no server-side file storage
- **Implementation**: PDF.js for client-side PDF processing, direct AI API calls

## Scalability Considerations

### 1. State Management
- Context providers can be split further as features grow
- Consider Redux Toolkit for complex state interactions

### 2. API Integration
- Service layer abstraction allows easy addition of new AI providers
- Rate limiting and caching strategies for production use

### 3. Performance
- Implement virtualization for large concept lists
- Add caching layer for repeated AI requests
- Consider service worker for offline capabilities

## Maintenance & Monitoring

### 1. Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Console logging for debugging

### 2. Analytics Integration
- Ready for analytics service integration
- User interaction tracking points identified
- Performance monitoring hooks available

### 3. Testing Strategy
- Component testing with React Testing Library
- Integration testing for AI service calls
- End-to-end testing for user workflows

This architecture provides a solid foundation for a text visualization application with room for growth and feature expansion while maintaining clean separation of concerns and scalable patterns.
