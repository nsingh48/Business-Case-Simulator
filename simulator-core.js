/**
 * Business Simulator Core Engine
 * Supports Conservative, Baseline, Upside scenarios for AI/Agentic service delivery
 * Focus: Life Sciences & Healthcare
 */

// ============================================================================
// FINANCIAL CALCULATIONS
// ============================================================================

class FinancialCalculator {
  /**
   * Calculate Net Present Value (NPV)
   * @param {number[]} cashFlows - Array of cash flows by period
   * @param {number} discountRate - Annual discount rate (as decimal, e.g., 0.1 for 10%)
   */
  static calculateNPV(cashFlows, discountRate = 0.1) {
    return cashFlows.reduce((sum, cf, period) => {
      return sum + cf / Math.pow(1 + discountRate, period);
    }, 0);
  }

  /**
   * Calculate Internal Rate of Return (IRR) using Newton-Raphson
   * @param {number[]} cashFlows - Array of cash flows
   * @param {number} initialGuess - Starting IRR guess (default 0.1)
   */
  static calculateIRR(cashFlows, initialGuess = 0.1, maxIterations = 100, tolerance = 0.0001) {
    let rate = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPV(cashFlows, rate);
      const npvDerivative = cashFlows.reduce((sum, cf, period) => {
        return sum - period * cf / Math.pow(1 + rate, period + 1);
      }, 0);

      if (Math.abs(npv) < tolerance) return rate;
      if (Math.abs(npvDerivative) < tolerance) return null;

      rate = rate - npv / npvDerivative;
    }
    return rate;
  }

  /**
   * Calculate Payback Period (in periods)
   * @param {number[]} cashFlows - Array of cash flows (including initial investment)
   */
  static calculatePaybackPeriod(cashFlows) {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulative += cashFlows[i];
      if (cumulative >= 0) return i;
    }
    return null; // Never breaks even
  }

  /**
   * Calculate Breakeven Point
   * Finds first period where cumulative cash flow turns positive
   */
  static calculateBreakeven(cashFlows) {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulative += cashFlows[i];
      if (cumulative >= 0) return { period: i, cumulativeCF: cumulative };
    }
    return { period: null, cumulativeCF: cumulative };
  }
}

// ============================================================================
// SCENARIO BUILDER
// ============================================================================

class ScenarioBuilder {
  constructor(baseAssumptions = {}) {
    this.baseAssumptions = baseAssumptions;
    this.scenarios = {};
  }

  /**
   * Create a scenario with adjustments to base assumptions
   * @param {string} name - Scenario name (e.g., 'Conservative', 'Baseline', 'Upside')
   * @param {object} adjustments - Assumption overrides
   * @param {object} constraints - Business constraints
   */
  createScenario(name, adjustments = {}, constraints = {}) {
    const assumptions = { ...this.baseAssumptions, ...adjustments };
    this.scenarios[name] = {
      name,
      assumptions,
      constraints,
      projections: null,
      metrics: null
    };
    return this;
  }

  /**
   * Get scenario by name
   */
  getScenario(name) {
    return this.scenarios[name];
  }

  /**
   * List all scenarios
   */
  listScenarios() {
    return Object.keys(this.scenarios);
  }
}

// ============================================================================
// AI SERVICE DELIVERY MODEL (Life Sciences & Healthcare)
// ============================================================================

class AIServiceDeliveryModel {
  constructor(scenario) {
    this.scenario = scenario;
    this.assumptions = scenario.assumptions;
    this.constraints = scenario.constraints;
    this.projections = {
      months: [],
      revenue: [],
      operatingCosts: [],
      ebitda: [],
      cashFlow: [],
      cumulativeCF: [],
      headcount: [],
      utilizationRate: []
    };
  }

  /**
   * Project revenues and costs based on service delivery model
   * Typical metrics for AI service delivery:
   * - billable hours per resource
   * - utilization rate
   * - average billing rate (by service level: implementation, optimization, support)
   * - staffing ramp
   */
  project(months = 36) {
    const {
      initialRevenue = 100000,
      monthlyGrowthRate = 0.05,
      initialHeadcount = 5,
      headcountGrowthRate = 0.03,
      avgBillingRate = 200,
      billableHoursPerMonth = 160,
      baseCostPerEmployee = 12000,
      costInflation = 0.02,
      operatingCostMultiplier = 0.15, // % of revenue for ops/infrastructure
      utilizationRateCons = 0.65,
      utilizationRateBenchmark = 0.78,
      utilizationRateUpside = 0.85,
      clientAcquisitionCost = 50000,
      monthlyCAC = 0,
      churnRate = 0.05, // Monthly client churn
      minMargin = 0.2 // Constraint: minimum 20% EBITDA margin
    } = this.assumptions;

    // Determine utilization rate based on scenario
    const utilization = this.scenario.name === 'Conservative' ? utilizationRateCons :
                       this.scenario.name === 'Upside' ? utilizationRateUpside :
                       utilizationRateBenchmark;

    let revenue = initialRevenue;
    let headcount = initialHeadcount;
    let cumulativeCF = 0;

    for (let month = 0; month < months; month++) {
      // Revenue projection
      const monthlyRevenue = revenue * (1 - churnRate);
      revenue = monthlyRevenue + (monthlyRevenue * monthlyGrowthRate);

      // Headcount ramp
      headcount = Math.round(headcount * (1 + headcountGrowthRate));

      // Operating costs
      const salaries = headcount * baseCostPerEmployee * Math.pow(1 + costInflation, month / 12);
      const operatingCosts = revenue * operatingCostMultiplier + salaries + monthlyCAC;

      // EBITDA
      const ebitda = revenue - operatingCosts;

      // Apply margin constraint: if below minimum, adjust
      const marginConstraint = this.constraints.minMargin || minMargin;
      const actualEBITDA = Math.max(ebitda, revenue * marginConstraint);

      // Cash flow (simplified: EBITDA - capex)
      const capex = revenue * 0.02; // 2% reinvestment
      const cashFlow = actualEBITDA - capex;
      cumulativeCF += cashFlow;

      // Store projections
      this.projections.months.push(month + 1);
      this.projections.revenue.push(Math.round(revenue));
      this.projections.operatingCosts.push(Math.round(operatingCosts));
      this.projections.ebitda.push(Math.round(actualEBITDA));
      this.projections.cashFlow.push(Math.round(cashFlow));
      this.projections.cumulativeCF.push(Math.round(cumulativeCF));
      this.projections.headcount.push(headcount);
      this.projections.utilizationRate.push((utilization * 100).toFixed(1));
    }

    return this.projections;
  }

  /**
   * Calculate key financial metrics
   */
  calculateMetrics() {
    const { cashFlow, revenue } = this.projections;

    const npv = FinancialCalculator.calculateNPV(cashFlow, 0.1);
    const irr = FinancialCalculator.calculateIRR(cashFlow);
    const breakeven = FinancialCalculator.calculateBreakeven(cashFlow);

    // Calculate margins
    const avgEBITDA = this.projections.ebitda.reduce((a, b) => a + b, 0) / this.projections.ebitda.length;
    const avgRevenue = this.projections.revenue.reduce((a, b) => a + b, 0) / this.projections.revenue.length;
    const avgMargin = (avgEBITDA / avgRevenue * 100).toFixed(1);

    // Final year metrics
    const finalRevenue = revenue[revenue.length - 1];
    const finalEBITDA = this.projections.ebitda[this.projections.ebitda.length - 1];
    const finalMargin = (finalEBITDA / finalRevenue * 100).toFixed(1);

    this.metrics = {
      npv: npv.toFixed(0),
      irr: irr ? (irr * 100).toFixed(1) : 'N/A',
      breakeven: breakeven.period,
      breakeven_cf: breakeven.cumulativeCF,
      avg_ebitda_margin: avgMargin,
      final_year_margin: finalMargin,
      final_year_revenue: Math.round(finalRevenue),
      final_year_ebitda: Math.round(finalEBITDA),
      total_cash_generated: Math.round(this.projections.cumulativeCF[this.projections.cumulativeCF.length - 1])
    };

    return this.metrics;
  }
}

// ============================================================================
// SIMULATOR ORCHESTRATOR
// ============================================================================

class BusinessSimulator {
  constructor(name, useCase = 'AI Service Delivery - Healthcare') {
    this.name = name;
    this.useCase = useCase;
    this.scenarioBuilder = null;
    this.scenarios = {};
  }

  /**
   * Initialize simulator with base assumptions
   */
  initialize(baseAssumptions) {
    this.scenarioBuilder = new ScenarioBuilder(baseAssumptions);
    return this;
  }

  /**
   * Add a scenario
   */
  addScenario(scenarioName, adjustments = {}, constraints = {}) {
    this.scenarioBuilder.createScenario(scenarioName, adjustments, constraints);
    return this;
  }

  /**
   * Run projections for all scenarios
   */
  runProjections(months = 36) {
    const scenarioNames = this.scenarioBuilder.listScenarios();

    for (const name of scenarioNames) {
      const scenario = this.scenarioBuilder.getScenario(name);
      const model = new AIServiceDeliveryModel(scenario);

      model.project(months);
      model.calculateMetrics();

      this.scenarios[name] = {
        scenario,
        model,
        projections: model.projections,
        metrics: model.metrics
      };
    }

    return this.scenarios;
  }

  /**
   * Get comparison data for all scenarios
   */
  getComparison() {
    const comparison = {
      scenarioNames: Object.keys(this.scenarios),
      metrics: {},
      projections: {}
    };

    // Metrics comparison
    for (const [name, data] of Object.entries(this.scenarios)) {
      comparison.metrics[name] = data.metrics;
    }

    // Projections by metric
    for (const metric of ['revenue', 'ebitda', 'cashFlow', 'headcount']) {
      comparison.projections[metric] = {};
      for (const [name, data] of Object.entries(this.scenarios)) {
        comparison.projections[metric][name] = data.projections[metric];
      }
    }

    return comparison;
  }

  /**
   * Export scenario data for external use
   */
  export(format = 'json') {
    const data = {
      simulator: this.name,
      useCase: this.useCase,
      generatedAt: new Date().toISOString(),
      comparison: this.getComparison()
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    return data;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FinancialCalculator,
    ScenarioBuilder,
    AIServiceDeliveryModel,
    BusinessSimulator
  };
}
