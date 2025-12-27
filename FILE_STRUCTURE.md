# 📁 FILE STRUCTURE - WHAT GOES WHERE

## YOUR FOLDER STRUCTURE

```
C:\Users\james\Downloads\FirstContactEIS\
│
├── 📄 START_HERE_JAMES.md ← ⭐ READ THIS FIRST!
├── 📄 READY_TO_DEMO.md
├── 📄 DEMO_QUICKSTART.md
│
├── 🎯 CREATE_DESKTOP_SHORTCUT_CUSTOM.bat ← Double-click this!
├── 🚀 START_DEMO.bat ← This runs when you click desktop icon
│
├── 🎨 firstcontact.ico ← ⚠️ YOU CREATE THIS (your custom icon)
│
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 api/v1/ ← All API endpoints
│   │   ├── 📂 models/ ← Database models
│   │   ├── 📂 services/ ← AI services (case plans, chatbot, etc.)
│   │   └── main.py ← FastAPI app
│   │
│   ├── seed_complete_demo.py ← Creates 52 demo clients
│   ├── requirements.txt ← Python dependencies
│   └── .env ← Backend config (optional)
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 app/ ← Next.js pages
│   │   │   ├── 📂 dashboard/
│   │   │   │   ├── 📂 caseworker/ ← Caseworker views
│   │   │   │   └── 📂 city/ ← Layer 8 city views
│   │   │   └── page.tsx ← Home page
│   │   │
│   │   ├── 📂 components/ ← React components
│   │   │   ├── 📂 caseworker/
│   │   │   │   ├── AICasePlanGenerator.tsx
│   │   │   │   └── BenefitEnrollmentWizard.tsx
│   │   │   └── 📂 city/
│   │   │       └── AIStrategicAdvisor.tsx
│   │   │
│   │   └── 📂 lib/
│   │       └── api-client.ts ← Centralized API calls
│   │
│   ├── package.json ← Node.js dependencies
│   └── .env.local ← Frontend config
│
└── 📂 .claude/ ← Documentation
    ├── SECURITY_AUDIT_REPORT.md
    ├── CODE_IMPROVEMENT_ASSESSMENT.md
    └── CLAUDE.md ← Project rules
```

---

## 🎨 THE ICON FILE (MOST IMPORTANT!)

### What You Need to Do:

1. **Get your Einharjer image**
   - That gorgeous gold/black design you showed me

2. **Convert to .ico format:**
   - Go to: https://convertio.co/png-ico/
   - Upload image
   - Download as `.ico`

3. **Save as:**
   ```
   C:\Users\james\Downloads\FirstContactEIS\firstcontact.ico
   ```
   ⚠️ **EXACT location!** Must be in the main FirstContactEIS folder!

4. **File should be:**
   - Named: `firstcontact.ico` (lowercase, no spaces)
   - Size: Ideally 256×256 pixels
   - Format: `.ico` (Windows icon format)

---

## 🚀 THE DESKTOP SHORTCUT

### After You Create It:

**Location:** Your Desktop
**Name:** "First Contact E.I.S."
**Icon:** Your custom Einharjer design
**What it does:** Runs `START_DEMO.bat`

### What START_DEMO.bat Does:

1. **First time only:**
   - Checks if setup is needed
   - Installs Python packages → `backend/requirements.txt`
   - Installs Node packages → `frontend/package.json`
   - Seeds demo data → `backend/seed_complete_demo.py`
   - Creates `.demo_initialized` marker file

2. **Every time:**
   - Opens 2 command windows:
     - Window 1: Backend API (Port 8000)
     - Window 2: Frontend Dashboard (Port 3000)
   - Waits 8 seconds
   - Opens browser → `http://localhost:3000`

---

## 📋 WHAT EACH FILE DOES

### Batch Files (Double-Click These):

**`CREATE_DESKTOP_SHORTCUT_CUSTOM.bat`**
- Creates the desktop icon
- Uses your `firstcontact.ico` if it exists
- Run this ONCE

**`START_DEMO.bat`**
- Launches everything
- You don't run this directly - the desktop icon runs it!

### Documentation Files (Read These):

**`START_HERE_JAMES.md`** ⭐
- Step-by-step guide just for you
- Exact instructions
- No confusion

**`READY_TO_DEMO.md`**
- Master documentation
- Everything you need to know

**`DEMO_QUICKSTART.md`**
- The perfect 5-minute demo script
- Talking points
- What to click when

**`DEVELOPMENT_COMPLETE_SUMMARY.md`**
- What we built today
- Technical details

### Backend Files:

**`backend/seed_complete_demo.py`**
- Creates 52 realistic clients
- 4 vendors (PATH, MHALA, LAMP, HOPICS)
- 5 users with different roles
- Run this to reset demo data

**`backend/app/main.py`**
- FastAPI application
- Registers all API endpoints
- Starts on port 8000

**`backend/app/services/ai_case_plan.py`**
- AI case plan generator
- Uses Claude 4.5

**`backend/app/services/ai_strategic_advisor.py`**
- AI chatbot for Layer 8
- RAG with database context

### Frontend Files:

**`frontend/src/app/page.tsx`**
- Home page
- Three portals: City, Caseworker, Public

**`frontend/src/components/caseworker/AICasePlanGenerator.tsx`**
- AI case plan UI
- Generate, approve, edit buttons

**`frontend/src/components/caseworker/BenefitEnrollmentWizard.tsx`**
- Benefit calculator UI
- Shows $2,347/month projection

**`frontend/src/components/city/AIStrategicAdvisor.tsx`**
- ChatGPT-style interface
- Layer 8 only

**`frontend/src/lib/api-client.ts`**
- Centralized API calls
- No more redundant fetch() calls!

---

## 🔑 CONFIGURATION FILES

### Backend `.env` (Optional):
```
C:\Users\james\Downloads\FirstContactEIS\backend\.env
```
**What it does:** Configuration for backend
**Required?** No - has defaults
**What to add:**
- `ANTHROPIC_API_KEY` - For AI features
- `DATABASE_URL` - For custom database

### Frontend `.env.local`:
```
C:\Users\james\Downloads\FirstContactEIS\frontend\.env.local
```
**What it does:** Configuration for frontend
**Required?** Already created!
**Contains:**
- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For maps

---

## 🎯 YOUR CHECKLIST

- [ ] Save Einharjer image as `firstcontact.ico` in main folder
- [ ] Double-click `CREATE_DESKTOP_SHORTCUT_CUSTOM.bat`
- [ ] See "First Contact E.I.S." icon on desktop with your custom image
- [ ] Double-click desktop icon
- [ ] Wait for browser to open
- [ ] Login with demo credentials
- [ ] Practice 5-minute demo
- [ ] Blow minds

---

## 🆘 IF YOU GET LOST

**"Where do I put the icon file?"**
→ `C:\Users\james\Downloads\FirstContactEIS\firstcontact.ico`

**"Which file do I double-click first?"**
→ `CREATE_DESKTOP_SHORTCUT_CUSTOM.bat` (creates the desktop icon)

**"Which file do I use to start the demo?"**
→ The desktop icon! Or `START_DEMO.bat` directly

**"Where's the demo script?"**
→ `DEMO_QUICKSTART.md`

**"Where's the step-by-step guide?"**
→ `START_HERE_JAMES.md`

---

**Everything is organized. Everything is ready. Just follow `START_HERE_JAMES.md`!** 🚀
