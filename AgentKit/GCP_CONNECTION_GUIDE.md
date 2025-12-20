# GCP CONNECTION GUIDE
## Connecting Antigravity to einharjer-valhalla

---

## PREREQUISITES

1. **Google Cloud SDK installed**
   - Download: https://cloud.google.com/sdk/docs/install
   - After install, run: `gcloud init`

2. **Cloud SQL Proxy**
   - Download: https://cloud.google.com/sql/docs/postgres/sql-proxy
   - Or use: `gcloud components install cloud-sql-proxy`

---

## STEP 1: AUTHENTICATE WITH GCP

Open terminal and run:

```bash
# Login to your Google account
gcloud auth login

# Set the project
gcloud config set project einharjer-valhalla

# Verify
gcloud config get project
# Should output: einharjer-valhalla

# Set up application default credentials (for code)
gcloud auth application-default login
```

---

## STEP 2: START CLOUD SQL PROXY

The proxy creates a secure connection to our PostgreSQL database.

**Windows (PowerShell):**
```powershell
# Download proxy if not installed
Invoke-WebRequest -Uri "https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.x64.exe" -OutFile "cloud-sql-proxy.exe"

# Run proxy (keep this terminal open)
.\cloud-sql-proxy.exe einharjer-valhalla:us-east5:first-contact-db
```

**macOS/Linux:**
```bash
# Download
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.linux.amd64
chmod +x cloud-sql-proxy

# Run proxy
./cloud-sql-proxy einharjer-valhalla:us-east5:first-contact-db
```

You should see:
```
Listening on 127.0.0.1:5432 for einharjer-valhalla:us-east5:first-contact-db
```

---

## STEP 3: TEST DATABASE CONNECTION

With proxy running, test the connection:

```bash
# Using psql
psql "host=127.0.0.1 port=5432 dbname=firstcontact user=firstcontact_app"
# Enter password when prompted

# Once connected, verify:
\dt  # List tables
SELECT * FROM organizations;  # Should show Long Beach
SELECT * FROM vendors;  # Should show 4 vendors
```

---

## STEP 4: CONFIGURE ANTIGRAVITY

### A. Install MCP Config

Copy `MCP_CONFIG.json` to Antigravity's config directory:

**Windows:**
```powershell
# Create directory if needed
mkdir "$env:USERPROFILE\.gemini\antigravity" -Force

# Copy config
copy "C:\Users\James\Projects\FirstContactEIS\AgentKit\MCP_CONFIG.json" "$env:USERPROFILE\.gemini\antigravity\mcp_config.json"
```

**macOS/Linux:**
```bash
mkdir -p ~/.gemini/antigravity
cp ~/Projects/FirstContactEIS/AgentKit/MCP_CONFIG.json ~/.gemini/antigravity/mcp_config.json
```

### B. Set Environment Variables

Create a `.env` file in the backend directory (or set system-wide):

```env
# Database
DATABASE_URL=postgresql+asyncpg://firstcontact_app:YOUR_PASSWORD@127.0.0.1:5432/firstcontact

# Auth
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# GCP
GCP_PROJECT_ID=einharjer-valhalla
GCP_REGION=us-east5
```

### C. Restart Antigravity

Close and reopen Antigravity to load the new MCP config.

---

## STEP 5: VERIFY CONNECTION IN ANTIGRAVITY

1. Open Antigravity
2. Open the Manager Surface (Mission Control)
3. Check MCP server status - should show "firebase" connected
4. Try a simple task: "List files in C:\Users\James\Projects\FirstContactEIS"

---

## STEP 6: POINT AGENT AT PROJECT

When starting a new task, include context:

```
@file:C:\Users\James\Projects\FirstContactEIS\AgentKit\AGENT_BRIEFING.md

Start with Task 1.1 from the TASK_QUEUE.md
```

Or in conversation:
```
Read the files in C:\Users\James\Projects\FirstContactEIS\AgentKit\ 
to understand the project, then start Task 1.1.
```

---

## TROUBLESHOOTING

### "Permission denied" on Cloud SQL
```bash
# Grant yourself Cloud SQL Client role
gcloud projects add-iam-policy-binding einharjer-valhalla \
    --member="user:YOUR_EMAIL" \
    --role="roles/cloudsql.client"
```

### Can't connect to database
1. Verify proxy is running (check terminal output)
2. Verify port 5432 isn't used by another process
3. Check credentials in .env file

### Antigravity doesn't see MCP servers
1. Verify mcp_config.json is in correct location
2. Restart Antigravity
3. Check Antigravity's MCP panel for errors

### "Project not found"
```bash
# List available projects
gcloud projects list

# Make sure einharjer-valhalla exists and you have access
gcloud projects describe einharjer-valhalla
```

---

## DATABASE CREDENTIALS

**⚠️ Do not commit these to git!**

- Instance: `first-contact-db`
- Database: `firstcontact`
- User: `firstcontact_app`
- Password: [Get from James or Secret Manager]

To get password from Secret Manager:
```bash
gcloud secrets versions access latest --secret=db-password
```

---

## QUICK START CHECKLIST

- [ ] `gcloud auth login` completed
- [ ] Project set to `einharjer-valhalla`
- [ ] Cloud SQL Proxy running
- [ ] Can connect to database with psql
- [ ] MCP config copied to Antigravity directory
- [ ] .env file created with credentials
- [ ] Antigravity restarted
- [ ] MCP servers showing connected
- [ ] Test task completed successfully

---

## NEXT STEPS

Once connected:
1. Open `TASK_QUEUE.md`
2. Start with Task 1.1: Project Scaffolding
3. Follow the agent briefing rules
4. Save summaries after each session
