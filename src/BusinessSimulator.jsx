import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Download } from 'lucide-react';

/**
 * Business Simulator - AI Service Delivery for Life Sciences & Healthcare
 * Full-featured scenario modeling tool with constraints and advanced metrics
 */

const FinancialCalculator = {
  calculateNPV: (cashFlows, discountRate = 0.1) => {
    return cashFlows.reduce((sum, cf, period) => {
      return sum + cf / Math.pow(1 + discountRate, period);
    }, 0);
  },

  calculateIRR: (cashFlows, initialGuess = 0.1, maxIterations = 100, tolerance = 0.0001) => {
    let rate = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
      const npv = FinancialCalculator.calculateNPV(cashFlows, rate);
      const npvDerivative = cashFlows.reduce((sum, cf, period) => {
        return sum - period * cf / Math.pow(1 + rate, period + 1);
      }, 0);

      if (Math.abs(npv) < tolerance) return rate;
      if (Math.abs(npvDerivative) < tolerance) return null;

      rate = rate - npv / npvDerivative;
    }
    return rate;
  },

  calculateBreakeven: (cashFlows) => {
    let cumulative = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulative += cashFlows[i];
      if (cumulative >= 0) return i;
    }
    return null;
  }
};

const AIServiceDeliveryModel = (scenario, months = 36) => {
  const {
    initialRevenue = 100000,
    monthlyGrowthRate = 0.05,
    initialHeadcount = 5,
    headcountGrowthRate = 0.03,
    baseCostPerEmployee = 12000,
    costInflation = 0.02,
    operatingCostMultiplier = 0.15,
    churnRate = 0.05,
    discountRate = 0.1
  } = scenario.assumptions;

  const projections = {
    months: [],
    revenue: [],
    operatingCosts: [],
    ebitda: [],
    cashFlow: [],
    cumulativeCF: [],
    headcount: [],
  };

  let revenue = initialRevenue;
  let headcount = initialHeadcount;
  let cumulativeCF = 0;

  for (let month = 0; month < months; month++) {
    const monthlyRevenue = revenue * (1 - churnRate);
    revenue = monthlyRevenue + monthlyRevenue * monthlyGrowthRate;

    headcount = Math.round(headcount * (1 + headcountGrowthRate));

    const salaries = headcount * baseCostPerEmployee * Math.pow(1 + costInflation, month / 12);
    const operatingCosts = revenue * operatingCostMultiplier + salaries;
    const ebitda = revenue - operatingCosts;
    const capex = revenue * 0.02;
    const cashFlow = ebitda - capex;
    cumulativeCF += cashFlow;

    projections.months.push(month + 1);
    projections.revenue.push(Math.round(revenue));
    projections.operatingCosts.push(Math.round(operatingCosts));
    projections.ebitda.push(Math.round(ebitda));
    projections.cashFlow.push(Math.round(cashFlow));
    projections.cumulativeCF.push(Math.round(cumulativeCF));
    projections.headcount.push(headcount);
  }

  const npv = FinancialCalculator.calculateNPV(projections.cashFlow, discountRate);
  const irr = FinancialCalculator.calculateIRR(projections.cashFlow);
  const breakeven = FinancialCalculator.calculateBreakeven(projections.cashFlow);

  const avgEBITDA = projections.ebitda.reduce((a, b) => a + b, 0) / projections.ebitda.length;
  const avgRevenue = projections.revenue.reduce((a, b) => a + b, 0) / projections.revenue.length;
  const avgMargin = (avgEBITDA / avgRevenue * 100).toFixed(1);

  const finalRevenue = projections.revenue[projections.revenue.length - 1];
  const finalEBITDA = projections.ebitda[projections.ebitda.length - 1];
  const finalMargin = (finalEBITDA / finalRevenue * 100).toFixed(1);

  return {
    projections,
    metrics: {
      npv: Math.round(npv),
      irr: irr ? (irr * 100).toFixed(1) : 'N/A',
      breakeven: breakeven,
      avg_ebitda_margin: avgMargin,
      final_year_margin: finalMargin,
      final_year_revenue: Math.round(finalRevenue),
      final_year_ebitda: Math.round(finalEBITDA),
      total_cash_generated: Math.round(projections.cumulativeCF[projections.cumulativeCF.length - 1])
    }
  };
};

export default function BusinessSimulator() {
  const [scenarios, setScenarios] = useState({
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
    Baseline: {
      assumptions: {
        initialRevenue: 100000,
        monthlyGrowthRate: 0.05,
        initialHeadcount: 5,
        headcountGrowthRate: 0.03,
        baseCostPerEmployee: 12000,
        costInflation: 0.02,
        operatingCostMultiplier: 0.15,
        churnRate: 0.05,
        discountRate: 0.1
      }
    },
    Upside: {
      assumptions: {
        initialRevenue: 100000,
        monthlyGrowthRate: 0.08,
        initialHeadcount: 5,
        headcountGrowthRate: 0.04,
        baseCostPerEmployee: 12000,
        costInflation: 0.02,
        operatingCostMultiplier: 0.12,
        churnRate: 0.02,
        discountRate: 0.08
      }
    }
  });

  const [expandedAssumptions, setExpandedAssumptions] = useState({});
  const [projectionMonths, setProjectionMonths] = useState(36);

  const projections = useMemo(() => {
    const results = {};
    for (const [name, scenario] of Object.entries(scenarios)) {
      results[name] = AIServiceDeliveryModel(scenario, projectionMonths);
    }
    return results;
  }, [scenarios, projectionMonths]);

  const chartData = useMemo(() => {
    if (!projections.Baseline) return [];

    const { months } = projections.Baseline.projections;
    return months.map((month, idx) => ({
      month: `M${month}`,
      Conservative_Revenue: projections.Conservative?.projections.revenue[idx] || 0,
      Baseline_Revenue: projections.Baseline?.projections.revenue[idx] || 0,
      Upside_Revenue: projections.Upside?.projections.revenue[idx] || 0,
      Conservative_EBITDA: projections.Conservative?.projections.ebitda[idx] || 0,
      Baseline_EBITDA: projections.Baseline?.projections.ebitda[idx] || 0,
      Upside_EBITDA: projections.Upside?.projections.ebitda[idx] || 0,
      Conservative_CumulativeCF: projections.Conservative?.projections.cumulativeCF[idx] || 0,
      Baseline_CumulativeCF: projections.Baseline?.projections.cumulativeCF[idx] || 0,
      Upside_CumulativeCF: projections.Upside?.projections.cumulativeCF[idx] || 0
    }));
  }, [projections]);

  const handleAssumptionChange = (scenario, key, value) => {
    setScenarios(prev => ({
      ...prev,
      [scenario]: {
        ...prev[scenario],
        assumptions: {
          ...prev[scenario].assumptions,
          [key]: parseFloat(value) || 0
        }
      }
    }));
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string' && value === 'N/A') return 'N/A';
    return `$${(Math.round(value / 1000) * 1000).toLocaleString()}`;
  };

  const formatPercent = (value) => `${value}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Business Scenario Simulator
          </h1>
          <p className="text-slate-600">
            AI Service Delivery for Life Sciences & Healthcare
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Projection Period
              </label>
              <select
                value={projectionMonths}
                onChange={(e) => setProjectionMonths(parseInt(e.target.value))}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={12}>12 months</option>
                <option value={24}>24 months</option>
                <option value={36}>36 months (3 years)</option>
                <option value={48}>48 months (4 years)</option>
                <option value={60}>60 months (5 years)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(scenarios).map(([scenarioName, scenario]) => (
            <div
              key={scenarioName}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className={`px-6 py-4 cursor-pointer ${
                  scenarioName === 'Conservative'
                    ? 'bg-orange-50'
                    : scenarioName === 'Upside'
                    ? 'bg-green-50'
                    : 'bg-blue-50'
                }`}
                onClick={() =>
                  setExpandedAssumptions(prev => ({
                    ...prev,
                    [scenarioName]: !prev[scenarioName]
                  }))
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {scenarioName}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${
                      expandedAssumptions[scenarioName] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedAssumptions[scenarioName] && (
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(scenario.assumptions).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          handleAssumptionChange(scenarioName, key, e.target.value)
                        }
                        step={key.includes('Rate') || key.includes('Multiplier') ? 0.01 : 1000}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Metrics</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Metric</th>
                  {['Conservative', 'Baseline', 'Upside'].map((scenario) => (
                    <th key={scenario} className="text-right py-3 px-4 font-semibold text-slate-700">
                      {scenario}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'npv', label: 'NPV', format: 'currency' },
                  { key: 'irr', label: 'IRR', format: 'percent' },
                  { key: 'breakeven', label: 'Breakeven (months)', format: 'number' },
                  { key: 'final_year_margin', label: 'Final Year Margin', format: 'percent' },
                  { key: 'final_year_revenue', label: 'Final Year Revenue', format: 'currency' },
                ].map(({ key, label, format }) => (
                  <tr key={key} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-700">{label}</td>
                    {['Conservative', 'Baseline', 'Upside'].map((scenario) => (
                      <td key={scenario} className="text-right py-3 px-4 text-slate-900">
                        {format === 'currency'
                          ? formatCurrency(projections[scenario]?.metrics[key])
                          : format === 'percent'
                          ? formatPercent(projections[scenario]?.metrics[key])
                          : projections[scenario]?.metrics[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="Conservative_Revenue" stroke="#ea580c" name="Conservative" strokeWidth={2} />
                <Line type="monotone" dataKey="Baseline_Revenue" stroke="#3b82f6" name="Baseline" strokeWidth={2} />
                <Line type="monotone" dataKey="Upside_Revenue" stroke="#10b981" name="Upside" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">EBITDA Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="Conservative_EBITDA" stroke="#ea580c" name="Conservative" strokeWidth={2} />
                <Line type="monotone" dataKey="Baseline_EBITDA" stroke="#3b82f6" name="Baseline" strokeWidth={2} />
                <Line type="monotone" dataKey="Upside_EBITDA" stroke="#10b981" name="Upside" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Cumulative Cash Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="Conservative_CumulativeCF" stroke="#ea580c" name="Conservative" strokeWidth={2} />
                <Line type="monotone" dataKey="Baseline_CumulativeCF" stroke="#3b82f6" name="Baseline" strokeWidth={2} />
                <Line type="monotone" dataKey="Upside_CumulativeCF" stroke="#10b981" name="Upside" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Year {Math.ceil(projectionMonths / 12)} Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Conservative',
                    Revenue: projections.Conservative?.metrics.final_year_revenue,
                    EBITDA: projections.Conservative?.metrics.final_year_ebitda
                  },
                  {
                    name: 'Baseline',
                    Revenue: projections.Baseline?.metrics.final_year_revenue,
                    EBITDA: projections.Baseline?.metrics.final_year_ebitda
                  },
                  {
                    name: 'Upside',
                    Revenue: projections.Upside?.metrics.final_year_revenue,
                    EBITDA: projections.Upside?.metrics.final_year_ebitda
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Revenue" fill="#3b82f6" />
                <Bar dataKey="EBITDA" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Export</h3>
          <button
            onClick={() => {
              const data = {
                simulator: 'AI Service Delivery - Healthcare',
                generatedAt: new Date().toISOString(),
                projectionMonths,
                scenarios: Object.entries(scenarios).map(([name, scenario]) => ({
                  name,
                  ...projections[name]
                }))
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `simulator-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
}
