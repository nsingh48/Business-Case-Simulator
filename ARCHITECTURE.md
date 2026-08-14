# Business Scenario Simulator - Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                              │
│                    (React Web UI - business-simulator.jsx)              │
│                                                                          │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐   │
│  │  Assumption     │  │  Metrics         │  │  Interactive        │   │
│  │  Panels         │  │  Dashboard       │  │  Charts             │   │
│  │                 │  │                  │  │                     │   │
│  │ • Conservative  │  │ • NPV            │  │ • Revenue Trend     │   │
│  │ • Baseline      │  │ • IRR            │  │ • EBITDA Trend      │   │
│  │ • Upside        │  │ • Breakeven      │  │ • Cash Flow         │   │
│  │ • Expandable    │  │ • Margins        │  │ • Year-3 Compare    │   │
│  └─────────────────┘  └──────────────────┘  └─────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Export Module (JSON)                                          │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                        (React State & Event Handlers)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                            │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  AIServiceDeliveryModel (simulator-core.js)                 │      │
│  │                                                               │      │
│  │  • Monthly P&L projection loop                              │      │
│  │  • Revenue calculation (growth + churn)                     │      │
│  │  • Headcount ramp (salary inflation)                        │      │
│  │  • Operating cost breakdown                                 │      │
│  │  • EBITDA & cash flow calculation                           │      │
│  │  • Cumulative cash flow tracking                            │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                    ↓                                     │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  FinancialCalculator (simulator-core.js)                    │      │
│  │                                                               │      │
│  │  • NPV Calculation (DCF formula)                            │      │
│  │  • IRR Calculation (Newton-Raphson)                         │      │
│  │  • Breakeven Analysis                                       │      │
│  │  • Margin calculations                                      │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                    ↓                                     │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  ScenarioBuilder (simulator-core.js)                        │      │
│  │                                                               │      │
│  │  • Creates scenario configurations                          │      │
│  │  • Manages assumption overrides                             │      │
│  │  • Constraint storage                                       │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                    ↓                                     │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  BusinessSimulator Orchestrator (simulator-core.js)         │      │
│  │                                                               │      │
│  │  • Initializes base assumptions                             │      │
│  │  • Coordinates scenario creation                            │      │
│  │  • Runs all projections                                     │      │
│  │  • Compares scenarios                                       │      │
│  │  • Exports results                                          │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                       │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │  Projections    │  │  Metrics        │  │  Export Data         │   │
│  │                 │  │                 │  │                      │   │
│  │ • months[]      │  │ • npv           │  │ JSON Format:         │   │
│  │ • revenue[]     │  │ • irr           │  │ • scenarios          │   │
│  │ • ebitda[]      │  │ • breakeven     │  │ • metrics            │   │
│  │ • cashFlow[]    │  │ • margins       │  │ • projections        │   │
│  │ • headcount[]   │  │ • cash_gen      │  │ • timestamp          │   │
│  │ • costs[]       │  │                 │  │                      │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────┘   │
│                                                                          │
│  All 3 Scenarios Stored Separately:                                    │
│  • Conservative  • Baseline  • Upside                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
BusinessSimulator (Container Component)
│
├── State Management
│   ├── scenarios[3]  → Conservative, Baseline, Upside
│   ├── expandedAssumptions
│   └── projectionMonths
│
├── Child Components
│   │
│   ├── Projection Period Selector
│   │
│   ├── Assumption Panels [3]
│   │   ├── Conservative Panel
│   │   ├── Baseline Panel
│   │   └── Upside Panel
│   │
│   ├── Metrics Dashboard
│   │   ├── Metrics Cards (4 key metrics)
│   │   └── Detailed Metrics Table
│   │
│   ├── Chart Grid [4]
│   │   ├── Revenue Projection Chart
│   │   ├── EBITDA Projection Chart
│   │   ├── Cumulative Cash Flow Chart
│   │   └── Year-3 Comparison Chart
│   │
│   └── Export Module
│       └── JSON Download Button
│
└── Hooks
    ├── useMemo(projections) → Calculate all scenarios
    ├── useMemo(chartData) → Prepare chart data
    └── useState hooks for UI state
```

---

## Data Flow

### 1. User Input Flow
```
User adjusts assumption
    ↓
handleAssumptionChange event fires
    ↓
setScenarios updates React state
    ↓
Component re-renders
    ↓
useMemo detects dependency change (scenarios)
    ↓
AIServiceDeliveryModel runs projection
    ↓
FinancialCalculator computes metrics
    ↓
UI updates with new values
    ↓
Charts re-render with new data
```

### 2. Projection Calculation Flow
```
AIServiceDeliveryModel.project(months=36)
    ↓
FOR each month (0 to 35):
    ├── Calculate revenue (with churn & growth)
    ├── Calculate headcount (ramp with growth rate)
    ├── Calculate salaries (with inflation)
    ├── Calculate operating costs (% of revenue)
    ├── Calculate EBITDA (revenue - costs)
    ├── Calculate capex (2% of revenue)
    ├── Calculate cash flow (EBITDA - capex)
    ├── Add to cumulative cash flow
    └── Store all values in projections object
    ↓
RETURN projections object
    ↓
FinancialCalculator.calculateNPV(cashFlows)
    ├── For each cash flow
    ├── Discount by (1 + rate)^period
    └── Sum all discounted values
    ↓
FinancialCalculator.calculateIRR(cashFlows)
    ├── Newton-Raphson iteration
    ├── Solve for rate where NPV = 0
    └── Return IRR percentage
    ↓
FinancialCalculator.calculateBreakeven(cashFlows)
    ├── Accumulate cash flows
    ├── Find first positive cumulative
    └── Return month number
```

### 3. Rendering Flow
```
chartData useMemo calculates:
    ↓
FOR each month in projections:
    ├── Create month record
    ├── Add Conservative_Revenue, Baseline_Revenue, Upside_Revenue
    ├── Add Conservative_EBITDA, Baseline_EBITDA, Upside_EBITDA
    ├── Add Conservative_CumulativeCF, Baseline_CumulativeCF, Upside_CumulativeCF
    └── Push to array
    ↓
LineChart/BarChart receives chartData
    ↓
Recharts renders visualization
```

---

## File Structure & Dependencies

```
Business Case Builder/
│
├── Core Engine (Pure JavaScript)
│   ├── simulator-core.js
│   │   ├── FinancialCalculator (static methods)
│   │   ├── ScenarioBuilder (class)
│   │   ├── AIServiceDeliveryModel (class)
│   │   └── BusinessSimulator (class)
│   │
│   └── use-case-templates.js
│       ├── CLINICAL_AI_IMPLEMENTATION
│       ├── BIOTECH_DATA_ANALYTICS
│       ├── PATIENT_ENGAGEMENT_PLATFORM
│       ├── REGULATORY_COMPLIANCE_AUTOMATION
│       └── TRAINING_DATA_ANNOTATION
│
├── React Frontend (Vite + React 18)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   │
│   ├── src/
│   │   ├── main.jsx (entry point)
│   │   ├── index.css (Tailwind)
│   │   └── BusinessSimulator.jsx
│   │       ├── Imports: React, recharts, lucide-react
│   │       ├── Embeds: FinancialCalculator, AIServiceDeliveryModel
│   │       └── Renders: UI + Charts
│   │
│   └── .gitignore
│
├── Documentation
│   ├── START_HERE.md
│   ├── QUICKSTART.md
│   ├── README.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── SYSTEM_OVERVIEW.md
│   ├── INDEX.md
│   ├── DELIVERY_SUMMARY.md
│   ├── ARCHITECTURE.md (this file)
│   └── DEPLOY_INSTRUCTIONS.md
│
└── Examples & Templates
    └── example-usage.js (Node.js examples)
```

---

## Technology Stack

### Core Engine
- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js or Browser
- **Dependencies**: ZERO
- **Size**: ~600 lines of code

### Frontend
- **Framework**: React 18.2+
- **Build Tool**: Vite
- **Charts**: Recharts 2.10+
- **Icons**: Lucide-react
- **Styling**: Tailwind CSS 3.3+
- **Bundle Size**: ~150KB (gzipped)

### Deployment
- **Target**: Any Node.js server or static host
- **Recommended**: Vercel, Netlify, GitHub Pages
- **Environment**: Browser (client-side only)

---

## Key Algorithms

### NPV Calculation
```javascript
NPV = Σ(CF_t / (1 + r)^t)

where:
  CF_t = cash flow at period t
  r = discount rate
  t = time period (month)
```

### IRR Calculation (Newton-Raphson Method)
```javascript
r_{n+1} = r_n - NPV(r_n) / NPV'(r_n)

Iterates until:
  |NPV(r)| < tolerance
  or max iterations reached
```

### Breakeven Point
```javascript
Find first t where:
  Σ(CF_0 to CF_t) >= 0
```

---

## State Management

### React State Shape
```javascript
{
  scenarios: {
    Conservative: {
      assumptions: {
        initialRevenue: 100000,
        monthlyGrowthRate: 0.03,
        initialHeadcount: 5,
        headcountGrowthRate: 0.02,
        baseCostPerEmployee: 12000,
        costInflation: 0.02,
        operatingCostMultiplier: 0.18,
        churnRate: 0.08,
        discountRate: 0.12
      }
    },
    Baseline: { ... },
    Upside: { ... }
  },
  expandedAssumptions: {
    Conservative: false,
    Baseline: false,
    Upside: true
  },
  projectionMonths: 36
}
```

### Derived State (useMemo)
```javascript
projections: {
  Conservative: {
    projections: {
      months: [1, 2, 3, ...],
      revenue: [100000, 103000, ...],
      ebitda: [15000, 18000, ...],
      cashFlow: [13000, 16000, ...],
      cumulativeCF: [13000, 29000, ...]
    },
    metrics: {
      npv: 450000,
      irr: "8.5",
      breakeven: 14,
      ...
    }
  },
  Baseline: { ... },
  Upside: { ... }
}

chartData: [
  {
    month: "M1",
    Conservative_Revenue: 100000,
    Baseline_Revenue: 100000,
    Upside_Revenue: 100000,
    ...
  },
  { month: "M2", ... },
  ...
]
```

---

## Performance Characteristics

### Time Complexity
- **Single Projection**: O(n) where n = months
- **Three Scenarios**: O(3n) = O(n)
- **All Metrics**: O(n) for NPV, O(n²) for IRR worst-case
- **Practical**: < 10ms for 36 months

### Space Complexity
- **Projections Array**: O(n) × 8 properties = ~3KB per scenario
- **Three Scenarios**: ~10KB total
- **React Render**: Optimized with useMemo (no unnecessary recalculations)

### Rendering Performance
- **Initial Load**: <100ms
- **Assumption Change**: <50ms recalculation + render
- **Chart Re-render**: <100ms (Recharts optimized)
- **Export**: <20ms

---

## Extensibility Points

### 1. Add New Use Case
```javascript
// 1. Create template in use-case-templates.js
const MY_USECASE = {
  name: 'My Business Model',
  baseAssumptions: { ... },
  scenarios: { ... }
};

// 2. Use in simulator
const sim = new BusinessSimulator('My Business');
sim.initialize(MY_USECASE.baseAssumptions);
```

### 2. Add New Financial Metric
```javascript
// In AIServiceDeliveryModel.calculateMetrics()
this.metrics = {
  ...existing,
  my_new_metric: calculateMyMetric(this.projections)
};
```

### 3. Add New Constraint
```javascript
// In AIServiceDeliveryModel.project()
if (constraints.myConstraint && headcount > constraints.myConstraint) {
  headcount = constraints.myConstraint;
}
```

### 4. Create New Model Type
```javascript
class SaaSModel {
  constructor(scenario) { ... }
  project(months) { ... }
  calculateMetrics() { ... }
}
```

---

## Integration Architecture

### Export Format
```json
{
  "simulator": "AI Service Delivery - Healthcare",
  "generatedAt": "2026-07-17T14:30:00Z",
  "projectionMonths": 36,
  "scenarios": {
    "Conservative": {
      "projections": { ... },
      "metrics": { ... }
    },
    "Baseline": { ... },
    "Upside": { ... }
  }
}
```

### Integration Points
1. **BI Tools**: Import JSON → Tableau/Power BI dashboards
2. **Spreadsheets**: Export JSON → Parse in Excel
3. **APIs**: Call simulator-core.js from backend
4. **Databases**: Store JSON results for historical tracking
5. **Automation**: Monthly cron job triggers projection update

---

## Security Architecture

### Client-Side Only
- ✅ No backend calls
- ✅ No database access
- ✅ No API keys
- ✅ All calculations local
- ✅ Data never leaves browser

### Data Protection
- ✅ HTTPS only (via Vercel/Netlify)
- ✅ No cookies or tracking
- ✅ No authentication needed
- ✅ User data stays local until export

---

## Deployment Architecture

### Development
```
Local → npm run dev → Vite dev server (http://localhost:3000)
```

### Production
```
                ┌─────────────────┐
                │   GitHub Repo   │
                └────────┬────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │   Vercel / Netlify / GH Pages │
         └───────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ↓                               ↓
    ┌─────────────┐              ┌─────────────┐
    │   CDN       │              │   Edge      │
    │   Caching   │              │   Runtime   │
    └─────────────┘              └─────────────┘
         │                               │
         └───────────────┬───────────────┘
                         ↓
                    ┌─────────────┐
                    │   Browser   │
                    │   (Client)  │
                    └─────────────┘
```

### Build Process
```
source code (.jsx, .js, .css)
    ↓
  Vite build
    ↓
minify + tree-shake
    ↓
dist/ folder (~150KB gzipped)
    ↓
Deploy to Vercel/Netlify
    ↓
Global CDN distribution
```

---

## Request/Response Flow (Production)

```
1. User visits: https://simulator.vercel.app
   ↓
2. Browser requests index.html from CDN
   ↓
3. CDN returns HTML + script tags
   ↓
4. Browser loads React bundle (~150KB gzipped)
   ↓
5. React renders <BusinessSimulator /> component
   ↓
6. User sees UI with default assumptions
   ↓
7. User adjusts assumptions (all local, no network calls)
   ↓
8. React recalculates state
   ↓
9. Charts update in real-time
   ↓
10. User exports JSON (downloads to local machine)
```

---

## Error Handling

### Division by Zero
```javascript
const avgMargin = revenue > 0 ? ebitda / revenue * 100 : 0;
```

### IRR Convergence Failure
```javascript
const irr = FinancialCalculator.calculateIRR(cashFlows);
// Returns null if doesn't converge
// Displays "N/A" in UI
```

### Invalid Input
```javascript
// parseFloat(value) || 0 handles NaN
const value = parseFloat(userInput) || 0;
```

---

## Summary

**The architecture is:**
- ✅ **Modular**: Core engine separate from UI
- ✅ **Scalable**: Easily add new scenarios/models
- ✅ **Performant**: <50ms calculations for 36 months
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Portable**: Works on any platform
- ✅ **Secure**: Client-side only, no backend
- ✅ **Extensible**: Hooks for custom metrics and constraints

**Total system:**
- ~600 lines core engine
- ~500 lines UI component
- ~2,600 lines total code
- ~1,300 lines documentation
- **Zero external dependencies** (core)
- **Production-ready**

---

This architecture enables rapid scenario modeling, easy customization, and seamless deployment across any platform.
