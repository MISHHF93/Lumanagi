import {
  createEntityApi,
  type AIFeedback,
  type AdminLog,
  type Agent,
  type AgentCluster,
  type AgentDecisionLog,
  type AIModelMetric,
  type Alert,
  type ComplianceEvidence,
  type ComplianceMetric,
  type ContractMetric,
  type DataQualityMetric,
  type EntityApiOptions,
  type GovernanceProposal,
  type Market,
  type MetaAudit,
  type OracleFeed,
  type PolicyState,
  type RiskAssessment,
  type SecurityIncident,
  type SimulationScenario,
  type SystemTrustScore,
  type TemporalAnomaly,
  type TokenAnalytic,
  type TreasuryTransaction,
  type TrustBoundaryEvent,
  type UserProfile,
  type ConstitutionalRule
} from '@/lib/entities';
import { get, patch, post, toApiError } from '@/lib/apiClient';

type EntityConfig<T> = EntityApiOptions<T>;

const mockContracts: ContractMetric[] = [
  {
    id: 'contract-001',
    contract_name: 'Core Governance Controller',
    contract_address: '0x8c9F2A87b61004C2E1c92B1Fe3434F987cce0010',
    status: 'healthy',
    daily_invocations: 148,
    error_rate: 0.7,
    avg_gas_cost: 0.021,
    total_value_locked: 482_000,
    created_date: new Date().toISOString()
  },
  {
    id: 'contract-002',
    contract_name: 'Emergency Response Orchestrator',
    contract_address: '0x1B9d7f83c0126A198ab85D3dA273c4F9b33a0021',
    status: 'paused',
    daily_invocations: 64,
    error_rate: 1.9,
    avg_gas_cost: 0.034,
    total_value_locked: 128_500,
    created_date: new Date().toISOString()
  }
];

const mockTokenAnalytics: TokenAnalytic[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `token-analytic-${index}`,
  symbol: 'LUMA',
  amount: 2000 + index * 42,
  sentiment: 60 + index,
  confidence: 0.7 + index * 0.01
}));

const mockMarkets: Market[] = [
  {
    id: 'market-001',
    market_name: 'Compliance Futures',
    liquidity: 820_000,
    open_positions: 86,
    settlement_status: 'active'
  },
  {
    id: 'market-002',
    market_name: 'Risk Offset Swaps',
    liquidity: 415_000,
    open_positions: 42,
    settlement_status: 'cooldown'
  }
];

const mockOracleFeeds: OracleFeed[] = [
  {
    id: 'oracle-eth',
    feed_name: 'ETH/USD Primary',
    latency_ms: 180,
    status: 'active',
    last_updated: new Date().toISOString()
  },
  {
    id: 'oracle-gas',
    feed_name: 'Polygon Gas Price',
    latency_ms: 210,
    status: 'degraded',
    last_updated: new Date().toISOString()
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    severity: 'high',
    title: 'Oracle latency above threshold',
    description: 'ETH/USD feed latency increased by 15% for the past 12 minutes',
    is_resolved: false
  },
  {
    id: 'alert-002',
    severity: 'medium',
    title: 'Policy evaluation delay',
    description: 'Access control policy computation exceeded SLA',
    is_resolved: false
  }
];

const mockAdminLogs: AdminLog[] = [
  {
    id: 'log-001',
    action: 'Policy Updated',
    endpoint: '/policies/core-governance',
    status: 'success',
    user_role: 'admin',
    details: 'Updated policy fallback threshold'
  },
  {
    id: 'log-002',
    action: 'Oracle Failover Triggered',
    endpoint: '/oracles/failover',
    status: 'success',
    user_role: 'operator',
    details: 'Activated secondary oracle feed'
  }
];

function entityConfig<T extends { id: string }>(resource: string, mockData?: T[]): EntityConfig<T> {
  return {
    resource,
    mockData
  };
}

export const ContractMetric = createEntityApi<ContractMetric>(entityConfig('contract-metrics', mockContracts));
export const TokenAnalytic = createEntityApi<TokenAnalytic>(entityConfig('token-analytics', mockTokenAnalytics));
export const Market = createEntityApi<Market>(entityConfig('markets', mockMarkets));
export const OracleFeed = createEntityApi<OracleFeed>(entityConfig('oracle-feeds', mockOracleFeeds));
export const AdminLog = createEntityApi<AdminLog>(entityConfig('admin-logs', mockAdminLogs));
export const Alert = createEntityApi<Alert>(entityConfig('alerts', mockAlerts));
export const ComplianceMetric = createEntityApi<ComplianceMetric>(entityConfig('compliance-metrics'));
export const SecurityIncident = createEntityApi<SecurityIncident>(entityConfig('security-incidents'));
export const RiskAssessment = createEntityApi<RiskAssessment>(entityConfig('risk-assessments'));
export const AIModelMetric = createEntityApi<AIModelMetric>(entityConfig('ai-model-metrics'));
export const DataQualityMetric = createEntityApi<DataQualityMetric>(entityConfig('data-quality-metrics'));
export const TrustBoundaryEvent = createEntityApi<TrustBoundaryEvent>(entityConfig('trust-boundary-events'));
export const TemporalAnomaly = createEntityApi<TemporalAnomaly>(entityConfig('temporal-anomalies'));
export const TreasuryTransaction = createEntityApi<TreasuryTransaction>(entityConfig('treasury-transactions'));
export const SimulationScenario = createEntityApi<SimulationScenario>(entityConfig('simulation-scenarios'));
export const AIFeedback = createEntityApi<AIFeedback>(entityConfig('ai-feedback'));
export const ComplianceEvidence = createEntityApi<ComplianceEvidence>(entityConfig('compliance-evidence'));
export const Agent = createEntityApi<Agent>(entityConfig('agents'));
export const PolicyState = createEntityApi<PolicyState>(entityConfig('policy-states'));
export const AgentDecisionLog = createEntityApi<AgentDecisionLog>(entityConfig('agent-decision-logs'));
export const ConstitutionalRule = createEntityApi<ConstitutionalRule>(entityConfig('constitutional-rules'));
export const AgentCluster = createEntityApi<AgentCluster>(entityConfig('agent-clusters'));
export const MetaAudit = createEntityApi<MetaAudit>(entityConfig('meta-audits'));
export const GovernanceProposal = createEntityApi<GovernanceProposal>(entityConfig('governance-proposals'));
export const SystemTrustScore = createEntityApi<SystemTrustScore>(entityConfig('system-trust-scores'));

const FALLBACK_USER: UserProfile = {
  id: 'user-demo',
  email: 'avery.quinn@lumanagi.ai',
  full_name: 'Avery Quinn',
  role: 'admin',
  settings: {
    theme: 'dark',
    language: 'en'
  }
};

const USER_STORAGE_KEY = 'lumanagi.user-profile';

export const User = {
  async me(): Promise<UserProfile> {
    try {
      const profile = await get<UserProfile>('/auth/me');
      persistUser(profile);
      return profile;
    } catch (error) {
      console.warn('Falling back to cached user profile', error);
      const cached = readCachedUser();
      if (cached) {
        return cached;
      }
      persistUser(FALLBACK_USER);
      return FALLBACK_USER;
    }
  },
  async update(payload: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updated = await patch<UserProfile>('/auth/me', payload);
      persistUser(updated);
      return updated;
    } catch (error) {
      throw toApiError(error);
    }
  },
  async updateMyUserData(payload: Partial<UserProfile>): Promise<UserProfile> {
    return User.update(payload);
  },
  async logout(): Promise<void> {
    try {
      await post<void>('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('lumanagi.authToken');
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }
};

function persistUser(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  }
}

function readCachedUser(): UserProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as UserProfile;
  } catch (error) {
    console.error('Failed to parse cached user profile', error);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}
