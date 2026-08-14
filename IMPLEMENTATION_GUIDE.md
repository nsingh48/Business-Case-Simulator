# Implementation Guide: Business Scenario Simulator

## Quick Start (5 Minutes)

### Option 1: Web Interface (Recommended)
1. Open `business-simulator.jsx` in your React environment or Claude artifact
2. Adjust assumptions using collapsible panels
3. Select projection period (12-60 months)
4. View metrics and charts automatically
5. Export results as JSON

### Option 2: Node.js/Command Line
```bash
# Install dependencies (if using npm)
npm install

# Run simulator
node run-simulator.js
```

---

## Architecture Deep Dive

### Data Flow

```
User Input (Assumptions)
    ↓
ScenarioBuilder (creates scenario configs)
    ↓
AIServiceDeliveryModel (projects monthly P&L)
    ↓
FinancialCalculator (NPV, IRR, Breakeven)
    ↓
BusinessSimulator (orchestrates, compares)
    ↓
Visualizations + Metrics
```

### Key Classes

#### **FinancialCalculator**
**Purpose**: Standalone financial computation  
**Methods**:
- `calculateNPV(cashFlows, discountRate)` → number
- `calculateIRR(cashFlows)` → number or null
- `calculateBreakeven(cashFlows)` → { period, cumulativeCF }

**Why Separate**: Reusable across any model; testable in isolation

#### **ScenarioBuilder**
**Purpose**: Configuration management  
**Pattern**: Builder pattern for fluent API
```javascript
builder
  .createScenario('Conservative', {...}, {...})
  .createScenario('Baseline', {...}, {...})
  .createScenario('Upside', {...}, {...});
```

#### **AIServiceDeliveryModel**
**Purpose**: Domain-specific business logic  
**Key Methods**:
- `project(months)` → projections object with monthly data
- `calculateMetrics()` → metrics object (NPV, IRR, margins)

**Extensibility**: Subclass to create new models (SaaS, Real Estate, etc.)

#### **BusinessSimulator**
**Purpose**: Master orchestrator  
**Workflow**:
```javascript
new BusinessSimulator('name')
  .initialize(baseAssumptions)
  .addScenario('Conservative', {...}, {...})
  .addScenario('Baseline', {...}, {...})
  .addScenario('Upside', {...}, {...})
  .runProjections(36)  // Returns results immediately
```

---

## Customization Guide

### Scenario 1: Adjust Assumptions for Your Business

**Use Case**: Clinical AI Implementation with different starting point

```javascript
// Before: Generic template
const baseAssumptions = {
  initialRevenue: 200000,
  monthlyGrowthRate: 0.04,
  // ... defaults
};

// After: Your specific business
const baseAssumptions = {
  initialRevenue: 250000,      // Your actual starting MRR
  monthlyGrowthRate: 0.06,     // Your projected growth
  initialHeadcount: 20,         // Your current team
  baseCostPerEmployee: 17000,   // Your average salary
  churnRate: 0.01,             // Your observed churn
  // ... others stay same
};
```

### Scenario 2: Add New Constraint

**Use Case**: Enforce maximum headcount (budget constraint)

```javascript
// In AIServiceDeliveryModel.project(), after calculating headcount:

const constraints = this.constraints || {};
if (constraints.maxHeadcount) {
  headcount = Math.min(headcount, constraints.maxHeadcount);
}

// When creating scenario:
simulator.addScenario('Baseline', {...}, {
  minMargin: 0.30,
  maxHeadcount: 30,           // ← NEW CONSTRAINT
  maxMonthlySpend: 300000
});
```

### Scenario 3: Extend with New Use Case

**Use Case**: Model a SaaS platform (not services)

```javascript
// Step 1: Create new model class
class SaaSModel {
  constructor(scenario) {
    this.scenario = scenario;
    this.assumptions = scenario.assumptions;
    this.projections = {
      months: [],
      mrr: [],           // Monthly recurring revenue
      customers: [],
      churn: [],
      ltv: [],           // Lifetime value
      cac: [],           // Customer acquisition cost
      paybackMonths: [],
      // ... etc
    };
  }

  project(months = 36) {
    const {
      initialMRR = 10000,
      growthRate = 0.10,      // 10% MoM
      avgCustomerValue = 1000, // $1k/mo per customer
      cacCost = 5000,          // Cost to acquire
      churnRate = 0.05,
    } = this.assumptions;

    let mrr = initialMRR;
    let customers = Math.floor(initialMRR / avgCustomerValue);
    let cumulativeCF = -500000;  // Initial investment

    for (let month = 0; month < months; month++) {
      // Calculate churn impact
      customers = Math.floor(customers * (1 - churnRate));

      // Add new customers from growth
      const newCustomers = Math.floor(customers * growthRate);
      customers += newCustomers;

      // Revenue
      mrr = customers * avgCustomerValue;

      // Costs
      const cacCosts = newCustomers * cacCost;
      const operatingCosts = mrr * 0.30;  // 30% opex
      const cashFlow = mrr - cacCosts - operatingCosts;
      cumulativeCF += cashFlow;

      // Store
      this.projections.months.push(month + 1);
      this.projections.mrr.push(Math.round(mrr));
      this.projections.customers.push(customers);
      this.projections.cac.push(Math.round(cacCost));
      // ... etc
    }

    return this.projections;
  }

  calculateMetrics() {
    const { mrr, customers } = this.projections;
    const finalMRR = mrr[mrr.length - 1];
    const finalARR = finalMRR * 12;
    const ltv = (finalMRR / (this.assumptions.churnRate * 100)); // Simplified

    this.metrics = {
      final_arr: Math.round(finalARR),
      final_mrr: Math.round(finalMRR),
      total_customers: customers[customers.length - 1],
      npv: FinancialCalculator.calculateNPV(this.projections.cashFlow, 0.1),
      irr: FinancialCalculator.calculateIRR(this.projections.cashFlow),
      ltv_cac_ratio: ltv / this.assumptions.cacCost
    };

    return this.metrics;
  }
}

// Step 2: Use with simulator
const sim = new BusinessSimulator('My SaaS Platform');
sim.initialize({...saasAssumptions});

// Step 3: Modify runProjections to use new model
// (Requires extending BusinessSimulator with pluggable model selection)
```

---

## Constraint System

### Available Constraints

| Constraint | Type | Purpose |
|-----------|------|---------|
| `minMargin` | number (0-1) | Minimum EBITDA margin enforcement |
| `maxHeadcount` | number | Hard cap on team size |
| `maxMonthlySpend` | number | Budget ceiling |
| `minUtilization` | number (0-1) | Minimum billable utilization |
| `maxChurn` | number (0-1) | Customer retention floor |
| `revenueCap` | number | Maximum annual run rate |

### Applying Constraints

```javascript
// Method 1: During scenario creation
simulator.addScenario('Conservative', 
  { monthlyGrowthRate: 0.03 },
  {
    minMargin: 0.25,
    maxHeadcount: 50,
    maxMonthlySpend: 200000
  }
);

// Method 2: Enforce in model logic
// In AIServiceDeliveryModel.project():
if (constraints.maxHeadcount && headcount > constraints.maxHeadcount) {
  headcount = constraints.maxHeadcount;
  // Log warning: hitting constraint
}

// Method 3: Post-calculation adjustment
const actualEBITDA = Math.max(ebitda, revenue * minMarginConstraint);
```

---

## Metrics Interpretation

### NPV (Net Present Value)
**What it means**: Present-day value of all future cash flows  
**How to use**:
- **Positive NPV** → Investment adds value
- **Negative NPV** → Returns below discount rate
- **Higher NPV** → Better investment

**Example**: 
- Conservative NPV: $450k
- Baseline NPV: $850k
- Upside NPV: $1.2M
- → Baseline is most likely profitable scenario

---

### IRR (Internal Rate of Return)
**What it means**: Annualized return rate; rate at which NPV = 0  
**How to use**:
- Compare to cost of capital (WACC)
- If IRR > Cost of Capital → Good investment
- If IRR < Cost of Capital → Reject

**Example**:
- IRR = 18% vs Cost of Capital = 10% → Accept
- IRR = 8% vs Cost of Capital = 10% → Reject

---

### Breakeven Point
**What it means**: Month when cumulative cash flow becomes positive  
**How to use**:
- Shows funding runway needed
- Impacts cash burn rate
- Critical for venture financing

**Example**:
- Conservative: Breakeven Month 14
- Baseline: Breakeven Month 10
- Upside: Breakeven Month 6
- → Plan for 14 months of runway in worst case

---

### EBITDA Margin
**What it means**: Operating profit as % of revenue  
**How to use**:
- Benchmark against industry
- Shows operational efficiency
- Higher = better business model

**Example** (Year 3):
- Conservative: 22% margin
- Baseline: 32% margin
- Upside: 38% margin
- → Baseline shows path to healthy unit economics

---

## Integration Patterns

### Pattern 1: Export & Integration
```javascript
// Run simulator
const results = simulator.export('json');

// Use in spreadsheet/BI tool
fetch('/api/import', {
  method: 'POST',
  body: JSON.stringify(results)
});

// Example: Tableau/Power BI ingestion
// → Automated dashboard refresh
```

### Pattern 2: Multi-Model Analysis
```javascript
// Run multiple simulators in sequence
const simulators = [
  new BusinessSimulator('AI Services'),
  new BusinessSimulator('Data Annotation'),
  new BusinessSimulator('Software Platform')
];

const allResults = simulators.map(sim =>
  sim
    .initialize(assumptions)
    .addScenario('Conservative', {...})
    .addScenario('Baseline', {...})
    .addScenario('Upside', {...})
    .runProjections(36)
    .getComparison()
);

// Cross-business analysis
// → Which business line has best ROI?
// → Which is most capital efficient?
```

### Pattern 3: Sensitivity Analysis
```javascript
// Test impact of key assumptions

const baselineAssumptions = {...};
const sensitivities = [];

// Vary growth rate from 2% to 10%
for (let growth = 0.02; growth <= 0.10; growth += 0.01) {
  const sim = new BusinessSimulator('Sensitivity Test');
  sim.initialize({
    ...baselineAssumptions,
    monthlyGrowthRate: growth
  });
  
  sim.addScenario('Test', {}, {});
  const results = sim.runProjections(36);
  
  sensitivities.push({
    growth,
    npv: results.Test.metrics.npv,
    irr: results.Test.metrics.irr
  });
}

// Output: Growth rate sensitivity curve
// → Which growth rate most impacts value?
```

---

## Common Issues & Solutions

### Issue: "IRR returns N/A"
**Cause**: All cash flows negative (cumulative CF never positive)  
**Solutions**:
1. Increase `initialRevenue`
2. Increase `monthlyGrowthRate`
3. Decrease `operatingCostMultiplier`
4. Decrease `initialHeadcount`
5. Increase projection period (give more time to positive)

---

### Issue: "Metrics seem unrealistic"
**Check**:
1. Are units correct? (rates as decimals, currency as dollars)
2. Is `discountRate` reasonable? (10% = moderate risk)
3. Are assumptions internally consistent?
   - Example: 85% utilization + low growth = inconsistent

---

### Issue: "Scenario comparison unclear"
**Solution**: Use constraint system
```javascript
// Instead of manually tweaking each scenario:
simulator
  .addScenario('Conservative', adj1, { minMargin: 0.20 })
  .addScenario('Baseline', adj2, { minMargin: 0.30 })
  .addScenario('Upside', adj3, { minMargin: 0.40 });
// Now scenarios are clearly differentiated by margin
```

---

## Testing & Validation

### Manual Test Case: Break-Even Analysis
```javascript
// Scenario: When do we become cash-positive?

const sim = new BusinessSimulator('Break-Even Test');
sim.initialize({
  initialRevenue: 50000,
  monthlyGrowthRate: 0.04,
  initialHeadcount: 3,
  baseCostPerEmployee: 10000,
  operatingCostMultiplier: 0.15
});

sim.addScenario('Test', {}, {});
const result = sim.runProjections(36);

// Expected: breakeven ~10-12 months
console.assert(
  result.Test.metrics.breakeven >= 8 && result.Test.metrics.breakeven <= 14,
  'Break-even outside expected range'
);
```

### Validation Checklist
- [ ] NPV is positive for at least one scenario
- [ ] IRR is above discount rate for upside case
- [ ] Breakeven is within projection period (or documented)
- [ ] Margins increase over time (economies of scale)
- [ ] Headcount growth follows revenue growth
- [ ] Constraints are enforced (spot-check one or two)
- [ ] Export JSON is valid and complete

---

## Next Steps

1. **Customize**: Adjust base assumptions for your business model
2. **Add Scenarios**: Create additional scenarios (Market Shock, Competitive, etc.)
3. **Validate**: Compare projections to historical actuals
4. **Integrate**: Export results to your planning/forecasting system
5. **Iterate**: Update monthly with actual results; refine assumptions

---

## Support & Customization

For business-specific customizations:
1. Review `use-case-templates.js` for similar use case
2. Fork template and adjust assumptions
3. Test with known historical data points
4. Create additional scenarios based on your risk factors

---

**Last Updated**: July 2026  
**Version**: 1.0
