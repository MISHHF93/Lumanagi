export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
}

export interface ContractMetric extends BaseEntity {
  contract_name: string
  contract_address: string
  status: 'healthy' | 'degraded' | 'paused'
  created_date: string
  last_invocation?: string
  daily_invocations: number
  avg_gas_cost: number
  total_value_locked: number
  error_rate: number
  owner: string
  risk_level: 'low' | 'medium' | 'high'
  sla_score: number
  security_findings: number
}

export interface TokenAnalytic extends BaseEntity {
  symbol: string
  name: string
  price: number
  price_change_24h: number
  volume_24h: number
  volatility: number
  liquidity_score: number
  market_cap: number
}

export interface Market extends BaseEntity {
  market_name: string
  description: string
  current_odds: number
  resolution_date: string
  status: 'open' | 'closed' | 'pending'
  liquidity: number
  participants: number
}

export interface OracleFeed extends BaseEntity {
  feed_name: string
  status: 'online' | 'degraded' | 'offline'
  last_update: string
  total_updates_24h: number
  integrity_score: number
  geographic_region: string
  escalation_contact: string
}

export interface AdminLog extends BaseEntity {
  action: string
  endpoint: string
  status: 'success' | 'failure' | 'warning'
  details?: string
  severity?: 'low' | 'medium' | 'high'
  user_role?: string
  actor?: string
}

export interface Alert extends BaseEntity {
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  acknowledged: boolean
  acknowledged_by?: string
  triggered_at: string
  category: string
}

export interface ComplianceMetric extends BaseEntity {
  control_name: string
  iso_reference: string
  score: number
  owner: string
  status: 'compliant' | 'needs_review' | 'non_compliant'
  updated_at: string
}

export interface SecurityIncident extends BaseEntity {
  incident_type: string
  severity: 'low' | 'medium' | 'high'
  detected_at: string
  resolved: boolean
  affected_system: string
  summary: string
}

export interface TrustBoundaryEvent extends BaseEntity {
  boundary_name: string
  description: string
  detected_at: string
  severity: 'low' | 'medium' | 'high'
  mitigated: boolean
}

export interface TemporalAnomaly extends BaseEntity {
  anomaly_type: string
  observed_at: string
  impact_window_minutes: number
  mitigation: string
}

export interface SimulationScenario extends BaseEntity {
  scenario_name: string
  scenario_type: string
  target_systems: string
  parameters: string
  expected_response: string
  actual_response: string
  response_time_seconds: number
  test_passed: boolean
  findings?: string
  executed_at?: string
  executed_by?: string
  created_date?: string
}

export interface AIFeedback extends BaseEntity {
  feedback_type: string
  model: string
  submitted_by: string
  notes: string
  disposition: 'acknowledged' | 'triaged' | 'shipped'
}

export interface ComplianceEvidence extends BaseEntity {
  control_reference: string
  description: string
  submitted_by: string
  link: string
  approved: boolean
}

export interface UserProfile extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'operator' | 'analyst'
  avatar_url?: string
  status: 'online' | 'offline'
  last_active_at: string
}

export interface EntityDefinition<T extends BaseEntity> {
  endpoint: string
  storageKey: string
  seedData: T[]
  sortKey?: keyof T
}

export type EntityRegistry = {
  ContractMetric: EntityDefinition<ContractMetric>
  TokenAnalytic: EntityDefinition<TokenAnalytic>
  Market: EntityDefinition<Market>
  OracleFeed: EntityDefinition<OracleFeed>
  AdminLog: EntityDefinition<AdminLog>
  Alert: EntityDefinition<Alert>
  ComplianceMetric: EntityDefinition<ComplianceMetric>
  SecurityIncident: EntityDefinition<SecurityIncident>
  TrustBoundaryEvent: EntityDefinition<TrustBoundaryEvent>
  TemporalAnomaly: EntityDefinition<TemporalAnomaly>
  SimulationScenario: EntityDefinition<SimulationScenario>
  AIFeedback: EntityDefinition<AIFeedback>
  ComplianceEvidence: EntityDefinition<ComplianceEvidence>
}

const now = () => new Date().toISOString()

export const defaultUserProfile: UserProfile = {
  id: 'user-default',
  name: 'Ari Governance',
  email: 'ari@lumanagi.ai',
  role: 'admin',
  status: 'online',
  created_at: now(),
  last_active_at: now(),
  avatar_url: 'https://avatar.vercel.sh/ari?size=64'
}

export const fallbackUsers: UserProfile[] = [
  defaultUserProfile,
  {
    id: 'user-operator',
    name: 'Mira Operator',
    email: 'mira@lumanagi.ai',
    role: 'operator',
    status: 'online',
    created_at: now(),
    last_active_at: now(),
    avatar_url: 'https://avatar.vercel.sh/mira?size=64'
  },
  {
    id: 'user-analyst',
    name: 'Ken Analyst',
    email: 'ken@lumanagi.ai',
    role: 'analyst',
    status: 'offline',
    created_at: now(),
    last_active_at: now()
  }
]

export const entityRegistry: EntityRegistry = {
  ContractMetric: {
    endpoint: '/governance/contracts',
    storageKey: 'contract-metrics',
    sortKey: 'created_date',
    seedData: [
      {
        id: 'contract-1',
        contract_name: 'Lumanagi Treasury Manager',
        contract_address: '0xA1C0DE1234567890ABCDEF1234567890ABCDEF12',
        status: 'healthy',
        created_date: now(),
        last_invocation: now(),
        daily_invocations: 1245,
        avg_gas_cost: 0.018,
        total_value_locked: 4250000,
        error_rate: 0.2,
        owner: 'Treasury Ops',
        risk_level: 'low',
        sla_score: 99.2,
        security_findings: 0,
        created_at: now()
      },
      {
        id: 'contract-2',
        contract_name: 'Guardian Control Plane',
        contract_address: '0xBEEF1234567890ABCDEF1234567890ABCDEF1234',
        status: 'degraded',
        created_date: now(),
        last_invocation: now(),
        daily_invocations: 872,
        avg_gas_cost: 0.024,
        total_value_locked: 1320000,
        error_rate: 1.2,
        owner: 'Security',
        risk_level: 'medium',
        sla_score: 96.8,
        security_findings: 2,
        created_at: now()
      }
    ]
  },
  TokenAnalytic: {
    endpoint: '/analytics/tokens',
    storageKey: 'token-analytics',
    sortKey: 'market_cap',
    seedData: [
      {
        id: 'token-lmng',
        symbol: 'LMNG',
        name: 'Lumanagi Token',
        price: 3.42,
        price_change_24h: 4.2,
        volume_24h: 982000,
        volatility: 0.32,
        liquidity_score: 87,
        market_cap: 125000000,
        created_at: now()
      },
      {
        id: 'token-stlmng',
        symbol: 'stLMNG',
        name: 'Staked Lumanagi',
        price: 3.98,
        price_change_24h: 2.1,
        volume_24h: 420000,
        volatility: 0.18,
        liquidity_score: 73,
        market_cap: 87000000,
        created_at: now()
      }
    ]
  },
  Market: {
    endpoint: '/intelligence/markets',
    storageKey: 'markets',
    sortKey: 'resolution_date',
    seedData: [
      {
        id: 'market-1',
        market_name: 'Validator Churn Risk',
        description: 'Probability of validator churn exceeding 10% this quarter',
        current_odds: 0.27,
        resolution_date: now(),
        status: 'open',
        liquidity: 540000,
        participants: 128,
        created_at: now()
      },
      {
        id: 'market-2',
        market_name: 'Treasury Drawdown',
        description: 'Risk of treasury drawdown beyond 5% in next 30 days',
        current_odds: 0.18,
        resolution_date: now(),
        status: 'open',
        liquidity: 320000,
        participants: 96,
        created_at: now()
      }
    ]
  },
  OracleFeed: {
    endpoint: '/core/oracles',
    storageKey: 'oracle-feeds',
    sortKey: 'last_update',
    seedData: [
      {
        id: 'oracle-1',
        feed_name: 'Market Price Oracle',
        status: 'online',
        last_update: now(),
        total_updates_24h: 346,
        integrity_score: 98,
        geographic_region: 'Global',
        escalation_contact: 'oracles@lumanagi.ai',
        created_at: now()
      },
      {
        id: 'oracle-2',
        feed_name: 'Regulatory Feed',
        status: 'degraded',
        last_update: now(),
        total_updates_24h: 124,
        integrity_score: 89,
        geographic_region: 'EMEA',
        escalation_contact: 'compliance@lumanagi.ai',
        created_at: now()
      }
    ]
  },
  AdminLog: {
    endpoint: '/audit/logs',
    storageKey: 'admin-logs',
    sortKey: 'created_at',
    seedData: [
      {
        id: 'log-1',
        action: 'System boot',
        endpoint: '/core/startup',
        status: 'success',
        details: 'Platform boot sequence completed',
        severity: 'low',
        user_role: 'system',
        actor: 'Lumanagi Core',
        created_at: now()
      }
    ]
  },
  Alert: {
    endpoint: '/alerts',
    storageKey: 'alerts',
    sortKey: 'triggered_at',
    seedData: [
      {
        id: 'alert-1',
        title: 'Oracle Latency Spike',
        severity: 'high',
        description: 'Latency exceeded 500ms for oracle feed Market Price Oracle',
        acknowledged: false,
        triggered_at: now(),
        category: 'oracles',
        created_at: now()
      }
    ]
  },
  ComplianceMetric: {
    endpoint: '/compliance/metrics',
    storageKey: 'compliance-metrics',
    sortKey: 'updated_at',
    seedData: [
      {
        id: 'compliance-1',
        control_name: 'Access Reviews',
        iso_reference: 'ISO 27001 A.9.2.5',
        score: 92,
        owner: 'Governance',
        status: 'compliant',
        updated_at: now(),
        created_at: now()
      },
      {
        id: 'compliance-2',
        control_name: 'Model Risk Assessment',
        iso_reference: 'ISO 42001 8.2',
        score: 78,
        owner: 'AI Governance',
        status: 'needs_review',
        updated_at: now(),
        created_at: now()
      }
    ]
  },
  SecurityIncident: {
    endpoint: '/security/incidents',
    storageKey: 'security-incidents',
    seedData: [
      {
        id: 'incident-1',
        incident_type: 'Unauthorized Access Attempt',
        severity: 'medium',
        detected_at: now(),
        resolved: true,
        affected_system: 'Guardian Control Plane',
        summary: 'Blocked unauthorized console login from untrusted network',
        created_at: now()
      }
    ]
  },
  TrustBoundaryEvent: {
    endpoint: '/trust/boundaries',
    storageKey: 'trust-boundary-events',
    seedData: [
      {
        id: 'boundary-1',
        boundary_name: 'Agent Sandbox',
        description: 'Sandbox attempted outbound call blocked by boundary controls',
        detected_at: now(),
        severity: 'low',
        mitigated: true,
        created_at: now()
      }
    ]
  },
  TemporalAnomaly: {
    endpoint: '/intelligence/temporal-anomalies',
    storageKey: 'temporal-anomalies',
    seedData: [
      {
        id: 'anomaly-1',
        anomaly_type: 'Time Drift Detected',
        observed_at: now(),
        impact_window_minutes: 45,
        mitigation: 'Synchronized validators via trusted NTP sources',
        created_at: now()
      }
    ]
  },
  SimulationScenario: {
    endpoint: '/resilience/simulations',
    storageKey: 'simulation-scenarios',
    sortKey: 'executed_at',
    seedData: [
      {
        id: 'scenario-1',
        scenario_name: 'Oracle Failure Drill',
        scenario_type: 'oracle_failure',
        target_systems: 'Market Price Oracle',
        parameters: JSON.stringify({ fallback: 'TWAP', threshold_ms: 500 }),
        expected_response: 'Failover to backup oracle',
        actual_response: 'Failover triggered successfully',
        response_time_seconds: 2.1,
        test_passed: true,
        findings: 'Failover executed within SLA',
        executed_at: now(),
        executed_by: 'ari@lumanagi.ai',
        created_at: now(),
        created_date: now()
      }
    ]
  },
  AIFeedback: {
    endpoint: '/ai/feedback',
    storageKey: 'ai-feedback',
    seedData: [
      {
        id: 'feedback-1',
        feedback_type: 'model_adjustment',
        model: 'Lumanagi-Guardian-v2',
        submitted_by: 'layla@lumanagi.ai',
        notes: 'Model over-weights treasury risk, recommend recalibration',
        disposition: 'acknowledged',
        created_at: now()
      }
    ]
  },
  ComplianceEvidence: {
    endpoint: '/compliance/evidence',
    storageKey: 'compliance-evidence',
    seedData: [
      {
        id: 'evidence-1',
        control_reference: 'ISO 27001 A.12.4',
        description: 'Audit log review for Q1',
        submitted_by: 'noah@lumanagi.ai',
        link: 'https://drive.lumanagi.ai/audit/Q1-review.pdf',
        approved: true,
        created_at: now()
      }
    ]
  }
}

export type EntityName = keyof typeof entityRegistry

export function getSeedData<T extends BaseEntity>(name: EntityName): T[] {
  return entityRegistry[name].seedData as T[]
}

export function generateEntityId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}
