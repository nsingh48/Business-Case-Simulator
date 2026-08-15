# Complete Deployment Guide - Business Scenario Simulator

**One comprehensive guide. No backtracking. No surprises.**

---

## Your Repository
```
https://github.com/nsingh48/Business-Case-Simulator
```

## Final Live URL (After Completion)
```
https://nsingh48.github.io/Business-Case-Simulator/
```

---

# STEP-BY-STEP DEPLOYMENT

## PHASE 1: LOCAL CONFIGURATION (5 minutes)

### Step 1: Verify All Tools Installed
```bash
node --version          # Should show v20+
npm --version           # Should show 10+
git --version           # Should show 2.34+
```

If any are missing, STOP and install before continuing.

---

### Step 2: Navigate to Project
```bash
cd /Users/nilanjanasingh/Claude/Projects/Business\ Case\ Builder/
```

---

### Step 3: Verify .gitignore is Correct
```bash
cat .gitignore | head -5
```

Should show:
```
node_modules/
build/
*.log
```

**NOT** `dist/` in the first lines. If `dist/` is there, this is wrong. ❌

---

### Step 4: Clean Install Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

Wait for completion (~2-3 minutes).

---

### Step 5: Build Locally
```bash
npm run build
```

Should complete with:
```
✓ built in X.XXs
```

**Verify dist/ folder exists:**
```bash
ls -la dist/
```

Should show `index.html` and `assets/` folder.

---

## PHASE 2: GITHUB CONFIGURATION (2 minutes)

### Step 6: Commit Everything
```bash
git add -A
git status
```

Should show modified files (package-lock.json, vite.config.js, .github/workflows/, etc.)

```bash
git commit -m "Complete deployment setup: configure Vite base path and GitHub Actions"
```

---

### Step 7: Push to GitHub
```bash
git push origin main
```

When prompted:
- **Username:** `nsingh48`
- **Password:** Your GitHub Personal Access Token

Wait for push to complete.

---

### Step 8: Verify on GitHub
Visit: https://github.com/nsingh48/Business-Case-Simulator

Confirm you see:
- ✅ `.github/workflows/deploy.yml`
- ✅ `dist/` folder
- ✅ `vite.config.js` with `base: '/Business-Case-Simulator/'`
- ✅ `src/` folder

---

## PHASE 3: GITHUB PAGES SETUP (1 minute)

### Step 9: Go to Settings → Pages
```
https://github.com/nsingh48/Business-Case-Simulator/settings/pages
```

---

### Step 10: Configure Pages

Under **"Build and deployment"**:

1. **Source dropdown:** Select `GitHub Actions`
2. Click **Save**

---

## PHASE 4: AUTOMATIC DEPLOYMENT (2 minutes)

### Step 11: Monitor GitHub Actions
Go to: https://github.com/nsingh48/Business-Case-Simulator/actions

Watch for workflow named:
```
"Deploy to GitHub Pages"
```

**Workflow Steps:**
1. ✓ Checkout code
2. ✓ Setup Node.js
3. ✓ Install dependencies
4. ✓ Build project
5. ✓ Upload artifact
6. ✓ Deploy to GitHub Pages

**Wait until all steps show green checkmarks** (usually 1-2 minutes).

---

### Step 12: Verify Deployment Complete
Once workflow completes, you'll see in the workflow summary:
```
✓ Deploy to GitHub Pages
✓ Pages build and deployment
```

---

## PHASE 5: TEST LIVE SIMULATOR (2 minutes)

### Step 13: Hard Refresh Your Browser
Open this URL (important: use hard refresh):

```
https://nsingh48.github.io/Business-Case-Simulator/
```

**If on Mac:**
- Chrome/Edge: `Cmd + Shift + R`
- Safari: `Cmd + Option + R`

Or open in **new incognito/private window**

---

### Step 14: Test Functionality

1. **Page loads?** ✓
2. **See title "Business Scenario Simulator"?** ✓
3. **Adjust assumption (e.g., change revenue)?** ✓
4. **See metrics update in real-time?** ✓
5. **See charts render?** ✓
6. **Export JSON button works?** ✓

---

## SUCCESS CHECKLIST

- [ ] All tools installed (Node, npm, Git)
- [ ] `npm install` completed
- [ ] `npm run build` created dist/ folder
- [ ] vite.config.js has `base: '/Business-Case-Simulator/'`
- [ ] .gitignore does NOT contain `dist/`
- [ ] All files committed and pushed to GitHub
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] GitHub Actions workflow completed successfully
- [ ] Live URL loads without errors
- [ ] Simulator is fully functional

---

## TROUBLESHOOTING

### Black/Blank Page?
- Hard refresh (Cmd+Shift+R on Mac)
- Clear browser cache
- Check GitHub Pages shows "Your site is live"
- Check vite.config.js has correct `base` path

### GitHub Actions Failed?
- Go to Actions tab
- Click the failed workflow
- Scroll down to see error message
- Common issues:
  - Node version mismatch: fix in deploy.yml
  - Missing dependencies: run `npm install`
  - File permissions: not usually an issue

### Can't Access URL?
- Wait 2-3 minutes after workflow completes
- Verify Settings → Pages shows "Your site is live at..."
- Try different browser
- Try incognito/private mode

### dist/ folder not uploading?
- Verify .gitignore doesn't have `dist/`
- Run `git rm --cached -r .` then `git add .`
- Check GitHub Pages source is set to "GitHub Actions"

---

## FINAL URLs

**Your GitHub Repository:**
```
https://github.com/nsingh48/Business-Case-Simulator
```

**Your Live Simulator (SHARE THIS):**
```
https://nsingh48.github.io/Business-Case-Simulator/
```

**Anyone can use it - no login required!**

---

## FUTURE UPDATES

Whenever you want to update the simulator:

```bash
# Make code changes
# ... edit files ...

# Build
npm run build

# Commit and push
git add -A
git commit -m "Update: [description of changes]"
git push origin main
```

GitHub Actions automatically rebuilds and deploys within 1-2 minutes.

---

## WHAT YOU NOW HAVE

✅ Professional business simulator live on the web
✅ Automatic builds with GitHub Actions
✅ GitHub source control
✅ Global CDN distribution via GitHub Pages
✅ HTTPS enabled automatically
✅ Shareable link (no backend server needed)
✅ Works on any device
✅ Can be updated anytime

---

**TOTAL TIME: 15-20 minutes**

**RESULT: Your simulator is live and accessible worldwide!** 🚀

