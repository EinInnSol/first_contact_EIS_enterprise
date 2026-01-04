# Deploy First Contact E.I.S. Demo to Vercel

## Quick Deploy (2 Minutes)

### Option 1: One-Click Deploy from Terminal

```bash
cd frontend
npx vercel
```

Follow the prompts:
1. **Set up and deploy?** → Yes
2. **Which scope?** → Your Vercel account
3. **Link to existing project?** → No
4. **Project name?** → `firstcontact-demo` (or whatever you want)
5. **Directory?** → `./` (current directory)
6. **Override settings?** → No

**That's it!** Vercel will:
- Build your Next.js app
- Deploy to production
- Give you a URL like `https://firstcontact-demo.vercel.app`

---

### Option 2: Deploy from Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** (if you have GitHub/GitLab)
   - OR -
4. **Upload folder** (drag & drop the `frontend` folder)

5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or leave blank)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

6. **Environment Variables** (Important!):
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDWOTWlj_14qc2iB2eFmmf4rUZJOHCzZps
   NEXT_PUBLIC_API_URL=https://firstcontact-api-4fmsifz77q-ul.a.run.app
   ```

7. Click **"Deploy"**

---

## Step-by-Step Terminal Deploy

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Navigate to Frontend Directory

```bash
cd c:\Users\james\Downloads\FirstContactEIS\frontend
```

### 4. Deploy

```bash
vercel --prod
```

**Output:**
```
Vercel CLI 33.0.0
? Set up and deploy "C:\Users\james\Downloads\FirstContactEIS\frontend"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? firstcontact-demo
? In which directory is your code located? ./
Auto-detected Project Settings (Next.js):
- Build Command: next build
- Development Command: next dev --port $PORT
- Install Command: `yarn install`, `pnpm install`, or `npm install`
- Output Directory: .next
? Want to modify these settings? [y/N] n

🔗  Linked to your-account/firstcontact-demo (created .vercel and added it to .gitignore)
🔍  Inspect: https://vercel.com/your-account/firstcontact-demo/...
✅  Production: https://firstcontact-demo.vercel.app [2m]
```

---

## Environment Variables Setup

### Add via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
# Paste: AIzaSyDWOTWlj_14qc2iB2eFmmf4rUZJOHCzZps

vercel env add NEXT_PUBLIC_API_URL
# Paste: https://firstcontact-api-4fmsifz77q-ul.a.run.app
```

### Add via Vercel Dashboard

1. Go to your project: `https://vercel.com/your-account/firstcontact-demo`
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add each variable:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `AIzaSyDWOTWlj_14qc2iB2eFmmf4rUZJOHCzZps`
   - `NEXT_PUBLIC_API_URL` = `https://firstcontact-api-4fmsifz77q-ul.a.run.app`
5. Click **"Save"**
6. **Redeploy** to apply changes

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings** → **Domains**
2. Add domain: `demo.firstcontacteis.com`
3. Follow DNS instructions:
   ```
   Type: CNAME
   Name: demo
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 minutes)

---

## Automatic Deployments (If Using Git)

### Connect to GitHub

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/firstcontact-demo.git
   git push -u origin main
   ```

2. In Vercel Dashboard:
   - Click **"Import Project"**
   - Select your GitHub repo
   - Click **"Import"**

3. **Every push to `main` = automatic deployment!**

---

## Vercel Configuration File (Optional)

Create `vercel.json` in `frontend/` directory:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "@google-maps-api-key",
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

---

## Troubleshooting

### Build Fails

**Error:** `Module not found: Can't resolve '@react-google-maps/api'`

**Fix:**
```bash
cd frontend
npm install @react-google-maps/api
git add package.json package-lock.json
git commit -m "Add Google Maps dependency"
git push
```

### Environment Variables Not Working

**Fix:**
1. Make sure variables start with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Check Vercel Dashboard → Settings → Environment Variables

### Google Maps Not Loading

**Fix:**
1. Verify API key is correct
2. Enable required APIs in Google Cloud Console:
   - Maps JavaScript API
   - Places API
3. Check API key restrictions (should allow your Vercel domain)

---

## Production Checklist

Before sharing your demo URL:

- [ ] Test all 13 demo steps
- [ ] Verify Google Maps loads
- [ ] Check mobile responsiveness
- [ ] Test light/dark theme toggle
- [ ] Verify all interactions work
- [ ] Check performance (Lighthouse score)
- [ ] Add custom domain (optional)
- [ ] Set up analytics (optional)

---

## Demo URL Structure

**Main Demo:** `https://firstcontact-demo.vercel.app/demo`

**Share this link with:**
- Investors
- City officials
- Potential customers
- Partners

---

## Cost

**Vercel Pricing:**
- **Hobby (Free):** Perfect for demo
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Custom domains

- **Pro ($20/month):** If you need more
  - 1 TB bandwidth/month
  - Analytics
  - Team collaboration

**For a demo, the free tier is perfect!**

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm firstcontact-demo

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull
```

---

## Next Steps After Deploy

1. **Test the demo:** Visit `https://your-app.vercel.app/demo`
2. **Share the URL:** Send to stakeholders
3. **Monitor analytics:** Check Vercel dashboard for traffic
4. **Iterate:** Make changes, push, auto-deploys!

---

**That's it! Your demo is live in 2 minutes.** 🚀

**Demo URL:** Will be provided after deployment
**Example:** `https://firstcontact-demo.vercel.app/demo`
