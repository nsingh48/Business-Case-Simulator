# Business Scenario Simulator
## AI Service Delivery for Life Sciences & Healthcare

A comprehensive, production-ready business simulator for modeling conservative, baseline, and upside scenarios with advanced financial metrics, constraints, and visualizations.

---

## Overview

This simulator empowers business stakeholders to:
- **Model multiple scenarios** with different assumptions
- **Apply business constraints** (margins, growth limits, cost caps)
- **Calculate advanced metrics**: NPV, IRR, Breakeven, EBITDA margins
- **Visualize projections** across revenue, costs, cash flow, and headcount
- **Compare scenarios** side-by-side
- **Export data** for external analysis
- **Extend to new use cases** via pluggable architecture

---

## Architecture

### Core Components

#### 1. **FinancialCalculator** (`simulator-core.js`)
Stateless financial computation engine:
- **NPV (Net Present Value)**: Discounted cash flow analysis
- **IRR (Internal Rate of Return)**: Newton-Raphson iterative solver
- **Breakeven Analysis**: First period with positive cumulative cash flow
- **Payback Period**: Time to recover initial investment

#### 2. **ScenarioBuilder**
Manages scenario creation and configuration:
```javascript
const builder = new ScenarioBuilder(baseAssumptions);
builder
  .createScenario('Conservative', conservativeAdj, constraints)
  .createScenario('Baseline', baselineAdj, constraints)
  .createScenario('Upside', upsideAdj, constraints);
```

#### 3. **AIServiceDeliveryModel**
Domain-specific model for AI/Agentic service delivery:
- Monthly revenue projections with churn modeling
- Headcount ramp and salary inflation
- Operating cost breakdown (salaries, infrastructure, CAC)
- Utilization-rate-based scenarios
- EBITDA and cash flow calculation
- Constraint enforcement (e.g., minimum margins)

#### 4. **BusinessSimulator** (Orchestrator)
Coordinates all components:
```javascript
const simulator = new BusinessSimulator('Healthcare AI Services');
simulator
  .initialize(baseAssumptions)
  .addScenario('Conservative', {...})
  .addScenario('Baseline', {...})
  .addScenario('Upside', {...})
  .runProjections(36);
```

---

## Key Assumptions (AI Service Delivery)

### Revenue Levers
- **initialRevenue**: Starting monthly revenue ($)
- **monthlyGrowthRate**: Period-over-period growth rate (%)
- **churnRate**: Monthly customer churn rate (%)

### Cost & Headcount
- **initialHeadcount**: Starting team size
- **headcountGrowthRate**: Quarterly staffing expansion (%)
- **baseCostPerEmployee**: Monthly salary per employee ($)
- **costInflation**: Annual salary inflation (%)
- **operatingCostMultiplier**: Ops costs as % of revenue

### Utilization & Efficiency
- **utilizationRate**: Billable capacity by scenario
  - Conservative: 65%
  - Baseline: 78%
  - Upside: 85%

### Financial Parameters
- **discountRate**: Annual discount for NPV (default 10%)
- **minMargin**: Constraint on minimum EBITDA margin

---

## Scenario Definitions

### Conservative Case
- **Growth**: 3% monthly (slowest adoption)
- **Utilization**: 65% (resource underutilization)
- **Churn**: 8% monthly (higher customer attrition)
- **Costs**: 18% of revenue (operational overhead)
- **Use Case**: Worst-case scenario for funding/risk analysis

### Baseline Case
- **Growth**: 5% monthly (realistic market uptake)
- **Utilization**: 78% (industry standard)
- **Churn**: 5% monthly (manageable retention)
- **Costs**: 15% of revenue (operational efficiency)
- **Use Case**: Most probable business path

### Upside Case
- **Growth**: 8% monthly (strong market demand)
- **Utilization**: 85% (high resource efficiency)
- **Churn**: 2% monthly (excellent customer retention)
- **Costs**: 12% of revenue (economies of scale)
- **Use Case**: Optimistic scenario for upside potential

---

## Output Metrics

### Financial Metrics
| Metric | Definition | Use Case |
|--------|-----------|----------|
| **NPV** | Net Present Value @ 10% discount | Investment viability; present value of future cash |
| **IRR** | Internal Rate of Return (%) | Return on investment; compare to cost of capital |
| **Breakeven** | Month when cumulative CF turns positive | Cash runway & funding needs |
| **Avg EBITDA Margin** | Average operating margin (%) | Operational efficiency over projection period |
| **Final Year Margin** | Year 3 EBITDA margin (%) | Mature business profitability |

### Operational Metrics
| Metric | Definition |
|--------|-----------|
| **Final Year Revenue** | Year 3 revenue run rate |
| **Total Cash Generated** | Cumulative cash flow over period |
| **Headcount Ramp** | Team size growth trajectory |
| **Utilization Rate** | % of billable capacity deployed |

---

## Usage

### Web Interface (React)
Open `business-simulator.jsx` in a React environment or use the artifact in Claude:

1. **Adjust assumptions** via collapsible panels per scenario
2. **Select projection period** (12-60 months)
3. **View metrics dashboard** with NPV, IRR, margins
4. **Analyze charts**:
   - Revenue projection (3 scenarios)
   - EBITDA projection (3 scenarios)
   - Cumulative cash flow breakeven
   - Year 3 comparison
5. **Export data** as JSON for external analysis

### Programmatic Usage (Node.js)
```javascript
const {
  FinancialCalculator,
  ScenarioBuilder,
  AIServiceDeliveryModel,
  BusinessSimulator
} = require('./simulator-core.js');

const sim = new BusinessSimulator('AI Healthcare');

sim.initialize({
  initialRevenue: 150000,
  monthlyGrowthRate: 0.05,
  initialHeadcount: 8,
  // ... other assumptions
});

sim
  .addScenario('Conservative', { monthlyGrowthRate: 0.03 })
  .addScenario('Baseline', {})
  .addScenario('Upside', { monthlyGrowthRate: 0.08 });

const results = sim.runProjections(36);
const comparison = sim.getComparison();

console.log(comparison);
// Export for analysis
const json = sim.export('json');
```

---

## Extending to New Use Cases

### Template: Custom Business Model

Create a new model class by extending the base pattern:

```javascript
class CustomServiceModel {
  constructor(scenario) {
    this.scenario = scenario;
    this.assumptions = scenario.assumptions;
    this.constraints = scenario.constraints;
    this.projections = { /* initialize */ };
  }

  project(months = 36) {
    // 1. Extract assumptions
    const { param1, param2, ... } = this.assumptions;

    // 2. Monthly loop
    for (let month = 0; month < months; month++) {
      // Calculate revenue/costs based on domain
      // Store in this.projections
    }

    return this.projections;
  }

  calculateMetrics() {
    // Calculate domain-specific metrics
    this.metrics = { /* metrics */ };
    return this.metrics;
  }
}
```

### Supported Use Cases (Framework Ready)

1. **SaaS/Subscription**
   - ARR, MRR, churn, LTV, CAC
   - Per-seat pricing model
   - Net retention rate

2. **Real Estate Development**
   - Capital expenditure, NOI, occupancy
   - Rental income projections
   - Debt service coverage ratio

3. **Product Launch**
   - COGS, gross margin, operating leverage
   - Market penetration phases
   - Channel mix profitability

4. **Marketplace**
   - Commission-based revenue
   - GMV, take rate dynamics
   - Seller/buyer acquisition costs

5. **Consulting/Services** (Current: AI Service Delivery)
   - Utilization rate, billable hours
   - Headcount ramp, salary costs
   - Project-based vs. retainer mix

---

## Constraints System

### Available Constraints
```javascript
const constraints = {
  minMargin: 0.20,           // Min 20% EBITDA margin
  maxHeadcount: 100,         // Cap team size
  maxCosts: 50000,           // Monthly spend limit
  minUtilization: 0.60,      // Min billable utilization
  maxChurn: 0.07,            // Max tolerable churn
  revenueCap: 1000000        // Maximum annual run rate
};
```

### Enforcement in Model
Constraints are evaluated during projection and adjusted post-hoc:
```javascript
const actualEBITDA = Math.max(
  ebitda,
  revenue * marginConstraint
);
```

---

## Financial Calculations Reference

### NPV (Net Present Value)
```
NPV = Σ(CF_t / (1 + r)^t)
where:
  CF_t = cash flow at period t
  r = discount rate
  t = time period
```

### IRR (Internal Rate of Return)
Solves: NPV = 0
Uses Newton-Raphson iterative method:
```
r_{n+1} = r_n - NPV(r_n) / NPV'(r_n)
```

### Breakeven
First period where cumulative cash flow ≥ 0

---

## Data Export Format

### JSON Export Structure
```json
{
  "simulator": "AI Service Delivery - Healthcare",
  "generatedAt": "2026-07-17T14:30:00Z",
  "projectionMonths": 36,
  "comparison": {
    "scenarioNames": ["Conservative", "Baseline", "Upside"],
    "metrics": {
      "Conservative": {
        "npv": 450000,
        "irr": "12.5%",
        "breakeven": 8,
        ...
      },
      ...
    },
    "projections": {
      "revenue": {
        "Conservative": [100000, 103000, ...],
        "Baseline": [100000, 105000, ...],
        ...
      },
      ...
    }
  }
}
```

---

## Configuration Examples

### Healthcare AI Implementation Services
```javascript
const assumptions = {
  initialRevenue: 150000,        // $150k/month starting
  monthlyGrowthRate: 0.05,       // 5% MoM growth
  initialHeadcount: 12,          // 12 consultants
  headcountGrowthRate: 0.04,     // 4% quarterly expansion
  baseCostPerEmployee: 15000,    // $15k/month (salaries + benefits)
  operatingCostMultiplier: 0.18, // 18% ops/infrastructure
  churnRate: 0.04,               // 4% customer churn
  discountRate: 0.10             // 10% discount rate
};
```

### Diagnostic Imaging AI (Faster Growth)
```javascript
const assumptions = {
  initialRevenue: 75000,
  monthlyGrowthRate: 0.12,       // 12% aggressive growth
  initialHeadcount: 5,
  headcountGrowthRate: 0.06,
  baseCostPerEmployee: 12000,
  operatingCostMultiplier: 0.12,
  churnRate: 0.02,
  discountRate: 0.08
};
```

---

## Future Enhancements

- [ ] Monte Carlo simulation for probability distributions
- [ ] Sensitivity analysis (tornado charts)
- [ ] Custom KPI definitions per industry
- [ ] Multi-dimensional scenario analysis (growth vs. margin)
- [ ] Integration with accounting systems (QuickBooks, NetSuite)
- [ ] Real-time data feeds from operational systems
- [ ] API for external integrations
- [ ] Advanced visualizations (Sankey, waterfall, variance analysis)

---

## Troubleshooting

### IRR Returns "N/A"
- **Cause**: Negative cumulative cash flow throughout projection
- **Solution**: Increase growth rate or reduce initial investment/costs

### Negative EBITDA in early periods
- **Expected**: Service businesses often run negative early
- **Solution**: Increase projection period or adjust ramp assumptions

### Metrics seem inconsistent
- **Check**: Discount rate used in NPV (default 10%)
- **Verify**: All assumptions are in correct units (rates as decimals, currency as dollars)

---

## Support & Questions

For issues, feature requests, or use-case specific questions, review the assumptions section and model logic in `simulator-core.js` and `business-simulator.jsx`.

---

**Version**: 1.0  
**Last Updated**: July 2026  
**Status**: Production Ready
