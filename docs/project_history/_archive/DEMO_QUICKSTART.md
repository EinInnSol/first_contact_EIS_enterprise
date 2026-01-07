# 🚀 FIRST CONTACT E.I.S. - DEMO QUICK START

## ONE-CLICK DEMO SETUP (Windows)

### Step 1: Create Desktop Shortcut
1. Double-click `CREATE_DESKTOP_SHORTCUT.bat`
2. A shortcut will appear on your desktop: **"First Contact Demo"**

### Step 2: Launch Demo
1. Double-click **"First Contact Demo"** on your desktop
2. Wait ~30 seconds for startup (first time takes longer)
3. Browser will automatically open to `http://localhost:3000`

### Step 3: Login & Demo

**🎯 THE 5-MINUTE DEMO SCRIPT**

---

## DEMO CREDENTIALS

### City Admin (Layer 8 - THE TROJAN HORSE)
```
Email: admin@longbeach.gov
Password: demo123
Organization: longbeach
```
**Use this to show:** Vendor performance comparison, AI Strategic Advisor, maps

### Caseworker (PATH - Best Performer)
```
Email: maria@path.org
Password: demo123
Organization: longbeach
```
**Use this to show:** AI case plan generator, benefit wizard, client management

### Caseworker (MHALA - Poor Performer)
```
Email: mike@mhala.org
Password: demo123
Organization: longbeach
```
**Use this to show:** Same tools, but vendor underperforms (24% vs 73% housing rate)

---

## THE PERFECT 5-MINUTE DEMO

### Minute 1: QR Intake (Public Portal)
1. Go to `http://localhost:3000`
2. Click **"Public Intake"**
3. Show mobile-friendly intake form
4. Explain: "Homeless person scans QR code at shelter → instantly assigned to vendor"

### Minute 2: AI Case Plan Generator (Caseworker View)
1. Login as `maria@path.org`
2. Click on client **"Robert Thompson"** (highest urgency)
3. Go to **"Case Plan"** tab
4. Click **"Generate AI Case Plan"**
5. **Wait 10-15 seconds** → Complete 90-day plan appears!
6. Show:
   - Estimated days to housing: **42 days**
   - Confidence score: **85%**
   - Phase-based milestones with specific actions
7. Click **"Approve & Assign"**
8. **SAY:** "This just saved the caseworker 2-4 hours of work. Manual → 60 seconds with AI."

### Minute 3: Benefit Enrollment Wizard
1. Same client, click **"Benefits"** tab
2. Show projected total income: **$2,347/month**
3. Show step-by-step sequence:
   - Step 1: SSI - $943/month (3-6 month timeline)
   - Step 2: CalFresh - $281/month (faster approval)
   - Step 3: General Relief - $221/month (but reduced by housing subsidy)
4. Explain: "AI calculates optimal application order because some benefits affect others"
5. Click **"Start Application"** on one
6. **SAY:** "AI maximizes client income while minimizing caseworker complexity"

### Minute 4: Layer 8 - Vendor Performance (THE BIG REVEAL)
1. Logout, login as `admin@longbeach.gov`
2. You're now at **Layer 8 City Dashboard** (vendors can't see this!)
3. Show vendor comparison table:
   ```
   PATH:   73% housing rate, 35 avg days
   HOPICS: 68% housing rate, 42 avg days
   LAMP:   54% housing rate, 51 avg days
   MHALA:  24% housing rate, 68 avg days  ← THE PROBLEM
   ```
4. Click **"Geographic Intelligence"** tab
5. Show map with color-coded vendor territories (PATH = green, MHALA = red)
6. **SAY:** "Cities see this data and realize MHALA costs 3.7x more per placement than PATH"

### Minute 5: AI Strategic Advisor (THE MIND-BLOWER)
1. Click **"AI Strategic Advisor"** tab
2. Type or click suggested question: **"Why is MHALA underperforming?"**
3. Watch AI generate detailed answer with:
   - 3 specific reasons (client acuity mismatch, geographic gaps, benefit delays)
   - Actionable recommendations (reallocate contracts, add offices, mandate SLAs)
   - Data citations (shows real numbers)
   - Confidence score
4. Try another: **"Which vendor should get the new $5M contract?"**
5. **SAY:** "This is ChatGPT for city administrators, but trained on their actual homeless services data"

### THE CLOSE:
**"Here's what just happened:**
- **Vendors** got free AI tools that make their jobs 10x easier (case plans, benefits, scheduling)
- **Cities** discovered which vendors are wasting money and which are efficient
- **Cities** now mandate all vendors use this system for accountability
- **You** charge cities $1,200/vendor/month × 400 CoCs = $115M+ ARR potential

**This is the Trojan Horse. Vendors adopt for efficiency. Cities mandate for accountability."**

---

## DEMO DATA OVERVIEW

The demo database includes:

- **1 Organization:** Long Beach Continuum of Care
- **4 Vendors:**
  - PATH (73% housing rate) - EXCELLENT
  - HOPICS (68% housing rate) - GOOD
  - LAMP (54% housing rate) - AVERAGE
  - MHALA (24% housing rate) - POOR ← The comparison point
- **52 Clients** across all vendors with realistic data
- **5 Users:** 1 city admin, 4 caseworkers
- **4 QR Locations** around Long Beach

---

## TROUBLESHOOTING

### Backend won't start:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend won't start:
```bash
cd frontend
npm install
npm run dev
```

### Database issues:
```bash
cd backend
python seed_complete_demo.py
```

### API not connecting:
- Check `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

---

## MANUAL STARTUP (If Batch File Doesn't Work)

### Terminal 1 (Backend):
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Browser:
```
http://localhost:3000
```

---

## STOPPING THE DEMO

1. Close browser tabs
2. In each terminal/command window, press `Ctrl+C`
3. Or just close the command windows

---

## DEMO TIPS

### Best Practices:
- **Always start with QR intake** to show the full flow
- **Use Robert Thompson client** for case plan demo (highest urgency)
- **Login as city admin LAST** for dramatic reveal of Layer 8
- **Ask the AI chatbot multiple questions** to show versatility
- **Show the map** to visualize geographic performance

### Common Questions & Answers:

**Q: "Can caseworkers see Layer 8?"**
A: No! That's the whole point. Vendors only see Layers 1-7 (their tools). Layer 8 is hidden from them. Only city admins see vendor comparison.

**Q: "How does AI generate the case plan so fast?"**
A: Uses Claude 4.5 with real client data (VI-SPDAT score, barriers, demographics) to create personalized plans in 10-15 seconds.

**Q: "What if AI is wrong?"**
A: Human-in-loop! Caseworker always reviews and approves. They can edit or regenerate if needed.

**Q: "How do you make money?"**
A: Cities pay $1,200/vendor/month for Layer 8 analytics. Vendors get Layers 1-7 free (but cities mandate usage).

**Q: "What if vendors find out about Layer 8?"**
A: They eventually will, but by then they're dependent on the efficiency tools and cities have already mandated usage.

---

## ADVANCED DEMO FEATURES

### Show Multi-Tenant Isolation:
1. Login as `maria@path.org` → See only PATH clients
2. Login as `mike@mhala.org` → See only MHALA clients
3. Login as `admin@longbeach.gov` → See ALL clients
4. **Point:** "Each organization's data is completely isolated. PATH can't see MHALA's data."

### Show AI Recommendations:
1. Login as caseworker
2. Check "Best Next Steps" sidebar
3. Show AI-generated recommendations with one-click approval
4. **Point:** "AI monitors all clients 24/7 and surfaces urgent actions"

### Show Benefits Interactions:
1. In benefit wizard, show how GR is reduced when housing subsidy is added
2. Explain: "General Relief drops from $221 to $121 because housing subsidy provides $575"
3. **Point:** "AI understands complex benefit rules that take caseworkers years to learn"

---

## PRODUCTION DEPLOYMENT (Future)

When ready to deploy to production:

1. **Backend:** Deploy to Cloud Run (GCP)
2. **Frontend:** Deploy to Firebase Hosting or Vercel
3. **Database:** Cloud SQL PostgreSQL
4. **AI:** Vertex AI Claude (not direct API)
5. **Domain:** firstcontact.app

See `DEPLOYMENT.md` for full instructions (coming soon).

---

## SUPPORT

**Issues?** Check:
1. `.claude/SECURITY_AUDIT_REPORT.md` - Known security issues
2. `.claude/CODE_IMPROVEMENT_ASSESSMENT.md` - Code quality notes
3. `DEVELOPMENT_COMPLETE_SUMMARY.md` - What was built today

**Questions?** Contact: james@firstcontact.app

---

## LICENSE

Proprietary - First Contact E.I.S.
Copyright © 2025 - All Rights Reserved

---

**Remember:** This changes 400+ cities. Let's make it happen. 🚀
