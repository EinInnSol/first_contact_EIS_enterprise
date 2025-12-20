# GCP ONLY INFRASTRUCTURE RULES

## THE RULE

**All infrastructure on Google Cloud Platform**

No AWS. No Azure. No self-hosted.

---

## REQUIRED SERVICES

### Database
✅ Cloud SQL PostgreSQL 15  
❌ AWS RDS  
❌ Azure Database  
❌ Self-hosted Postgres  
❌ Supabase  

### Backend Hosting
✅ Cloud Run  
❌ AWS Lambda  
❌ Azure Functions  
❌ Heroku  
❌ Render  

### AI
✅ Vertex AI Claude 4.5  
❌ Direct Anthropic API  
❌ AWS Bedrock  
❌ Azure OpenAI  

### Frontend Hosting
✅ Firebase Hosting  
❌ Vercel  
❌ Netlify  
❌ AWS S3  

### Storage
✅ Cloud Storage  
❌ AWS S3  
❌ Azure Blob  

---

## PROJECT CONFIG

- **Project ID:** einharjer-valhalla
- **Region:** us-east5 (for ALL services)
- **Zone:** us-east5-a

---

## WHY GCP ONLY?

1. Vertex AI Claude 4.5 availability
2. James has GCP credits
3. Single billing/platform
4. Consistent tooling
5. Easier to maintain

---

## VERIFICATION

```bash
# Check current project
gcloud config get project
# Should output: einharjer-valhalla

# Check region
gcloud config get compute/region  
# Should output: us-east5
```
