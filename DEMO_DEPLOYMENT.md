# Deploying First Contact E.I.S. Interactive Demo

This guide covers deploying the standalone demo to Cloud Run, Vercel, or Netlify.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project or create new
   - Use default settings
   - Deploy!

**Live in ~2 minutes!**

---

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```

3. **Or use Netlify Drop:**
   - Build: `npm run build`
   - Drag `.next` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

---

### Option 3: Google Cloud Run

1. **Build Docker image:**
   ```bash
   cd frontend
   docker build -t gcr.io/YOUR_PROJECT_ID/firstcontact-demo .
   ```

2. **Push to Container Registry:**
   ```bash
   docker push gcr.io/YOUR_PROJECT_ID/firstcontact-demo
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy firstcontact-demo \
     --image gcr.io/YOUR_PROJECT_ID/firstcontact-demo \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

---

## 📦 What Gets Deployed

- **Standalone Next.js app** - No backend required
- **All demo data built-in** - No database needed
- **7 interactive steps** - Fully functional demo wizard
- **Responsive design** - Works on mobile, tablet, desktop

---

## 🔧 Environment Variables

**None required!** The demo is completely self-contained.

Optional (for analytics):
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## 🌐 Custom Domain

### Vercel:
```bash
vercel domains add demo.firstcontacteis.com
```

### Netlify:
Settings → Domain management → Add custom domain

### Cloud Run:
```bash
gcloud run domain-mappings create \
  --service firstcontact-demo \
  --domain demo.firstcontacteis.com
```

---

## ✅ Verify Deployment

After deployment, test:
1. Navigate to `/demo`
2. Click through all 7 steps
3. Verify all buttons work
4. Test on mobile device

---

## 💡 Tips

- **Vercel**: Automatic deployments from Git
- **Netlify**: Great for static sites, instant rollbacks
- **Cloud Run**: Best for GCP ecosystem integration

**Recommended**: Start with Vercel for fastest deployment, migrate to Cloud Run later if needed.
