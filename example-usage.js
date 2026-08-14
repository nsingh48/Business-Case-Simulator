/**
 * Example Usage: Business Simulator
 * Shows how to programmatically initialize, run, and export simulations
 */

// ============================================================================
// EXAMPLE 1: Basic Usage - Clinical AI Implementation
// ============================================================================

function example1_BasicClinicAnalysis() {
  console.log('\n=== EXAMPLE 1: Clinical AI Implementation Analysis ===\n');

  // Step 1: Create simulator
  const simulator = new BusinessSimulator('Healthcare AI Services');

  // Step 2: Initialize with base assumptions
  simulator.initialize({
    initialRevenue: 200000,        // $200k/month starting revenue
    monthlyGrowthRate: 0.05,       // 5% baseline growth
    initialHeadcount: 15,
    headcountGrowthRate: 0.03,
    baseCostPerEmployee: 18000,
    costInflation: 0.025,
    operatingCostMultiplier: 0.20,
    churnRate: 0.03,
    discountRate: 0.12
  });

  // Step 3: Add scenarios
  simulator
    .addScenario('Conservative', {
      monthlyGrowthRate: 0.02,     // Slower growth
      churnRate: 0.05,             // Higher churn
      operatingCostMultiplier: 0.22 // Higher costs
    }, {
      minMargin: 0.25
    })
    .addScenario('Baseline', {}, {
      minMargin: 0.30
    })
    .addScenario('Upside', {
      monthlyGrowthRate: 0.08,     // Faster growth
      churnRate: 0.01,             // Lower churn
      operatingCostMultiplier: 0.17 // Lower costs
    }, {
      minMargin: 0.35
    });

  // Step 4: Run projections
  const results = simulator.runProjections(36); // 36 months

  // Step 5: Display key metrics
  console.log('KEY METRICS COMPARISON\n');
  console.log('Metric          | Conservative | Baseline | Upside');
  console.log('----------------|--------------|----------|----------');

  const formatNum = (n) => (typeof n === 'number' ? n.toFixed(0) : n).padStart(10);

  for (const [name, data] of Object.entries(results)) {
    const metrics = data.metrics;

    // Display key metrics
    if (name === 'Conservative') {
      console.log(`\nNPV ($)         | ${formatNum(metrics.npv)} |`);
      console.log(`IRR (%)         | ${formatNum(metrics.irr)} |`);
      console.log(`Breakeven (mo)  | ${formatNum(metrics.breakeven)} |`);
      console.log(`Final Margin    | ${formatNum(metrics.final_year_margin)}% |`);
    } else if (name === 'Baseline') {
      console.log(` ${formatNum(metrics.npv)} | ${formatNum(metrics.irr)} |`);
      console.log(` ${formatNum(metrics.breakeven)} | ${formatNum(metrics.final_year_margin)} |`);
    } else if (name === 'Upside') {
      console.log(` ${formatNum(metrics.npv)}`);
      console.log(` ${formatNum(metrics.irr)}`);
      console.log(` ${formatNum(metrics.breakeven)}`);
      console.log(` ${formatNum(metrics.final_year_margin)}\n`);
    }
  }

  // Step 6: Get comparison data
  const comparison = simulator.getComparison();
  console.log(`Year 3 Revenue: Conservative $${comparison.metrics.Conservative.final_year_revenue.toLocaleString()}, ` +
              `Baseline $${comparison.metrics.Baseline.final_year_revenue.toLocaleString()}, ` +
              `Upside $${comparison.metrics.Upside.final_year_revenue.toLocaleString()}\n`);

  return simulator;
}

// ============================================================================
// EXAMPLE 2: Use Case Template - Biotech Data Analytics
// ============================================================================

function example2_BiotechDataAnalytics() {
  console.log('\n=== EXAMPLE 2: Biotech Data Analytics & ML Services ===\n');

  // Use pre-built template
  const template = {
    initialRevenue: 120000,
    monthlyGrowthRate: 0.06,
    initialHeadcount: 8,
    headcountGrowthRate: 0.04,
    baseCostPerEmployee: 14000,
    costInflation: 0.02,
    operatingCostMultiplier: 0.25,  // Higher: cloud compute costs
    churnRate: 0.03,
    discountRate: 0.11
  };

  const simulator = new BusinessSimulator('Biotech AI Services');
  simulator.initialize(template);

  // Customize scenarios for biotech risk profile
  simulator
    .addScenario('Conservative', {
      monthlyGrowthRate: 0.03,
      churnRate: 0.05,
      headcountGrowthRate: 0.02
    }, {
      minMargin: 0.20,
      maxHeadcount: 15  // Budget constraint
    })
    .addScenario('Baseline', {}, {
      minMargin: 0.28
    })
    .addScenario('Upside', {
      monthlyGrowthRate: 0.09,
      churnRate: 0.01,
      headcountGrowthRate: 0.06
    }, {
      minMargin: 0.35,
      maxHeadcount: 25  // Capacity constraint
    });

  const results = simulator.runProjections(36);

  console.log('Financial Projections (Biotech Data Services):');
  console.log(`\nConservative: NPV $${results.Conservative.metrics.npv.toLocaleString()}, ` +
              `IRR ${results.Conservative.metrics.irr}%`);
  console.log(`Baseline:     NPV $${results.Baseline.metrics.npv.toLocaleString()}, ` +
              `IRR ${results.Baseline.metrics.irr}%`);
  console.log(`Upside:       NPV $${results.Upside.metrics.npv.toLocaleString()}, ` +
              `IRR ${results.Upside.metrics.irr}%`);

  console.log(`\nYear 3 EBITDA Margins:`);
  console.log(`Conservative: ${results.Conservative.metrics.final_year_margin}%`);
  console.log(`Baseline:     ${results.Baseline.metrics.final_year_margin}%`);
  console.log(`Upside:       ${results.Upside.metrics.final_year_margin}%\n`);

  return simulator;
}

// ============================================================================
// EXAMPLE 3: Sensitivity Analysis
// ============================================================================

function example3_SensitivityAnalysis() {
  console.log('\n=== EXAMPLE 3: Growth Rate Sensitivity Analysis ===\n');

  const baseAssumptions = {
    initialRevenue: 100000,
    monthlyGrowthRate: 0.05,
    initialHeadcount: 5,
    headcountGrowthRate: 0.03,
    baseCostPerEmployee: 12000,
    costInflation: 0.02,
    operatingCostMultiplier: 0.15,
    churnRate: 0.05,
    discountRate: 0.1
  };

  console.log('Growth Rate Impact on NPV:\n');
  console.log('Growth Rate | NPV (36mo) | IRR (%)');
  console.log('------------|-----------|--------');

  const sensitivities = [];

  // Test growth rates from 2% to 12%
  for (let growth = 0.02; growth <= 0.12; growth += 0.02) {
    const sim = new BusinessSimulator(`Sensitivity-${growth}`);
    sim.initialize({
      ...baseAssumptions,
      monthlyGrowthRate: growth
    });

    sim.addScenario('Test', {}, {});
    const result = sim.runProjections(36);

    const npv = result.Test.metrics.npv;
    const irr = result.Test.metrics.irr;

    sensitivities.push({ growth, npv, irr });

    console.log(`  ${(growth * 100).toFixed(0)}%     | $${npv.toLocaleString().padStart(8)} | ${irr}%`);
  }

  // Find inflection point
  const maxNPV = Math.max(...sensitivities.map(s => s.npv));
  const optimalGrowth = sensitivities.find(s => s.npv === maxNPV);

  console.log(`\n✓ Optimal growth rate for NPV: ${(optimalGrowth.growth * 100).toFixed(0)}% ` +
              `(NPV: $${maxNPV.toLocaleString()})\n`);

  return sensitivities;
}

// ============================================================================
// EXAMPLE 4: Scenario Comparison & Export
// ============================================================================

function example4_ComparisonAndExport() {
  console.log('\n=== EXAMPLE 4: Detailed Comparison & Export ===\n');

  const simulator = new BusinessSimulator('Export Test Case');

  simulator.initialize({
    initialRevenue: 150000,
    monthlyGrowthRate: 0.05,
    initialHeadcount: 10,
    headcountGrowthRate: 0.03,
    baseCostPerEmployee: 14000,
    costInflation: 0.02,
    operatingCostMultiplier: 0.16,
    churnRate: 0.04,
    discountRate: 0.10
  });

  simulator
    .addScenario('Conservative', { monthlyGrowthRate: 0.03, churnRate: 0.06 }, {})
    .addScenario('Baseline', {}, {})
    .addScenario('Upside', { monthlyGrowthRate: 0.08, churnRate: 0.02 }, {});

  const results = simulator.runProjections(36);
  const comparison = simulator.getComparison();

  console.log('SCENARIO COMPARISON');
  console.log('===================\n');

  // Create comparison table
  const metrics = [
    'npv', 'irr', 'breakeven', 'final_year_revenue',
    'final_year_ebitda', 'final_year_margin', 'total_cash_generated'
  ];

  for (const metric of metrics) {
    console.log(`${metric}:`);
    for (const scenario of ['Conservative', 'Baseline', 'Upside']) {
      const value = results[scenario].metrics[metric];
      let formatted = value;

      if (typeof value === 'number') {
        if (metric.includes('margin') || metric === 'irr') {
          formatted = `${value}%`;
        } else if (metric !== 'breakeven') {
          formatted = `$${value.toLocaleString()}`;
        } else {
          formatted = `Month ${value}`;
        }
      }

      console.log(`  ${scenario}: ${formatted}`);
    }
    console.log();
  }

  // Show projections array
  console.log('SAMPLE PROJECTIONS (Every 6 months):');
  console.log('====================================\n');

  const projections = results.Baseline.projections;
  console.log('Month | Revenue | EBITDA | Cash Flow | Cum CF');
  console.log('------|---------|--------|-----------|--------');

  for (let i = 0; i < projections.months.length; i += 6) {
    const month = projections.months[i];
    const revenue = projections.revenue[i];
    const ebitda = projections.ebitda[i];
    const cf = projections.cashFlow[i];
    const cumcf = projections.cumulativeCF[i];

    console.log(`  ${month.toString().padStart(2)} | $${(revenue / 1000).toFixed(0)}k | ` +
                `$${(ebitda / 1000).toFixed(0)}k | $${(cf / 1000).toFixed(0)}k | $${(cumcf / 1000).toFixed(0)}k`);
  }

  // Export
  const exportData = simulator.export('json');
  console.log(`\n✓ Exported ${exportData.split('\n').length} lines of JSON data`);

  return { results, comparison, exportData };
}

// ============================================================================
// EXAMPLE 5: Multi-Scenario Funding Analysis
// ============================================================================

function example5_FundingAnalysis() {
  console.log('\n=== EXAMPLE 5: Funding Runway Analysis ===\n');

  const assumptions = {
    initialRevenue: 80000,        // Starting revenue
    monthlyGrowthRate: 0.06,
    initialHeadcount: 6,
    headcountGrowthRate: 0.03,
    baseCostPerEmployee: 12000,
    costInflation: 0.02,
    operatingCostMultiplier: 0.20,
    churnRate: 0.05,
    discountRate: 0.12
  };

  const simulator = new BusinessSimulator('Funding Analysis');
  simulator.initialize(assumptions);

  simulator
    .addScenario('Tight (6mo runway)', {
      monthlyGrowthRate: 0.02,
      churnRate: 0.08,
      operatingCostMultiplier: 0.25
    }, {})
    .addScenario('Normal (12mo runway)', {
      monthlyGrowthRate: 0.06,
      churnRate: 0.05
    }, {})
    .addScenario('Strong (24mo+ runway)', {
      monthlyGrowthRate: 0.10,
      churnRate: 0.02
    }, {});

  const results = simulator.runProjections(36);

  console.log('Funding Runway Requirements:\n');
  console.log('Scenario           | Breakeven Month | Recommended Runway');
  console.log('-------------------|-----------------|-------------------');

  const scenarios = ['Tight (6mo runway)', 'Normal (12mo runway)', 'Strong (24mo+ runway)'];

  for (const scenario of scenarios) {
    const breakeven = results[scenario].metrics.breakeven;
    const recommended = Math.ceil((breakeven || 36) * 1.3); // Add 30% buffer

    console.log(`${scenario.padEnd(18)} |        ${(breakeven || 'N/A').toString().padStart(2)}        | ` +
                `${recommended} months`);
  }

  console.log('\nFunding Recommendation:');
  const normal = results['Normal (12mo runway)'].metrics.breakeven;
  const buffer = Math.ceil(normal * 1.3);
  console.log(`→ Raise ${buffer} months of runway to cover best-case scenario\n`);

  return results;
}

// ============================================================================
// RUNNER
// ============================================================================

function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  BUSINESS SIMULATOR - EXAMPLE USAGE                   ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    example1_BasicClinicAnalysis();
    example2_BiotechDataAnalytics();
    example3_SensitivityAnalysis();
    example4_ComparisonAndExport();
    example5_FundingAnalysis();

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✓ All examples completed successfully!               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error(`\n✗ Error running examples: ${error.message}\n`);
    console.error(error.stack);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    example1_BasicClinicAnalysis,
    example2_BiotechDataAnalytics,
    example3_SensitivityAnalysis,
    example4_ComparisonAndExport,
    example5_FundingAnalysis,
    runAllExamples
  };
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllExamples();
}
