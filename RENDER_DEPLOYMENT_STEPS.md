# 🚀 Render Deployment Step-by-Step

## Step 1: Connect GitHub Repository

### At Render Dashboard:
1. You should see "**Create a new Web Service**"
2. Click **"Connect to Git Repository"**
3. Select **GitHub** (if you haven't authorized, do that first)
4. Search for: `EmpowerHer1`
5. Click **"Connect"**

---

## Step 2: Configure Service

### Basic Settings:
- **Name:** `empowerher-backend` (or any name you like)
- **Environment:** `Node`
- **Region:** `Oregon (US West)` (closest to you)
- **Branch:** `main`

### Build & Deploy Settings:
- **Build Command:** `npm install`
- **Start Command:** `node backend/server.js`
- **Root Directory:** (leave blank)

### Plan:
- Select **Free** plan ✅ ($0/month)

---

## Step 3: Add Environment Variables

**IMPORTANT:** Before clicking "Deploy", add these variables!

Click on **"Advanced"** → **"Add Environment Variables"**

Add EACH variable individually:

| Variable Name | Value |
|---------------|-------|
| `MONGO_URI` | `mongodb+srv://NandyCodes:nandykwaeza@cluster0.ibwly3i.mongodb.net/EmpowerHer?appName=Cluster0` |
| `JWT_SECRET` | `babykwaeza` |
| `JOURNAL_SECRET` | `9c91420baa2b1d30d4e1f26144e935d3ecd98306b6de21dbd420ee183f09dac6` |
| `CLOUDINARY_CLOUD_NAME` | `dnuvwdypp` |
| `CLOUDINARY_API_KEY` | `237324875837228` |
| `CLOUDINARY_API_SECRET` | `j7rYMAekp8fVkI_1RmykVg5Yans` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FRONTEND_URL` | `http://localhost:3000` (update later after Vercel deploy) |

---

## Step 4: Deploy!

1. ✅ Check all settings are correct
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)
4. You'll see build logs in real-time

---

## Step 5: Get Your Backend URL

After successful deployment:
- You'll see: **"Your service is live at: https://empowerher-backend.onrender.com"**
- Copy this URL - you'll need it for frontend!

### Test Backend:
Visit: `https://empowerher-backend.onrender.com/api`
Should see: `"🚀 EmpowerHer API is running"`

---

## ✅ Checklist

- [ ] Connected GitHub repository
- [ ] Set service name to `empowerher-backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `node backend/server.js`
- [ ] Added all 9 environment variables
- [ ] Selected Free plan
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment to complete
- [ ] Tested backend URL works

---

## 🔑 Important Notes

### Free Tier Limitations:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30 seconds (cold start)
- For production, consider upgrading to paid plan

### How to Fix Cold Starts:
- Keep a cron job to ping the API every 14 minutes
- Or upgrade to paid plan ($12/month)

### Environment Variables Later:
If you need to update later:
1. Go to your service dashboard
2. Click **"Environment"**
3. Edit and save (triggers redeploy)

---

## What Happens Next?

1. ✅ Backend deploys on Render
2. ✅ Frontend deploys on Vercel (separate process)
3. ✅ Update CORS in Render when you have Vercel URL

---

**Your backend will be live in ~10 minutes!** ⏱️
