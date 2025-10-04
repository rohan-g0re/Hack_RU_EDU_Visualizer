# Backend Environment Variables Template

Create a `.env` file in the `backend/` directory with these variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
# Get these from: Supabase Dashboard → Project Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-here

# AI Service API Keys
# Anthropic: https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
# Google Gemini: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyxxxxx

# AI Model Configuration
# Gemini model to use (optional, defaults to gemini-2.0-flash)
# Common models: gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro
GEMINI_MODEL=gemini-2.0-flash

# CORS Configuration
# Development: http://localhost:5173
# Production: https://your-app.netlify.app
CORS_ORIGIN=http://localhost:5173
```

## Where to Get These Values

### Supabase Variables
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** → **API**

- **SUPABASE_URL**: Project URL (e.g., `https://xxxxx.supabase.co`)
- **SUPABASE_SERVICE_KEY**: Look for `service_role` key (⚠️ Keep this secret!)
- **SUPABASE_JWT_SECRET**: Go to **JWT Settings** → Copy the JWT Secret

### API Keys
- **ANTHROPIC_API_KEY**: 
  - Go to https://console.anthropic.com/settings/keys
  - Create a new API key
  - Starts with `sk-ant-`

- **GEMINI_API_KEY**:
  - Go to https://aistudio.google.com/app/apikey
  - Create a new API key
  - Starts with `AIza`

- **GEMINI_MODEL** (optional):
  - Defaults to `gemini-2.0-flash` if not set
  - Check available models at https://ai.google.dev/gemini-api/docs/models
  - Common options: `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`

## Quick Setup

Run this in PowerShell from the project root:

```powershell
cd backend
New-Item -Path ".env" -ItemType File -Force
notepad .env
```

Then copy the template above into the `.env` file and fill in your actual values.

## ⚠️ Important Notes

1. **NEVER commit `.env` to git** - It contains secret keys
2. Use `SUPABASE_SERVICE_KEY` (NOT the anon key) for the backend
3. The `SUPABASE_ANON_KEY` is for the FRONTEND, not backend
4. Stripe keys go in the FRONTEND `.env`, not backend

