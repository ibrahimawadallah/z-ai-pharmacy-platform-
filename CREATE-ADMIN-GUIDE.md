# 🔑 Create Admin User - Quick Guide

## Problem
The admin account doesn't exist in the production database yet.

## Solution
A special API endpoint has been deployed to create the admin account.

---

## Steps to Create Admin

### Wait 2 Minutes for Deployment
The `create-admin` endpoint is deploying now. Wait until it's live.

### Then Call the API

**Option 1: Using Browser (Easiest)**
```
Visit this URL in your browser:
https://z-ai-pharmacy-platform.vercel.app/api/create-admin

Then paste this JSON in the request body (use browser dev tools or curl):
{"secret": "9oZLZAxSRb3pHWgNwCWmXkXtVcWRqq43MgMYwNvaXS4="}
```

**Option 2: Using PowerShell (Recommended)**
```powershell
Invoke-RestMethod -Uri 'https://z-ai-pharmacy-platform.vercel.app/api/create-admin' -Method POST -ContentType 'application/json' -Body '{"secret":"9oZLZAxSRb3pHWgNwCWmXkXtVcWRqq43MgMYwNvaXS4="}'
```

**Option 3: Using curl (Git Bash)**
```bash
curl -X POST https://z-ai-pharmacy-platform.vercel.app/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{"secret":"9oZLZAxSRb3pHWgNwCWmXkXtVcWRqq43MgMYwNvaXS4="}'
```

---

## Expected Response
```json
{
  "message": "Admin created successfully!",
  "admin": {
    "id": "clxxx...",
    "email": "admin@drugeye.com",
    "name": "System Administrator",
    "role": "admin",
    "isVerified": true
  },
  "credentials": {
    "email": "admin@drugeye.com",
    "password": "Admin123456!"
  }
}
```

---

## Then Login

1. Go to: https://z-ai-pharmacy-platform.vercel.app/auth/login
2. Enter:
   - **Email:** `admin@drugeye.com`
   - **Password:** `Admin123456!`
3. Click **Sign In**

---

## Security Note
After creating the admin, the endpoint can be deleted or kept protected with the API key.
