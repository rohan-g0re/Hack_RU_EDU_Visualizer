# Backend Setup Guide

## Quick Start - Fill in Your .env File

The `.env` file has been created with the correct structure. Now you need to fill in your actual API keys and configuration.

### Step 1: Open the .env file

```powershell
cd backend
notepad .env
```

### Step 2: Fill in Each Variable

#### 🔹 Server Configuration (Already Set)
```env
PORT=5000                    # ✅ Already set - no changes needed
NODE_ENV=development         # ✅ Already set - no changes needed
```

#### 🔹 Supabase Configuration

Go to: https://supabase.com/dashboard
1. Select your project
2. Go to **Project Settings** → **API**

```env
# Copy from "Project URL"
SUPABASE_URL=https://xxxxx.supabase.co

# Copy from "service_role" key (scroll down, click "reveal")
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc...

# Go to "JWT Settings" → Copy "JWT Secret"
SUPABASE_JWT_SECRET=your-super-secret-jwt-secret
```

#### 🔹 AI Service API Keys

**Anthropic Claude:**
1. Go to: https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copy the key (starts with `sk-ant-`)

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

**Google Gemini:**
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza`)

```env
GEMINI_API_KEY=AIzaSyxxxxx
```

#### 🔹 CORS Configuration (Already Set)
```env
CORS_ORIGIN=http://localhost:5173   # ✅ Already set for local development
```

### Step 3: Save and Test

After filling in all values:

1. **Save** the `.env` file
2. **Test** the backend:

```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔒 CORS enabled for: http://localhost:5173
🏥 Health check: http://localhost:5000/api/health
```

### Common Issues

**❌ "Missing required environment variable"**
- Check that ALL variables have values (no empty strings)
- Make sure there are no extra spaces around the `=` sign
- Each key should be on its own line

**❌ "Invalid token" or "Unauthorized"**
- Double-check `SUPABASE_JWT_SECRET` matches your Supabase project
- Make sure you're using `SUPABASE_SERVICE_KEY` not the anon key

**❌ "API key invalid"**
- Verify your Anthropic and Gemini keys are correct
- Make sure you copied the entire key (they can be long!)

### ⚠️ Security Notes

1. **NEVER commit `.env` to git** - It's already in `.gitignore`
2. **Keep `SUPABASE_SERVICE_KEY` secret** - It has full database access
3. **Don't share API keys** - They are tied to your account and billing

---

## Need Help?

See `ENV_TEMPLATE.md` for detailed instructions on where to find each value.

