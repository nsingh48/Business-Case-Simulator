/**
 * Use Case Templates & Configuration Examples
 * Pre-built scenarios for common AI service delivery models in healthcare
 */

// ============================================================================
// 1. CLINICAL AI IMPLEMENTATION SERVICES
// ============================================================================

const CLINICAL_AI_IMPLEMENTATION = {
  name: 'Clinical AI Implementation Services',
  description: 'Enterprise deployment of diagnostic and clinical decision support AI',
  industry: 'Healthcare Systems',

  baseAssumptions: {
    // Revenue: Large enterprise contracts
    initialRevenue: 200000,        // $200k/month (multi-year contracts)
    monthlyGrowthRate: 0.04,       // 4% organic growth + new clients

    // Headcount: Expert consultants + engineers
    initialHeadcount: 15,
    headcountGrowthRate: 0.03,

    // Costs: Specialized talent (high salaries)
    baseCostPerEmployee: 18000,    // $18k/month (~$216k/year)
    costInflation: 0.025,

    // Operations: Travel, certifications, compliance
    operatingCostMultiplier: 0.20, // 20% infrastructure/travel

    // Retention: Hospital contracts sticky
    churnRate: 0.02,

    // Discount rate: Conservative for healthcare
    discountRate: 0.12,

    // Utilization: Expert services lower utilization
    utilizationRateCons: 0.60,
    utilizationRateBenchmark: 0.72,
    utilizationRateUpside: 0.80
  },

  scenarios: {
    Conservative: {
      assumptions: {
        monthlyGrowthRate: 0.02,     // Slow adoption
        headcountGrowthRate: 0.01,   // Minimal hiring
        operatingCostMultiplier: 0.22,
        churnRate: 0.04,
        baseCostPerEmployee: 19000
      },
      constraints: {
        minMargin: 0.25,
        maxChurn: 0.05
      }
    },
    Baseline: {
      assumptions: {},
      constraints: {
        minMargin: 0.30,
        maxChurn: 0.03
      }
    },
    Upside: {
      assumptions: {
        monthlyGrowthRate: 0.07,
        headcountGrowthRate: 0.05,
        operatingCostMultiplier: 0.17,
        churnRate: 0.01,
        baseCostPerEmployee: 17000
      },
      constraints: {
        minMargin: 0.35
      }
    }
  }
};

// ============================================================================
// 2. BIOTECH DATA ANALYTICS & ML SERVICES
// ============================================================================

const BIOTECH_DATA_ANALYTICS = {
  name: 'Biotech Data Analytics & ML Services',
  description: 'Data engineering and ML model development for biotech research',
  industry: 'Biotech/Pharmaceuticals',

  baseAssumptions: {
    // Revenue: Project + retainer mix
    initialRevenue: 120000,        // $120k/month
    monthlyGrowthRate: 0.06,       // 6% growth (R&D budgets less cyclical)

    // Headcount: Data scientists + engineers
    initialHeadcount: 8,
    headcountGrowthRate: 0.04,

    // Costs: Academic pay scale
    baseCostPerEmployee: 14000,
    costInflation: 0.02,

    // Operations: Cloud compute, licenses
    operatingCostMultiplier: 0.25, // 25% (significant cloud/infra costs)

    // Retention: Longer project cycles
    churnRate: 0.03,

    discountRate: 0.11,

    utilizationRateCons: 0.68,
    utilizationRateBenchmark: 0.76,
    utilizationRateUpside: 0.82
  },

  scenarios: {
    Conservative: {
      assumptions: {
        monthlyGrowthRate: 0.03,
        operatingCostMultiplier: 0.28,
        churnRate: 0.05
      },
      constraints: {
        minMargin: 0.20
      }
    },
    Baseline: {
      assumptions: {},
      constraints: {
        minMargin: 0.28
      }
    },
    Upside: {
      assumptions: {
        monthlyGrowthRate: 0.09,
        operatingCostMultiplier: 0.22,
        churnRate: 0.01,
        initialHeadcount: 10
      },
      constraints: {
        minMargin: 0.35
      }
    }
  }
};

// ============================================================================
// 3. PATIENT ENGAGEMENT & DIGITAL HEALTH PLATFORM
// ============================================================================

const PATIENT_ENGAGEMENT_PLATFORM = {
  name: 'Patient Engagement & Digital Health Platform',
  description: 'AI-powered patient communication and engagement platform',
  industry: 'Digital Health/Healthcare Technology',

  baseAssumptions: {
    // Revenue: Mostly SaaS (high margin, high growth)
    initialRevenue: 80000,         // $80k/month
    monthlyGrowthRate: 0.10,       // 10% strong SaaS growth

    // Headcount: Lean tech team
    initialHeadcount: 6,
    headcountGrowthRate: 0.05,

    // Costs: Lower cost structure
    baseCostPerEmployee: 10000,    // Mix of engineers and support
    costInflation: 0.02,

    // Operations: Cloud + customer support
    operatingCostMultiplier: 0.18,

    // Retention: SaaS customers stickier but some churn
    churnRate: 0.04,

    discountRate: 0.10,

    utilizationRateCons: 0.70,
    utilizationRateBenchmark: 0.80,
    utilizationRateUpside: 0.88
  },

  scenarios: {
    Conservative: {
      assumptions: {
        monthlyGrowthRate: 0.06,
        churnRate: 0.07,
        headcountGrowthRate: 0.02
      },
      constraints: {
        minMargin: 0.35
      }
    },
    Baseline: {
      assumptions: {},
      constraints: {
        minMargin: 0.45
      }
    },
    Upside: {
      assumptions: {
        monthlyGrowthRate: 0.14,
        churnRate: 0.02,
        operatingCostMultiplier: 0.15
      },
      constraints: {
        minMargin: 0.55
      }
    }
  }
};

// ============================================================================
// 4. REGULATORY & COMPLIANCE AUTOMATION
// ============================================================================

const REGULATORY_COMPLIANCE_AUTOMATION = {
  name: 'Regulatory & Compliance Automation Services',
  description: 'AI-powered regulatory document review and compliance automation',
  industry: 'Life Sciences/Healthcare Regulatory',

  baseAssumptions: {
    // Revenue: Niche market, high-value contracts
    initialRevenue: 150000,
    monthlyGrowthRate: 0.05,

    // Headcount: Small expert team
    initialHeadcount: 4,
    headcountGrowthRate: 0.02,

    // Costs: Highly specialized roles (expensive)
    baseCostPerEmployee: 20000,    // Former regulators, PhDs
    costInflation: 0.025,

    // Operations: Compliance, training
    operatingCostMultiplier: 0.16,

    // Retention: Sticky relationships
    churnRate: 0.02,

    discountRate: 0.13,            // Higher risk

    utilizationRateCons: 0.55,     // Expert availability
    utilizationRateBenchmark: 0.68,
    utilizationRateUpside: 0.78
  },

  scenarios: {
    Conservative: {
      assumptions: {
        monthlyGrowthRate: 0.02,
        churnRate: 0.04,
        headcountGrowthRate: 0.01
      },
      constraints: {
        minMargin: 0.30
      }
    },
    Baseline: {
      assumptions: {},
      constraints: {
        minMargin: 0.40
      }
    },
    Upside: {
      assumptions: {
        monthlyGrowthRate: 0.08,
        churnRate: 0.01,
        operatingCostMultiplier: 0.14
      },
      constraints: {
        minMargin: 0.48
      }
    }
  }
};

// ============================================================================
// 5. AI TRAINING DATA ANNOTATION & LABELING
// ============================================================================

const TRAINING_DATA_ANNOTATION = {
  name: 'AI Training Data Annotation & Labeling',
  description: 'Medical image annotation and healthcare data labeling services',
  industry: 'AI Data Services',

  baseAssumptions: {
    // Revenue: Volume-based, lower margins
    initialRevenue: 100000,
    monthlyGrowthRate: 0.08,

    // Headcount: Large QA team
    initialHeadcount: 20,          // Many annotators
    headcountGrowthRate: 0.06,     // Rapid scaling

    // Costs: Lower-cost operations, outsourcing
    baseCostPerEmployee: 5000,     // Mix of contractors/team
    costInflation: 0.015,

    // Operations: Tools, QA, training
    operatingCostMultiplier: 0.12,

    // Retention: Transactional relationships
    churnRate: 0.06,

    discountRate: 0.10,

    utilizationRateCons: 0.75,
    utilizationRateBenchmark: 0.85,
    utilizationRateUpside: 0.92
  },

  scenarios: {
    Conservative: {
      assumptions: {
        monthlyGrowthRate: 0.04,
        churnRate: 0.09,
        headcountGrowthRate: 0.03
      },
      constraints: {
        minMargin: 0.10
      }
    },
    Baseline: {
      assumptions: {},
      constraints: {
        minMargin: 0.20
      }
    },
    Upside: {
      assumptions: {
        monthlyGrowthRate: 0.12,
        churnRate: 0.03,
        headcountGrowthRate: 0.08
      },
      constraints: {
        minMargin: 0.28
      }
    }
  }
};

// ============================================================================
// EXPORT TEMPLATES
// ============================================================================

const USE_CASE_TEMPLATES = {
  CLINICAL_AI_IMPLEMENTATION,
  BIOTECH_DATA_ANALYTICS,
  PATIENT_ENGAGEMENT_PLATFORM,
  REGULATORY_COMPLIANCE_AUTOMATION,
  TRAINING_DATA_ANNOTATION
};

/**
 * Helper function to get template by key
 */
function getTemplate(key) {
  return USE_CASE_TEMPLATES[key] || null;
}

/**
 * Helper function to list all templates
 */
function listTemplates() {
  return Object.entries(USE_CASE_TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
    industry: template.industry
  }));
}

/**
 * Example: Initialize simulator with template
 */
function initializeWithTemplate(templateKey) {
  const template = getTemplate(templateKey);
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  // In a full implementation, this would use BusinessSimulator
  return {
    name: template.name,
    baseAssumptions: template.baseAssumptions,
    scenarios: template.scenarios
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    USE_CASE_TEMPLATES,
    getTemplate,
    listTemplates,
    initializeWithTemplate,
    // Individual exports
    CLINICAL_AI_IMPLEMENTATION,
    BIOTECH_DATA_ANALYTICS,
    PATIENT_ENGAGEMENT_PLATFORM,
    REGULATORY_COMPLIANCE_AUTOMATION,
    TRAINING_DATA_ANNOTATION
  };
}
