# Deployment Instructions

## Option 1: Deploy to Vercel (Easiest - 2 minutes)

### Step 1: Push to GitHub
```bash
cd /Users/nilanjanasingh/Claude/Projects/Business\ Case\ Builder/
git init
git add .
git commit -m "Initial commit: Business Scenario Simulator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/business-simulator.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects settings (no configuration needed!)
5. Click "Deploy"

**Your live URL will be**: `https://business-simulator-YOUR_NAME.vercel.app`

---

## Option 2: Deploy to Netlify (Alternative)

### Step 1: Build locally
```bash
npm install
npm run build
```

### Step 2: Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Your live URL will be**: `https://YOUR_SITE_NAME.netlify.app`

---

## Option 3: Deploy to GitHub Pages

### Step 1: Update vite.config.js
```javascript
export default defineConfig({
  base: '/business-simulator/',  // Add this line
  // ... rest of config
})
```

### Step 2: Build and push
```bash
npm install
npm run build
git add dist/
git commit -m "Build dist files"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to your GitHub repo Settings
2. Go to "Pages" section
3. Select "Deploy from branch"
4. Choose `main` branch and `/root` folder
5. Save

**Your live URL will be**: `https://YOUR_USERNAME.github.io/business-simulator/`

---

## Quick Deploy (All-in-One)

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel (if installed)
npm run deploy
```

---

## What Gets Deployed

- ✅ Interactive React UI
- ✅ All 3 scenarios (Conservative, Baseline, Upside)
- ✅ Real-time calculations
- ✅ Interactive charts
- ✅ JSON export
- ✅ Responsive design

---

## After Deployment

Share your live URL:
- Example: `https://business-simulator.vercel.app`
- Works on all devices (desktop, tablet, mobile)
- No backend required (everything client-side)
- Instant calculations and chart rendering

---

## Environment Variables (Optional)

No environment variables needed! The simulator is completely self-contained.

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **GitHub Pages**: https://pages.github.com

---

## Troubleshooting

**"Module not found"** → Run `npm install`  
**"Port 3000 in use"** → `npm run dev -- --port 3001`  
**"Build fails"** → Check `npm run build` output  
**"Deployed but broken"** → Check browser console (F12)  

---

**Deploy takes 2-5 minutes. You'll get a live URL instantly!** 🚀
