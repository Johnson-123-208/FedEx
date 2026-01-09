# 🚀 Complete Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)

---

## 📦 Backend Deployment (Render.com)

### Step 1: Prepare Your Repository
Your repository is already prepared with:
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Process configuration
- ✅ `render.yaml` - Render configuration
- ✅ `build.sh` - Chrome/ChromeDriver installation script

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign in with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect Repository**:
   - Select `Johnson-123-208/FedEx`
   - Click "Connect"

4. **Configure Service**:
   ```
   Name: fedex-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: FEDEX
   Runtime: Python 3
   Build Command: chmod +x build.sh && ./build.sh && pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```

5. **Set Environment Variables**:
   ```
   PYTHON_VERSION=3.11.0
   GOOGLE_CHROME_BIN=/usr/bin/google-chrome
   CHROMEDRIVER_PATH=/usr/local/bin/chromedriver
   ```

6. **Select Plan**: Free

7. **Click "Create Web Service"**

8. **Wait for Deployment** (5-10 minutes first time)

9. **Copy Your Backend URL**: 
   - Example: `https://fedex-backend.onrender.com`
   - Save this for frontend configuration

### Important Notes for Backend:
- ⚠️ **Cold Starts**: Free tier sleeps after 15 min of inactivity
- ⚠️ **First Request**: May take 30-60 seconds to wake up
- ⚠️ **Selenium**: Chrome installation adds ~5 minutes to build time
- ✅ **Solution**: Upgrade to paid tier ($7/month) for always-on service

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New..." → "Project"**

3. **Import Repository**:
   - Search for `Johnson-123-208/FedEx`
   - Click "Import"

4. **Configure Project**:
   ```
   Framework Preset: Create React App
   Root Directory: FEDEX
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: REACT_APP_API_URL
     Value: https://fedex-backend.onrender.com
     ```
     (Use your actual Render backend URL)

6. **Click "Deploy"**

7. **Wait for Deployment** (2-3 minutes)

8. **Get Your Live URL**:
   - Example: `https://fedex-abc123.vercel.app`
   - You can add a custom domain later

### Step 2: Update CORS in Backend

After deployment, update your `app.py` CORS settings:

```python
# In app.py, update CORS to allow your Vercel domain
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://fedex-abc123.vercel.app",  # Your Vercel URL
            "https://your-custom-domain.com"    # If you add custom domain
        ]
    }
})
```

Then redeploy backend on Render.

---

## 🔄 Automatic Deployments

### GitHub Actions (Optional)
A GitHub Actions workflow has been created at `.github/workflows/deploy.yml`

To enable it:
1. Go to GitHub repository → Settings → Secrets
2. Add secret: `VERCEL_TOKEN`
   - Get token from: https://vercel.com/account/tokens
3. Push to main branch = auto-deploy!

---

## ✅ Verification Checklist

### Backend (Render):
- [ ] Service is running (green status)
- [ ] Can access: `https://your-backend.onrender.com`
- [ ] Logs show no errors
- [ ] Chrome/ChromeDriver installed successfully

### Frontend (Vercel):
- [ ] Deployment successful
- [ ] Can access: `https://your-frontend.vercel.app`
- [ ] Home page loads correctly
- [ ] Track Shipment page works
- [ ] API calls reach backend

### Integration:
- [ ] Frontend can call backend API
- [ ] CORS is configured correctly
- [ ] Tracking functionality works end-to-end

---

## 🐛 Troubleshooting

### Backend Issues:

**Build Fails:**
```bash
# Check Render logs for errors
# Common issues:
- Chrome installation failed → Check build.sh permissions
- Python version mismatch → Verify PYTHON_VERSION env var
- Missing dependencies → Check requirements.txt
```

**Service Crashes:**
```bash
# Check if Selenium is working:
- Verify Chrome binary location
- Check ChromeDriver version compatibility
- Review app logs for Selenium errors
```

**Slow Response:**
```bash
# Free tier limitations:
- Cold start: 30-60 seconds
- Solution: Upgrade to paid tier or use cron job to keep alive
```

### Frontend Issues:

**Build Fails:**
```bash
# Common fixes:
- Clear Vercel cache and redeploy
- Check package.json for errors
- Verify all dependencies are listed
```

**API Not Working:**
```bash
# Check:
- REACT_APP_API_URL is set correctly
- Backend CORS allows your Vercel domain
- Backend is running (not sleeping)
```

**Environment Variables:**
```bash
# In Vercel dashboard:
- Go to Project → Settings → Environment Variables
- Ensure REACT_APP_API_URL is set
- Redeploy after adding variables
```

---

## 💰 Cost Breakdown

### Free Tier:
- **Vercel**: Unlimited (with fair use limits)
- **Render**: 750 hours/month free
- **Total**: $0/month

### Recommended Paid:
- **Vercel Pro**: $20/month (optional, for team features)
- **Render Starter**: $7/month (recommended for always-on backend)
- **Total**: $7-27/month

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel logs
2. Review this guide
3. Check GitHub Issues
4. Contact support

---

## 🎉 Success!

Once deployed:
- ✅ Your frontend is live on Vercel
- ✅ Your backend is live on Render
- ✅ Users can track shipments globally
- ✅ Auto-deploys on git push

**Next Steps:**
- Add custom domain
- Set up monitoring
- Configure analytics
- Add error tracking (Sentry)
