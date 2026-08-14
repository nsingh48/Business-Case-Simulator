# Business Scenario Simulator - Visual Architecture

## High-Level System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER / CLIENT SIDE                              │
│                          (Fully Client-Side Execution)                          │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                        PRESENTATION LAYER (React)                     │   │
│  │                                                                        │   │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │   │
│  │  │  Assumption     │  │  Metrics         │  │  Charts (Recharts)   │   │
│  │  │  Input Panels   │  │  Dashboard       │  │                  │    │   │
│  │  │   (3 scenarios) │  │  • NPV           │  │  • Line charts   │    │   │
│  │  │                 │  │  • IRR           │  │  • Bar charts    │    │   │
│  │  │  Interactive    │  │  • Breakeven     │  │  • Real-time     │    │   │
│  │  │  sliders &      │  │  • Margins       │  │  • Responsive    │    │   │
│  │  │  text inputs    │  │  • Revenue       │  │                  │    │   │
│  │  │                 │  │  • EBITDA        │  │  4 Visualizations    │   │
│  │  └─────────────────┘  └──────────────────┘  └──────────────────┘    │   │
│  │                                                                        │   │
│  │  ┌──────────────────────────────────────────────────────────────┐    │   │
│  │  │  Export Module                                               │    │   │
│  │  │  • JSON Download Button                                      │    │   │
│  │  │  • Creates blob with all scenarios & metrics                 │    │   │
│  │  │  • Automatic filename with timestamp                         │    │   │
│  │  └──────────────────────────────────────────────────────────────┘    │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                            │
│                        (React Hooks & State Management)                        │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                      BUSINESS LOGIC LAYER                             │   │
│  │                   (Pure JavaScript Functions/Classes)                 │   │
│  │                                                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  AIServiceDeliveryModel                                     │    │   │
│  │  │  ├─ Constructor(scenario)                                   │    │   │
│  │  │  ├─ project(months)  →  Monthly P&L loop                  │    │   │
│  │  │  │   ├─ Revenue calc (growth + churn)                     │    │   │
│  │  │  │   ├─ Headcount ramp (salary inflation)                 │    │   │
│  │  │  │   ├─ Operating costs (fixed + % revenue)               │    │   │
│  │  │  │   ├─ EBITDA = Revenue - Costs                          │    │   │
│  │  │  │   ├─ Cash Flow = EBITDA - CapEx                        │    │   │
│  │  │  │   └─ Cumulative CF tracking                            │    │   │
│  │  │  └─ calculateMetrics()  →  Financial metrics             │    │   │
│  │  │      ├─ Delegates to FinancialCalculator                 │    │   │
│  │  │      └─ Returns metrics object                           │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                    ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  FinancialCalculator (Static Methods)                      │    │   │
│  │  │  ├─ calculateNPV(cashFlows, rate)                          │    │   │
│  │  │  │   DCF Formula: Σ(CF / (1+r)^t)                         │    │   │
│  │  │  ├─ calculateIRR(cashFlows)                                │    │   │
│  │  │  │   Newton-Raphson iterative solver                      │    │   │
│  │  │  └─ calculateBreakeven(cashFlows)                         │    │   │
│  │  │      Cumulative positive check                            │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                    ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  ScenarioBuilder                                            │    │   │
│  │  │  ├─ Constructor(baseAssumptions)                           │    │   │
│  │  │  ├─ createScenario(name, adjustments, constraints)        │    │   │
│  │  │  ├─ getScenario(name) → scenario config                   │    │   │
│  │  │  └─ listScenarios() → ["Conservative", "Baseline", ...]   │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                    ↓                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  BusinessSimulator (Orchestrator)                           │    │   │
│  │  │  ├─ initialize(assumptions)                                │    │   │
│  │  │  ├─ addScenario(name, adj, constraints)                   │    │   │
│  │  │  ├─ runProjections(months)  →  Runs all 3 scenarios      │    │   │
│  │  │  ├─ getComparison()  →  Side-by-side comparison          │    │   │
│  │  │  └─ export(format)  →  JSON export                        │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER (In-Memory)                         │   │
│  │                                                                        │   │
│  │  Scenario Objects (React State)                                       │   │
│  │  ├─ Conservative: {assumptions: {...}, projections: {...}}          │   │
│  │  ├─ Baseline: {assumptions: {...}, projections: {...}}              │   │
│  │  └─ Upside: {assumptions: {...}, projections: {...}}                │   │
│  │                                                                        │   │
│  │  Projections Object (useMemo Derived)                                 │   │
│  │  ├─ months: [1, 2, 3, ..., 36]                                       │   │
│  │  ├─ revenue: [100000, 103000, ..., 420000]                           │   │
│  │  ├─ ebitda: [15000, 18000, ..., 134400]                              │   │
│  │  ├─ cashFlow: [13000, 16000, ..., 132400]                            │   │
│  │  └─ cumulativeCF: [13000, 29000, ..., 2100000]                       │   │
│  │                                                                        │   │
│  │  Metrics Object (useMemo Derived)                                     │   │
│  │  ├─ npv: 850000                                                       │   │
│  │  ├─ irr: "14.2"                                                       │   │
│  │  ├─ breakeven: 10                                                     │   │
│  │  ├─ final_year_revenue: 420000                                        │   │
│  │  └─ final_year_margin: "32%"                                          │   │
│  │                                                                        │   │
│  │  Chart Data (useMemo Derived)                                         │   │
│  │  └─ Array of month records with all 3 scenarios                      │   │
│  │     {month: "M1", Cons_Rev: 100k, Base_Rev: 100k, Up_Rev: 100k, ...} │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy Tree

```
<BusinessSimulator /> (Main Container)
│
├─ State Variables
│  ├─ scenarios: {Conservative, Baseline, Upside}
│  ├─ expandedAssumptions: boolean flags
│  └─ projectionMonths: number
│
├─ Hooks
│  ├─ useMemo(projections) → calculates all 3 scenarios
│  └─ useMemo(chartData) → prepares data for charts
│
├─ Event Handlers
│  ├─ handleAssumptionChange()
│  └─ handleProjectionMonthChange()
│
└─ JSX Render Tree
   │
   ├─ <Header>
   │  ├─ "Business Scenario Simulator"
   │  └─ Subtitle
   │
   ├─ <ProjectionPeriodSelector>
   │  └─ <select> with 5 options (12-60 months)
   │
   ├─ <AssumptionPanels> [3]
   │  ├─ <ConservativePanel>
   │  │  ├─ Header (collapsible)
   │  │  └─ Form with 9 input fields
   │  ├─ <BaselinePanel>
   │  │  └─ ...same structure...
   │  └─ <UpsidePanel>
   │     └─ ...same structure...
   │
   ├─ <MetricsDashboard>
   │  └─ <Table>
   │     ├─ Header row (Metric | Conservative | Baseline | Upside)
   │     └─ 5 data rows
   │        ├─ NPV
   │        ├─ IRR
   │        ├─ Breakeven
   │        ├─ Final Year Margin
   │        └─ Final Year Revenue
   │
   ├─ <ChartGrid> (Grid 2x2)
   │  ├─ <RevenueChart>
   │  │  └─ <LineChart> (3 lines)
   │  ├─ <EBITDAChart>
   │  │  └─ <LineChart> (3 lines)
   │  ├─ <CashFlowChart>
   │  │  └─ <LineChart> (3 lines)
   │  └─ <Year3ComparisonChart>
   │     └─ <BarChart> (6 bars)
   │
   └─ <ExportModule>
      └─ <button> "Export as JSON"
```

---

## Data Flow Diagram

### User Interaction Loop

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER ACTION                                   │
│            (User adjusts slider or edits text field)                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     EVENT HANDLER TRIGGERED                             │
│           handleAssumptionChange(scenario, key, value)                  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                   REACT STATE UPDATE                                    │
│        setScenarios(prev => ({                                         │
│          ...prev,                                                       │
│          [scenario]: {                                                  │
│            assumptions: {...prev, [key]: value}                        │
│          }                                                              │
│        }))                                                              │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              COMPONENT RE-RENDER TRIGGERED                              │
│        React detects dependencies changed (scenarios)                   │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│          useMemo(projections) RE-EVALUATES                              │
│                                                                         │
│  FOR EACH scenario (Conservative, Baseline, Upside):                   │
│    ├─ Create AIServiceDeliveryModel instance                          │
│    ├─ Call .project(projectionMonths)                                 │
│    │  └─ 36 iterations of monthly calculations                        │
│    ├─ Call .calculateMetrics()                                        │
│    │  ├─ FinancialCalculator.calculateNPV()                          │
│    │  ├─ FinancialCalculator.calculateIRR()                          │
│    │  └─ FinancialCalculator.calculateBreakeven()                    │
│    └─ Store results in projections object                             │
│                                                                         │
│  RESULT: {Conservative: {...}, Baseline: {...}, Upside: {...}}        │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│          useMemo(chartData) RE-EVALUATES                                │
│                                                                         │
│  FOR EACH month in projections:                                        │
│    Create single record with all 3 scenarios' data                     │
│                                                                         │
│  RESULT: Array of 36 month records, each with 9 values                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                  RENDER PHASE                                           │
│  ├─ Metrics table uses projections.*.metrics                           │
│  ├─ Revenue chart uses chartData[*].Conservative/Baseline/Upside_Rev   │
│  ├─ EBITDA chart uses chartData[*].Conservative/Baseline/Upside_EBITDA │
│  ├─ CashFlow chart uses chartData[*].Conservative/Baseline/Upside_CF   │
│  └─ Comparison chart uses projections.*.metrics.final_year_*           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     BROWSER RENDER                                      │
│  ├─ DOM updates with new table values                                  │
│  ├─ Recharts re-renders 4 charts                                       │
│  └─ User sees updated metrics and visualizations                       │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ↓
                    (Cycle repeats if user                        
                    adjusts another assumption)
```

---

## Monthly Projection Loop Detail

```
FOR month = 0 TO 35:
│
├─ REVENUE CALCULATION
│  ├─ monthlyRevenue = previousRevenue × (1 - churnRate)
│  │  └─ Accounts for customer attrition
│  │
│  └─ newRevenue = monthlyRevenue × (1 + monthlyGrowthRate)
│     └─ Applies organic growth rate
│
├─ HEADCOUNT CALCULATION
│  ├─ newHeadcount = previousHeadcount × (1 + headcountGrowthRate)
│  │  └─ Ramping up staff quarterly
│  │
│  └─ Round to nearest integer
│
├─ COST CALCULATION
│  ├─ salaries = headcount × baseCostPerEmployee × (1 + costInflation)^(month/12)
│  │  └─ Compound inflation over time
│  │
│  ├─ operatingCosts = revenue × operatingCostMultiplier + salaries
│  │  └─ Fixed (salaries) + variable (% revenue)
│  │
│  └─ capex = revenue × 0.02  (2% reinvestment)
│
├─ PROFITABILITY CALCULATION
│  ├─ ebitda = revenue - operatingCosts
│  │  └─ Operating profit (before interest, taxes, depreciation)
│  │
│  └─ cashFlow = ebitda - capex
│     └─ Actual cash available
│
├─ ACCUMULATION
│  ├─ cumulativeCF += cashFlow
│  │  └─ Running total for breakeven analysis
│  │
│  └─ Store all values in arrays
│
└─ REPEAT for next month

OUTPUT: projections object with 8 arrays of 36 values each
```

---

## Calculation Engine Flow (Financial Metrics)

```
                         CASH FLOWS ARRAY
                    [13k, 16k, 20k, ..., 134k]
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ↓             ↓             ↓
          ┌──────────┐ ┌──────────┐ ┌──────────┐
          │   NPV    │ │   IRR    │ │Breakeven │
          └──────────┘ └──────────┘ └──────────┘
                │             │             │
                ↓             ↓             ↓
    ┌─────────────────┐  ┌─────────────┐  ┌──────────────┐
    │ DCF Formula     │  │Newton-      │  │Cumulative    │
    │                 │  │Raphson Loop │  │Sum Check     │
    │ Σ(CF/(1+r)^t)   │  │             │  │              │
    │                 │  │ r_{n+1} =   │  │Find first +  │
    │ For each CF:    │  │ r_n -       │  │cumulative    │
    │ divide by       │  │ NPV(r_n)/   │  │              │
    │ (1+rate)^month  │  │ NPV'(r_n)   │  │Return month  │
    │                 │  │             │  │              │
    │ Sum all         │  │ Until       │  │Return index  │
    │ discounted      │  │ |NPV| <     │  │              │
    │ values          │  │ tolerance   │  │              │
    │                 │  │             │  │              │
    └─────────────────┘  └─────────────┘  └──────────────┘
            │                    │                 │
            ↓                    ↓                 ↓
        NPV Value           IRR % Value         Month #
        (e.g., 850k)       (e.g., 14.2%)      (e.g., 10)
            │                    │                 │
            └────────┬───────────┴─────────────────┘
                     │
                     ↓
            Combined into metrics object
            {npv: 850000, irr: "14.2", breakeven: 10, ...}
```

---

## Performance Optimization: useMemo Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│ useMemo Dependencies                                         │
│                                                              │
│ projections = useMemo(() => {                               │
│   // ONLY recalculates when dependencies change             │
│   // Avoids unnecessary calculations on every render        │
│                                                              │
│   FOR each scenario: run AIServiceDeliveryModel...          │
│ }, [scenarios, projectionMonths])                           │
│                                                              │
│ Dependencies: [scenarios, projectionMonths]                 │
│ - If user changes assumption → scenarios object changes     │
│   → useMemo recalculates                                    │
│ - If user changes period selector → projectionMonths changes│
│   → useMemo recalculates                                    │
│ - If UI re-renders for other reason → dependencies same     │
│   → useMemo returns cached value (no recalculation)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Similar for chartData:                                       │
│                                                              │
│ chartData = useMemo(() => {                                 │
│   IF projections not ready: return []                       │
│   ELSE: transform projections into chart format             │
│ }, [projections])                                           │
│                                                              │
│ Only recalculates when projections object changes           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   LOCAL DEVELOPMENT                          │
│                                                               │
│  npm run dev  →  Vite dev server http://localhost:3000       │
│  ├─ Hot module reloading                                    │
│  ├─ Fast rebuild on changes                                 │
│  └─ Source maps for debugging                               │
│                                                               │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ↓ git push
┌──────────────────────────────────────────────────────────────┐
│                   GITHUB REPOSITORY                          │
│                                                               │
│  ├─ index.html                                              │
│  ├─ package.json                                            │
│  ├─ vite.config.js                                          │
│  ├─ src/                                                     │
│  │  ├─ main.jsx                                            │
│  │  ├─ BusinessSimulator.jsx                               │
│  │  └─ index.css                                           │
│  └─ [other docs]                                            │
│                                                               │
└─────────────────────┬──────────────────────────────────────┘
                      │
            ┌─────────┼─────────┐
            │         │         │
            ↓         ↓         ↓
    ┌──────────┐ ┌────────┐ ┌──────────────┐
    │ Vercel   │ │Netlify │ │GitHub Pages  │
    └──────────┘ └────────┘ └──────────────┘
       (Recommended)
            │
            ↓
    npm install
    npm run build
       ↓
    dist/ folder generated (~150KB gzipped)
       ↓
    Deploy to global CDN
       ↓
    ┌──────────────────────────────────┐
    │ Live URL:                         │
    │ https://simulator.vercel.app      │
    └──────────────────────────────────┘
        ↓
    User browser requests
        ↓
    CDN serves files
        ↓
    React + Charts load
        ↓
    All calculations local (no backend)
```

---

## Architecture Summary

| Layer | Component | Technology | Responsibility |
|-------|-----------|-----------|-----------------|
| **Presentation** | BusinessSimulator.jsx | React 18 | UI/UX, user interaction |
| | Charts | Recharts | Data visualization |
| | Styling | Tailwind CSS | Responsive design |
| **Business Logic** | AIServiceDeliveryModel | JavaScript | P&L calculations |
| | FinancialCalculator | JavaScript | NPV, IRR, Breakeven |
| | ScenarioBuilder | JavaScript | Configuration mgmt |
| | BusinessSimulator | JavaScript | Orchestration |
| **Data** | React State | useMemo | Cached calculations |
| | Projections | In-memory | Monthly arrays |
| | Metrics | In-memory | KPIs |
| **Deployment** | Build | Vite | Minification, tree-shake |
| | Hosting | Vercel/Netlify | CDN, HTTPS |
| | Runtime | Browser | Client-side execution |

---

This architecture is **modular, scalable, performant, and production-ready** ✅
