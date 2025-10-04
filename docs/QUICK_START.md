# Quick Start Guide - Secure Backend Setup

This guide will help you get the secure backend running locally in 5 minutes.

## ✅ What's New

Your API keys are now **secure**! They're no longer exposed in the frontend.

## Prerequisites

- Node.js 18+ installed
- Your API keys ready:
  - Supabase URL and keys
  - Anthropic API key
  - Google Gemini API key

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

Create `.env` file in the `backend/` directory:

```bash
# Copy the example
cp .env.example .env
```

Edit `backend/.env` and fill in your actual keys:

```env
PORT=5000
NODE_ENV=development

# Supabase (from dashboard)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
SUPABASE_JWT_SECRET=your-jwt-secret

# AI Keys
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...

# CORS (frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Where to Get These Values:

1. **Supabase Dashboard** → Project Settings → API
   - URL: Project URL
   - Service Key: service_role key (keep secret!)
   - JWT Secret: JWT Settings → JWT Secret

2. **Anthropic Console**: https://console.anthropic.com/settings/keys

3. **Google AI Studio**: https://aistudio.google.com/app/apikey

## Step 3: Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔒 CORS enabled for: http://localhost:5173
🏥 Health check: http://localhost:5000/api/health
```

## Step 4: Configure Frontend

In the **frontend directory**, create or update `.env`:

```bash
cd frontend
```

Create/edit `frontend/.env`:

```env
# Supabase (PUBLIC keys only!)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  (anon public key, NOT service key)

# Backend URL
VITE_BACKEND_API_URL=http://localhost:5000

# Stripe (optional for now)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_SUBSCRIPTION=price_...
VITE_STRIPE_PRICE_ONETIME=price_...
```

## Step 5: Start Frontend

In a **new terminal**, from the root directory:

```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

Frontend will start on `http://localhost:5173`

## Step 6: Test It!

1. Open `http://localhost:5173` in your browser

2. Sign up / Log in

3. Try generating a visualization:
   - Enter some text
   - Click "Visualize"
   - Watch the console for API calls

4. Check the Network tab in DevTools:
   - Should see requests to `localhost:5000/api/ai/...`
   - Should have `Authorization: Bearer ...` header
   - **Should NOT see** Anthropic or Gemini API keys anywhere!

## Verification Checklist

✅ Backend runs on port 5000  
✅ Frontend runs on port 5173  
✅ Health endpoint returns `{"status":"healthy"}`  
✅ Can sign up / log in  
✅ API calls include Authorization header  
✅ Visualizations generate successfully  
✅ No API keys visible in browser DevTools  

## Common Issues

### Backend won't start

**Problem**: `Missing required environment variable`

**Solution**: Make sure all variables in `backend/.env` are filled in

---

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**: Port 5000 is already in use. Either:
- Kill the process using port 5000
- Change `PORT=5001` in backend/.env

### Frontend can't connect

**Problem**: `Network Error` or `Failed to fetch`

**Solution**:
1. Verify backend is running (`http://localhost:5000/api/health`)
2. Check `VITE_BACKEND_API_URL` in frontend `.env`
3. Verify CORS_ORIGIN in backend `.env` matches frontend URL

### 401 Unauthorized

**Problem**: API returns 401 errors

**Solution**:
1. Make sure you're logged in
2. Verify `SUPABASE_JWT_SECRET` matches in backend and Supabase
3. Try logging out and back in

## Testing Authentication

Test that authentication is working:

```bash
# This should fail (no auth token)
curl http://localhost:5000/api/ai/generate-svg \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"concept":{"title":"Test","description":"Test"},"model":"gemini"}'

# Should return: {"error":"Unauthorized","message":"Missing or invalid authorization header"}
```

To test with a real token, copy it from the browser:
1. Open DevTools → Network tab
2. Make a request from the app
3. Copy the Authorization header value
4. Use it in curl:

```bash
curl http://localhost:5000/api/ai/generate-svg \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"concept":{"title":"Neural Network","description":"A multi-layer network"},"model":"gemini","type":"neural-network"}'
```

## Next Steps

Once everything works locally:

1. **Read** `DEPLOYMENT.md` for production deployment
2. **Set up** Supabase database tables (SQL in DEPLOYMENT.md)
3. **Deploy** backend to Render
4. **Deploy** frontend to Netlify

## Need Help?

- Backend issues: Check `backend/README.md`
- Deployment: See `DEPLOYMENT.md`
- Security overview: Read `SECURITY_MIGRATION_SUMMARY.md`

---

**You're all set!** Your API keys are now secure. 🔒

