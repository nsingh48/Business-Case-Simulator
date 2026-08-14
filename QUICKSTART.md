# Quick Start Guide (5 Minutes)

## 🚀 Get Started Immediately

### Option 1: Web Interface (No Installation)

1. **Open** `business-simulator.jsx` in Claude as an artifact or your React environment
2. **Adjust** assumptions using the collapsible panels (Conservative, Baseline, Upside)
3. **View** real-time metrics and charts
4. **Export** as JSON

**That's it!** No backend required, everything runs in the browser.

---

### Option 2: Node.js (Programmatic)

```bash
# 1. Copy simulator-core.js to your project
# 2. Create a test file:

const {
  FinancialCalculator,
  ScenarioBuilder,
  AIServiceDeliveryModel,
  BusinessSimulator
} = require('./simulator-core.js');

// 3. Run a simulation
const sim = new BusinessSimulator('My Business');

sim.initialize({
  initialRevenue: 100000,
  monthlyGrowthRate: 0.05,
  initialHeadcount: 5,
  baseCostPerEmployee: 12000,
  costInflation: 0.02,
  operatingCostMultiplier: 0.15,
  churnRate: 0.05,
  discountRate: 0.1
});

sim
  .addScenario('Conservative', { monthlyGrowthRate: 0.03 })
  .addScenario('Baseline', {})
  .addScenario('Upside', { monthlyGrowthRate: 0.08 });

const results = sim.runProjections(36);

// 4. Log results
console.log('Results:', results);
console.log('Export:', sim.export('json'));
```

---

## 📊 Understanding the Output

### Key Metrics Explained

**NPV** = Present value of future cash  
→ Positive = Good investment | Higher = Better

**IRR** = Annual return rate  
→ Compare to your cost of capital (typically 10%)

**Breakeven** = Month when you're cash-positive  
→ Shows funding runway needed

**EBITDA Margin** = Operating profit %  
→ Higher = More efficient business

**Example Interpretation**:
```
Conservative: NPV $450k, IRR 8.5%, Breakeven Month 14
  → Safe case; needs 14 months of runway

Baseline: NPV $850k, IRR 14.2%, Breakeven Month 10
  → Most likely; solid 14% returns

Upside: NPV $1.2M, IRR 18.7%, Breakeven Month 6
  → Optimistic; excellent if achieved
```

---

## 🎯 Common Use Cases

### Use Case 1: Plan Funding Round
```
1. Model 3 scenarios
2. Look at Conservative breakeven month
3. Plan to raise 1.3x that amount in runway
4. Show board the upside potential
```

### Use Case 2: Evaluate Business Model
```
1. Test sensitivity: vary growth rate 2%-12%
2. Find sweet spot for profitability
3. Check if margins align with strategy
4. Identify key assumptions driving returns
```

### Use Case 3: Board Presentation
```
1. Export all 3 scenarios to JSON
2. Create simple slides from metrics table
3. Show 4 charts: Revenue, EBITDA, Cash Flow, NPV
4. Highlight breakeven and final margins
```

### Use Case 4: Investor Conversation
```
1. Conservative case: "Worst case is $450k NPV"
2. Baseline case: "Most likely is $850k NPV with 14% IRR"
3. Upside case: "Best case achieves $1.2M NPV"
→ Range gives investor comfort
```

---

## 🔧 Pre-Built Templates

### Already Included:

```javascript
// 1. Clinical AI Implementation
// $200k/month, healthcare expert services

// 2. Biotech Data Analytics
// $120k/month, research data ML services

// 3. Patient Engagement Platform
// $80k/month, digital health SaaS

// 4. Regulatory & Compliance Automation
// $150k/month, specialized consulting

// 5. Training Data Annotation
// $100k/month, volume-based labeling

// → Use as-is or customize in example-usage.js
```

---

## 📈 What If Analysis

### Question: "What if growth is 7% instead of 5%?"

```javascript
// Edit one assumption:
sim.initialize({
  monthlyGrowthRate: 0.07  // ← Changed from 0.05
  // ... rest same
});

// Re-run and compare
const results = sim.runProjections(36);
// → See updated NPV, IRR, margins
```

### Question: "What if we can only hire 2 people per quarter?"

```javascript
// Add constraint:
sim.addScenario('Baseline', {}, {
  maxHeadcount: 30  // ← Cap team size
});

// Re-run
// → Headcount will plateau at 30
// → Revenue/margins may be limited by capacity
```

---

## 🎨 Customization Checklist

- [ ] Change `initialRevenue` to your actual starting revenue
- [ ] Adjust `monthlyGrowthRate` based on your market
- [ ] Set `initialHeadcount` to your team size
- [ ] Update `baseCostPerEmployee` with your actual salary
- [ ] Change `operatingCostMultiplier` for your cost structure
- [ ] Adjust `churnRate` based on customer retention
- [ ] Set `discountRate` (10% typical, higher for risky biz)
- [ ] Test across 12mo, 24mo, 36mo, 60mo periods
- [ ] Compare Conservative vs. Baseline vs. Upside

---

## 💡 Pro Tips

### Tip 1: Validate Against History
```
If you have historical data (e.g., last 12 months):
→ Set assumptions to match actual results
→ Then adjust forward looking assumptions
→ Validates your model is calibrated correctly
```

### Tip 2: Scenario Variance = Risk
```
Conservative $450k vs. Upside $1.2M = 2.7x spread
→ Indicates high execution risk
→ Better to focus on reducing gap between scenarios
```

### Tip 3: Breakeven is Runway Trigger
```
If breakeven = Month 12 in Baseline:
→ Recommend 15-18 months runway (1.25-1.5x buffer)
→ Accounts for execution delays and scenarios missing
```

### Tip 4: EBITDA Margin Stabilization
```
Year 1: 10% margin (heavy ramp costs)
Year 2: 25% margin (scaling efficiencies)
Year 3: 35% margin (mature operations)
→ If Year 3 margin < 30%, business model may not work
```

### Tip 5: Export Early, Iterate Often
```
1. Export baseline scenario
2. Share with stakeholders for feedback
3. Update assumptions based on input
4. Re-export and iterate
→ Builds confidence and alignment
```

---

## ⚡ Keyboard Shortcuts (Web UI)

- **Tab**: Move between assumption fields
- **Enter**: Recalculate immediately
- **Escape**: Collapse expanded section
- **Ctrl+Shift+S**: Export (if enabled)

---

## 🔍 Validation Checklist

Before sharing results:

- [ ] Revenue increases month-over-month
- [ ] Headcount follows revenue growth
- [ ] EBITDA margin improves over time
- [ ] Cumulative cash flow turns positive near breakeven
- [ ] Upside NPV > Baseline > Conservative
- [ ] IRR makes sense for your industry
- [ ] Final year metrics align with strategic goals
- [ ] Assumptions documented (attach PDF screenshot)

---

## 📞 Troubleshooting

| Problem | Fix |
|---------|-----|
| **Negative cash flow throughout** | ↑ Revenue or ↓ costs |
| **IRR shows as N/A** | ↑ Growth rate or ↓ initial costs |
| **Unrealistic margins** | Check operatingCostMultiplier |
| **Headcount grows but revenue flat** | ↑ Growth rate to match hiring |
| **Numbers seem wrong** | Verify units (rates as %, currency as $) |

---

## 📚 Next: Deep Dive

Once comfortable with basics:

1. **Read** README.md for detailed architecture
2. **Review** use-case-templates.js to match your industry
3. **Study** IMPLEMENTATION_GUIDE.md for advanced features
4. **Run** example-usage.js to see 5 real scenarios
5. **Explore** business-simulator.jsx source code

---

## 🎓 Learning Path

**Time** → **Activity**

**5 min** → Open web UI, adjust 1 assumption, see impact  
**15 min** → Build all 3 scenarios for your business  
**30 min** → Export, validate against historical data  
**60 min** → Present to stakeholder, get feedback  
**120 min** → Iterate assumptions, create board deck  

---

## 🏁 You're Ready!

You now have everything needed to:
✅ Model any business scenario  
✅ Compare Conservative / Baseline / Upside  
✅ Calculate NPV, IRR, breakeven  
✅ Visualize projections  
✅ Export for stakeholders  

**Go build your scenarios!**

---

**Questions?** Check README.md or example-usage.js  
**Stuck?** Review SYSTEM_OVERVIEW.md architecture section  
**Want to extend?** See IMPLEMENTATION_GUIDE.md → Customization
