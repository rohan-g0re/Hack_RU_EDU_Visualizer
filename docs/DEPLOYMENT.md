# Deployment Guide - VizKidd

Complete guide for deploying VizKidd with frontend on Netlify and backend on Render.

## Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│   Netlify (React)   │ ──────> │  Render (Express)    │
│   Frontend          │         │  Backend API         │
│   - Static Site     │         │  - JWT Auth          │
│   - Vite Build      │         │  - Rate Limiting     │
└─────────────────────┘         │  - AI Services       │
                                 └──────────────────────┘
                                           │
                                           ├──> Anthropic API
                                           ├──> Google Gemini
                                           └──> Supabase
```

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Netlify Account** - Sign up at https://netlify.com
3. **Render Account** - Sign up at https://render.com
4. **Supabase Project** - Set up at https://supabase.com
5. **API Keys**:
   - Anthropic API key (from https://console.anthropic.com)
   - Google Gemini API key (from https://aistudio.google.com)
   - Stripe keys (for payments, from https://stripe.com)

## Part 1: Backend Deployment on Render

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub with the following structure:
```
your-repo/
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── render.yaml
└── ...
```

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the repository containing your code
5. Render will detect the `render.yaml` file
6. Click **"Apply"**

### Step 3: Configure Environment Variables

Once deployed, go to your service in Render:

1. Click on your service name
2. Go to **"Environment"** tab
3. Add the following environment variables:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  (service_role key)
SUPABASE_JWT_SECRET=your-jwt-secret

# AI Service Keys
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...

# CORS (update after deploying frontend)
CORS_ORIGIN=https://your-app.netlify.app

# Node Environment
NODE_ENV=production
PORT=5000
```

#### Where to Find These Values:

- **SUPABASE_URL**: Supabase Dashboard → Project Settings → API → Project URL
- **SUPABASE_SERVICE_KEY**: Supabase Dashboard → Project Settings → API → service_role key (keep secret!)
- **SUPABASE_JWT_SECRET**: Supabase Dashboard → Project Settings → API → JWT Settings → JWT Secret
- **ANTHROPIC_API_KEY**: https://console.anthropic.com → Account → API Keys
- **GEMINI_API_KEY**: https://aistudio.google.com/app/apikey

### Step 4: Note Your Backend URL

After deployment completes, copy your backend URL:
- It will look like: `https://nous-ai-backend-xxxx.onrender.com`
- You'll need this for the frontend configuration

### Step 5: Test the Backend

Visit your backend health endpoint:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "production"
}
```

## Part 2: Frontend Deployment on Netlify

### Step 1: Build Configuration

Netlify will use the `netlify.toml` configuration automatically. Ensure it exists in your repository root.

### Step 2: Deploy to Netlify

#### Option A: Through Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Base directory**: `frontend`
5. Click **"Deploy site"**

#### Option B: Through Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Step 3: Configure Environment Variables

In Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

```env
# Supabase (Public keys only!)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  (anon/public key)

# Backend API
VITE_BACKEND_API_URL=https://your-backend.onrender.com

# Stripe (Publishable keys only!)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_SUBSCRIPTION=price_...
VITE_STRIPE_PRICE_ONETIME=price_...
```

#### Where to Find These Values:

- **VITE_SUPABASE_URL**: Same as backend
- **VITE_SUPABASE_ANON_KEY**: Supabase Dashboard → Project Settings → API → anon public key
- **VITE_BACKEND_API_URL**: Your Render backend URL from Part 1, Step 4
- **VITE_STRIPE_PUBLISHABLE_KEY**: Stripe Dashboard → Developers → API keys
- **VITE_STRIPE_PRICE_SUBSCRIPTION**: Stripe Dashboard → Products → Your subscription product → Pricing → Price ID
- **VITE_STRIPE_PRICE_ONETIME**: Stripe Dashboard → Products → Your one-time product → Pricing → Price ID

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 5: Update CORS on Backend

1. Go back to Render Dashboard
2. Update the `CORS_ORIGIN` environment variable with your Netlify URL:
   ```
   CORS_ORIGIN=https://your-app.netlify.app
   ```
3. For multiple origins (dev + prod), use comma-separated values:
   ```
   CORS_ORIGIN=https://your-app.netlify.app,https://your-staging.netlify.app
   ```
4. Render will automatically redeploy

## Part 3: Supabase Setup

### Required Tables

Your Supabase database needs these tables:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 10,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit history table
CREATE TABLE credit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL,
  stripe_payment_id TEXT,
  amount_paid_cents INTEGER,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC function to use credits atomically
CREATE OR REPLACE FUNCTION use_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Get current balance with row lock
  SELECT credits INTO v_current_balance
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;

  -- Check if sufficient credits
  IF v_new_balance < 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_balance', v_current_balance,
      'required', ABS(p_amount)
    );
  END IF;

  -- Update user balance
  UPDATE users
  SET credits = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Insert transaction record
  INSERT INTO credit_history (
    user_id,
    amount,
    balance_after,
    type,
    description,
    metadata
  )
  VALUES (
    p_user_id,
    p_amount,
    v_new_balance,
    p_type,
    p_description,
    p_metadata
  )
  RETURNING id INTO v_transaction_id;

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'old_balance', v_current_balance,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_credit_history_user_id ON credit_history(user_id);
CREATE INDEX idx_credit_history_created_at ON credit_history(created_at DESC);
```

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only view their own credit history
CREATE POLICY credit_history_select_own ON credit_history
  FOR SELECT USING (auth.uid() = user_id);
```

### Trigger for New Users

```sql
-- Automatically create user record on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    10  -- Starting credits
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Part 4: Testing the Deployment

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/api/health
```

### 2. Test Frontend Load

Visit your Netlify URL and verify:
- ✅ Page loads without errors
- ✅ Can sign up / log in
- ✅ Credit display shows up

### 3. Test Full Flow

1. Sign up for a new account
2. Upload a document or enter text
3. Generate visualizations
4. Verify concepts are extracted
5. Check voice assistant works

## Common Issues & Solutions

### Issue 1: CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
- Ensure `CORS_ORIGIN` in Render includes your exact Netlify URL
- No trailing slash in URLs
- Check browser console for exact error

### Issue 2: 401 Unauthorized

**Problem**: API requests fail with 401

**Solution**:
- Verify `SUPABASE_JWT_SECRET` matches in both Supabase and Render
- Check user is logged in (token exists)
- Token might be expired - try logging out and back in

### Issue 3: Environment Variables Not Working

**Problem**: App shows "missing environment variable" errors

**Solution**:
- In Netlify: Trigger a new deploy after adding variables
- In Render: Service auto-redeploys when env vars change
- Verify variable names match exactly (case-sensitive)

### Issue 4: Backend Slow on First Request

**Problem**: First API call takes 30+ seconds

**Solution**:
- Render free tier spins down after inactivity
- Upgrade to paid plan for always-on instances
- Or implement a keep-alive ping

## Monitoring & Maintenance

### Render Monitoring

- Dashboard shows request logs, errors, and metrics
- Set up email alerts for failures
- Monitor memory/CPU usage

### Netlify Monitoring

- Analytics show page views and performance
- Deploy logs show build success/failure
- Form submissions and function invocations tracked

### Supabase Monitoring

- Dashboard shows database size and connection count
- API logs track authentication events
- Set up alerts for quota limits

## Cost Estimates

### Free Tier (Development)

- **Netlify**: 100 GB bandwidth, 300 build minutes/month - FREE
- **Render**: 750 hours/month - FREE (but sleeps after inactivity)
- **Supabase**: 500 MB database, 2 GB bandwidth - FREE

### Production (Paid)

- **Netlify Pro**: $19/month - More bandwidth, no build limits
- **Render Starter**: $7/month - Always on, better performance
- **Supabase Pro**: $25/month - More database, better support

## Security Checklist

- ✅ All API keys stored securely on backend
- ✅ No secrets in frontend code or repository
- ✅ JWT authentication on all AI endpoints
- ✅ Rate limiting enabled
- ✅ CORS configured for specific origins only
- ✅ HTTPS enforced (automatic on Netlify/Render)
- ✅ Row Level Security enabled on Supabase
- ✅ Environment variables set correctly

## Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
   - Add custom domain in Netlify
   - Update CORS_ORIGIN in Render

2. **Configure monitoring**
   - Set up error tracking (e.g., Sentry)
   - Enable performance monitoring

3. **Set up CI/CD**
   - Auto-deploy on push to main branch
   - Run tests before deployment

4. **Add payment processing**
   - Complete Stripe integration
   - Test payment flow

## Support

If you encounter issues:

1. Check backend logs in Render Dashboard
2. Check frontend build logs in Netlify
3. Verify all environment variables are set correctly
4. Test API endpoints with Postman/curl
5. Check Supabase logs for database errors

---

**Deployment Complete! 🎉**

Your app should now be live and secure. The API keys are protected on the backend, and all communication is authenticated and rate-limited.

