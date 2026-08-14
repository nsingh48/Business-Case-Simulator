# GitHub Setup & Deployment Steps

## Your Repository
```
https://github.com/nsingh48/Business-Case-Simulator.git
```

---

## Step 1: Configure Git Locally

```bash
cd /Users/nilanjanasingh/Claude/Projects/Business\ Case\ Builder/

# Set your git credentials (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize git (if not already initialized)
git init

# Add remote repository
git remote add origin https://github.com/nsingh48/Business-Case-Simulator.git

# Verify remote is set
git remote -v
```

---

## Step 2: Add All Files to Git

```bash
# Add all files
git add .

# Check what's being added
git status

# Commit with message
git commit -m "Initial commit: Business Scenario Simulator for AI Service Delivery"
```

---

## Step 3: Push to GitHub

```bash
# Push to GitHub main branch
git branch -M main
git push -u origin main

# This will prompt for GitHub credentials
# Use your GitHub username and personal access token (not password)
```

**If you get an authentication error:**
- Generate Personal Access Token: https://github.com/settings/tokens
- Use token as password when prompted

---

## Step 4: Verify Files on GitHub

Visit: https://github.com/nsingh48/Business-Case-Simulator

You should see all your files uploaded:
- ✓ package.json
- ✓ vite.config.js
- ✓ index.html
- ✓ src/
- ✓ All .md documentation files
- ✓ .gitignore

---

## Step 5: Install Dependencies & Build

```bash
# Navigate to project
cd /Users/nilanjanasingh/Claude/Projects/Business\ Case\ Builder/

# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with all compiled files
```

---

## Step 6: Configure GitHub Pages

### Option A: Deploy from dist folder (Recommended)

1. **Commit dist folder to GitHub**
```bash
# Add dist folder to git
git add dist/

# Commit
git commit -m "Add production build"

# Push
git push origin main
```

2. **Go to GitHub Settings**
   - Visit: https://github.com/nsingh48/Business-Case-Simulator/settings/pages
   - Under "Build and deployment"
   - Select Source: **Deploy from branch**
   - Select Branch: **main**
   - Select Folder: **/dist**
   - Click **Save**

3. **Wait 1-2 minutes for deployment**

---

### Option B: Use GitHub Actions (Automatic builds - Better)

1. **Create workflow file**
```bash
mkdir -p .github/workflows
```

2. **Create file: `.github/workflows/deploy.yml`**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **Commit and push**
```bash
git add .github/
git commit -m "Add GitHub Actions deploy workflow"
git push origin main
```

4. **Go to GitHub Settings → Pages**
   - Source: **GitHub Actions**
   - Save

5. **Wait for action to complete** (watch in Actions tab)

---

## Step 7: Access Your Live Simulator

Your simulator will be live at:
```
https://nsingh48.github.io/Business-Case-Simulator/
```

---

## Step 8: Update Repository Settings (Optional)

1. Go to: https://github.com/nsingh48/Business-Case-Simulator/settings

2. **Add Description**:
   ```
   Interactive business scenario simulator for AI service delivery 
   in healthcare. Model Conservative/Baseline/Upside with NPV, 
   IRR, and financial projections.
   ```

3. **Add Homepage URL**:
   ```
   https://nsingh48.github.io/Business-Case-Simulator/
   ```

4. **Add Topics**:
   - business-modeling
   - healthcare
   - ai-services
   - financial-forecasting
   - react
   - simulator

---

## Step 9: Test Your Live Simulator

1. Visit: https://nsingh48.github.io/Business-Case-Simulator/

2. Test features:
   - ✓ Adjust assumptions
   - ✓ View metrics
   - ✓ See charts update
   - ✓ Export JSON

3. Share the link!

---

## Future Updates

Whenever you want to update the simulator:

```bash
# Make changes to code
# ...

# Build new version
npm run build

# Commit & push
git add -A
git commit -m "Update: [description of changes]"
git push origin main

# If using GitHub Actions: automatic deployment in ~1-2 min
# If manual: just push, GitHub Pages uses latest dist/
```

---

## Troubleshooting

### "Build failed"
- Check: `npm run build` works locally first
- Check: node_modules installed (`npm install`)

### "404 Not Found"
- Wait 2-3 minutes after first deployment
- Clear browser cache
- Check Pages settings (Source = /dist)

### "Site not deploying"
- Check GitHub Actions tab for errors
- Verify dist/ folder exists locally
- Check Settings → Pages shows "Your site is live"

### "Blank page"
- Check browser console (F12)
- May need to rebuild: `npm run build`

---

## Your Live URL

**Share this link:**
```
https://nsingh48.github.io/Business-Case-Simulator/
```

**Anyone can view it - no login required!**

---

## Next: Automate Future Builds

Want continuous deployment? GitHub Actions does it automatically:
- Push code → Automatically builds → Auto-deploys to GitHub Pages
- No manual `npm run build` needed

---

**Ready? Let's do this! 🚀**

Which option do you prefer:
- **Option A** (Manual, simpler)
- **Option B** (Automatic with GitHub Actions, recommended)

Tell me and I'll guide you through it step-by-step!
