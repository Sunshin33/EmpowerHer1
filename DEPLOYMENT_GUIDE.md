# 🚀 EmpowerHer+ Deployment Guide

## Step-by-Step Hosting on Vercel + Render

### ✅ Prerequisites Checklist
- [x] Code pushed to GitHub (already done)
- [ ] Vercel account (free)
- [ ] Render account (free)
- [ ] MongoDB Atlas account
- [ ] Cloudinary account

---

## Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (easier!)
3. Authorize Render to access your GitHub

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Select your **EmpowerHer1** repository
3. Configure:
   - **Name:** `empowerher-backend` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
   - **Root Directory:** `.` (leave blank)

### Step 3: Set Environment Variables
In Render dashboard, go to **Environment**:

```
MONGO_URI=mongodb+srv://NandyCodes:nandykwaeza@cluster0.ibwly3i.mongodb.net/EmpowerHer?appName=Cluster0
JWT_SECRET=babykwaeza
JOURNAL_SECRET=9c91420baa2b1d30d4e1f26144e935d3ecd98306b6de21dbd420ee183f09dac6
CLOUDINARY_CLOUD_NAME=dnuvwdypp
CLOUDINARY_API_KEY=237324875837228
CLOUDINARY_API_SECRET=j7rYMAekp8fVkI_1RmykVg5Yans
NODE_ENV=production
FRONTEND_URL=https://empowerher.vercel.app
```

⚠️ **Update `FRONTEND_URL`** with your Vercel domain (you'll know it after deploying frontend)

### Step 4: Deploy
- Click **Create Web Service**
- Wait for build (5-10 minutes)
- Get your backend URL: `https://empowerher-backend.onrender.com`
- Test: Visit `https://empowerher-backend.onrender.com/api` (should see "🚀 EmpowerHer API is running")

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Create New Project
1. Click **New Project**
2. Select your **EmpowerHer1** repository
3. Configure:
   - **Framework:** `Create React App`
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

### Step 3: Set Environment Variables
Before deploying, add:
- **Name:** `REACT_APP_API_URL`
- **Value:** `https://empowerher-backend.onrender.com/api`

(Use the Render backend URL you got in Part 1)

### Step 4: Deploy
- Click **Deploy**
- Wait for build (2-5 minutes)
- Get your frontend URL: `https://empowerher-<random>.vercel.app`

---

## Part 3: Update CORS Settings

### Update Backend for Vercel Domain

1. Go to your Render dashboard
2. **Environment** → Edit `FRONTEND_URL`
3. Change to: `https://empowerher-xyz.vercel.app` (your actual Vercel URL)
4. Click **Save** (backend will redeploy)

---

## 🔗 Final URLs

After deployment, you'll have:

| Service | URL |
|---------|-----|
| Frontend | `https://empowerher-xyz.vercel.app` |
| Backend | `https://empowerher-backend.onrender.com` |
| API | `https://empowerher-backend.onrender.com/api` |

---

## ✨ Testing Deployment

### Test Frontend
1. Visit your Vercel URL
2. Click Login/Signup
3. Should see auth modal

### Test Backend
```bash
curl https://empowerher-backend.onrender.com/api
# Should return: "🚀 EmpowerHer API is running"
```

### Test API Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Sign up on your live site
4. Check API calls to backend

---

## 🐛 Troubleshooting

### ❌ CORS Error
**Problem:** "Access to XMLHttpRequest blocked by CORS"
**Solution:**
- Check `FRONTEND_URL` in Render environment variables
- Verify it matches your Vercel domain exactly
- Wait 5 minutes after updating for changes to take effect

### ❌ 404 on Frontend Routes
**Problem:** Routes like `/community` show 404
**Solution:**
- Already configured in `vercel.json`
- Redeploy on Vercel if still broken

### ❌ Backend Not Found
**Problem:** API calls return 503 or connection timeout
**Solution:**
- Render might be "spinning down" free tier
- Visit backend URL directly to wake it up
- Consider upgrading to paid tier for production

### ❌ Build Fails on Vercel
**Problem:** "Build failed"
**Solution:**
- Check Environment is set correctly
- Verify `root directory` is `Frontend`
- Check Build Logs for specific errors

---

## 📱 Mobile Testing

After deployment, test on mobile:
1. Open your Vercel URL on phone
2. Try creating a post
3. Upload an image
4. Post should appear in community

---

## 🔐 Security Tips

### Do NOT commit .env
✅ Already in `.gitignore`

### Use environment variables
- Never hardcode secrets
- Use Render/Vercel dashboards to set them

### Enable HTTPS
- Both Vercel and Render provide free HTTPS

### Rate Limiting
- Backend has rate limiting enabled
- Frontend requests from Vercel should be fine

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Vercel (Frontend) | **Free** ($0) |
| Render (Backend) | **Free** ($0/month) |
| MongoDB Atlas | **Free** (512MB) |
| Cloudinary | **Free** (25 credits/month) |
| **Total** | **FREE!** 🎉 |

---

## 🚀 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS settings
4. ✅ Test everything
5. 📊 Monitor logs in Render/Vercel dashboards
6. 🎯 Share your live app!

---

## 📞 Support Links

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB: https://docs.mongodb.com/atlas
- Cloudinary: https://cloudinary.com/documentation

---

**Your EmpowerHer+ app is now live! 🎉**
