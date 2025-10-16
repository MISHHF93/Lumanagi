<<<<<<< HEAD
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
=======
import { apiClient, ApiError } from './client'
import {
  entityRegistry,
  getSeedData,
  generateEntityId,
  type BaseEntity,
  type ContractMetric,
  type TokenAnalytic,
  type Market,
  type OracleFeed,
  type AdminLog,
  type Alert,
  type ComplianceMetric,
  type SecurityIncident,
  type TrustBoundaryEvent,
  type TemporalAnomaly,
  type SimulationScenario,
  type AIFeedback,
  type ComplianceEvidence,
  type EntityName,
  type EntityDefinition,
  type UserProfile,
  fallbackUsers,
  defaultUserProfile
} from '@/lib/entities'

const memoryStore = new Map<string, BaseEntity[]>()
const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

type ListResponse<T> = { data?: T[]; items?: T[] } & Record<string, unknown>

type EntityResource<T extends BaseEntity> = {
  list: (orderBy?: string, limit?: number) => Promise<T[]>
  get: (id: string) => Promise<T | null>
  create: (payload: Partial<T>) => Promise<T>
  update: (id: string, payload: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
}

const STORAGE_PREFIX = 'lumanagi-entity'

function getStorageKey(definition: EntityDefinition<BaseEntity>, name: EntityName) {
  return `${STORAGE_PREFIX}:${definition.storageKey || name}`
}

function readFromStore<T extends BaseEntity>(definition: EntityDefinition<T>, name: EntityName): T[] {
  const key = getStorageKey(definition as EntityDefinition<BaseEntity>, name)

  if (memoryStore.has(key)) {
    return memoryStore.get(key)! as T[]
  }

  if (storageAvailable) {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as T[]
        memoryStore.set(key, parsed)
        return parsed
      }
    } catch (error) {
      console.warn('Unable to read entity data from storage', error)
    }
  }

  const seed = (definition.seedData ?? getSeedData<T>(name)) as T[]
  memoryStore.set(key, seed)
  return seed
}

function writeToStore<T extends BaseEntity>(definition: EntityDefinition<T>, name: EntityName, value: T[]) {
  const key = getStorageKey(definition as EntityDefinition<BaseEntity>, name)
  memoryStore.set(key, value)
  if (storageAvailable) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Unable to persist entity data', error)
    }
  }
}

function sortRecords<T extends BaseEntity>(records: T[], orderBy?: string, fallback?: keyof T) {
  if (!records.length) return records

  const key = orderBy?.replace(/^[-+]/, '') as keyof T | undefined
  const direction = orderBy?.startsWith('-') ? -1 : 1
  const sortKey = key ?? fallback ?? ('created_at' as keyof T)

  return [...records].sort((a, b) => {
    const first = a[sortKey]
    const second = b[sortKey]
    if (first === second) return 0
    if (first === undefined || first === null) return 1
    if (second === undefined || second === null) return -1
    return first > second ? direction : -direction
  })
}

function createEntityResource<T extends BaseEntity>(name: EntityName, definition: EntityDefinition<T>): EntityResource<T> {
  const fallbackKey = (definition.sortKey ?? 'created_at') as keyof T

  return {
    async list(orderBy?: string, limit?: number) {
      try {
        const response = await apiClient.get<T[]>(definition.endpoint, {
          params: {
            orderBy,
            limit
          }
        })
        const data = (response.data as unknown as ListResponse<T>).items || response.data
        if (Array.isArray(data)) {
          writeToStore(definition, name, data)
          return limit ? data.slice(0, limit) : data
        }
      } catch (error) {
        console.warn(`Falling back to local data for ${name}`, error)
      }

      const records = readFromStore(definition, name)
      const sorted = sortRecords(records, orderBy, fallbackKey)
      return limit ? sorted.slice(0, limit) : sorted
    },

    async get(id: string) {
      try {
        const response = await apiClient.get<T>(`${definition.endpoint}/${id}`)
        return response.data
      } catch (error) {
        const records = readFromStore(definition, name)
        return records.find((record) => record.id === id) ?? null
      }
    },

    async create(payload: Partial<T>) {
      try {
        const response = await apiClient.post<T>(definition.endpoint, payload)
        const created = response.data
        const records = readFromStore(definition, name)
        writeToStore(definition, name, sortRecords([...records, created], `-${fallbackKey}`))
        return created
      } catch (error) {
        const now = new Date().toISOString()
        const localRecord = {
          ...(payload as T),
          id: (payload as T)?.id ?? generateEntityId(name.toLowerCase()),
          created_at: now,
          updated_at: now
        } as T

        if ('created_date' in localRecord && !localRecord.created_date) {
          ;(localRecord as Partial<SimulationScenario> & Partial<ContractMetric>).created_date = now
        }

        if ('executed_at' in localRecord && !localRecord.executed_at) {
          ;(localRecord as Partial<SimulationScenario>).executed_at = now
        }

        if ('triggered_at' in localRecord && !localRecord.triggered_at) {
          ;(localRecord as Partial<Alert>).triggered_at = now
        }

        const records = readFromStore(definition, name)
        writeToStore(definition, name, sortRecords([...records, localRecord], `-${fallbackKey}`))
        return localRecord
      }
    },

    async update(id: string, payload: Partial<T>) {
      try {
        const response = await apiClient.put<T>(`${definition.endpoint}/${id}`, payload)
        const updated = response.data
        const records = readFromStore(definition, name)
        const merged = records.map((record) => (record.id === id ? { ...record, ...updated } : record))
        writeToStore(definition, name, merged)
        return updated
      } catch (error) {
        const records = readFromStore(definition, name)
        const updated = records.map((record) =>
          record.id === id ? { ...record, ...payload, updated_at: new Date().toISOString() } : record
        )
        writeToStore(definition, name, updated)
        const entity = updated.find((record) => record.id === id)
        if (!entity) {
          throw new ApiError(`Entity ${id} not found in offline store`)
        }
        return entity
      }
    },

    async remove(id: string) {
      try {
        await apiClient.delete(`${definition.endpoint}/${id}`)
      } catch (error) {
        console.warn(`Remote delete failed for ${name}, falling back to local removal`, error)
      }

      const records = readFromStore(definition, name)
      writeToStore(definition, name, records.filter((record) => record.id !== id))
    }
  }
}

export const ContractMetric = createEntityResource<ContractMetric>('ContractMetric', entityRegistry.ContractMetric)
export const TokenAnalytic = createEntityResource<TokenAnalytic>('TokenAnalytic', entityRegistry.TokenAnalytic)
export const Market = createEntityResource<Market>('Market', entityRegistry.Market)
export const OracleFeed = createEntityResource<OracleFeed>('OracleFeed', entityRegistry.OracleFeed)
export const AdminLog = createEntityResource<AdminLog>('AdminLog', entityRegistry.AdminLog)
export const Alert = createEntityResource<Alert>('Alert', entityRegistry.Alert)
export const ComplianceMetric = createEntityResource<ComplianceMetric>('ComplianceMetric', entityRegistry.ComplianceMetric)
export const SecurityIncident = createEntityResource<SecurityIncident>('SecurityIncident', entityRegistry.SecurityIncident)
export const TrustBoundaryEvent = createEntityResource<TrustBoundaryEvent>('TrustBoundaryEvent', entityRegistry.TrustBoundaryEvent)
export const TemporalAnomaly = createEntityResource<TemporalAnomaly>('TemporalAnomaly', entityRegistry.TemporalAnomaly)
export const SimulationScenario = createEntityResource<SimulationScenario>('SimulationScenario', entityRegistry.SimulationScenario)
export const AIFeedback = createEntityResource<AIFeedback>('AIFeedback', entityRegistry.AIFeedback)
export const ComplianceEvidence = createEntityResource<ComplianceEvidence>('ComplianceEvidence', entityRegistry.ComplianceEvidence)
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)

export const User = {
  async me(): Promise<UserProfile> {
    try {
<<<<<<< HEAD
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
=======
      const response = await apiClient.get<UserProfile>('/auth/me')
      return response.data
    } catch (error) {
      console.warn('Falling back to default user profile', error)
      return defaultUserProfile
    }
  },
  async list(): Promise<UserProfile[]> {
    try {
      const response = await apiClient.get<UserProfile[]>('/auth/users')
      return (response.data as unknown as ListResponse<UserProfile>).items || response.data
    } catch (error) {
      console.warn('Falling back to local user directory', error)
      return fallbackUsers
    }
  },
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout request failed', error)
    }
  },
  async updateMyUserData(payload: Partial<UserProfile> & { settings?: Record<string, unknown> }): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/auth/me', payload)
      return response.data
    } catch (error) {
      console.warn('Falling back to local user update', error)
      return {
        ...defaultUserProfile,
        ...payload,
        updated_at: new Date().toISOString()
      }
    }
  },
  async fallback(): Promise<UserProfile> {
    return defaultUserProfile
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)
  }
}
