import type { AxiosRequestConfig } from 'axios';
import { get, patch, post, del, toApiError } from './apiClient';

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
  created_date?: string;
  updated_date?: string;
  [key: string]: unknown;
}

export interface ContractMetric extends BaseEntity {
  contract_name?: string;
  contract_address?: string;
  status?: string;
  daily_invocations?: number;
  error_rate?: number;
  avg_gas_cost?: number;
  total_value_locked?: number;
}

export interface TokenAnalytic extends BaseEntity {
  symbol?: string;
  amount?: number;
  sentiment?: number;
  confidence?: number;
}

export interface Market extends BaseEntity {
  market_name?: string;
  liquidity?: number;
  open_positions?: number;
  settlement_status?: string;
}

export interface OracleFeed extends BaseEntity {
  feed_name?: string;
  latency_ms?: number;
  status?: string;
  last_updated?: string;
}

export interface AdminLog extends BaseEntity {
  action?: string;
  endpoint?: string;
  status?: string;
  user_role?: string;
  details?: string;
}

export interface Alert extends BaseEntity {
  severity?: string;
  title?: string;
  description?: string;
  is_resolved?: boolean;
}

export interface ComplianceMetric extends BaseEntity {
  framework?: string;
  score?: number;
  owner?: string;
}

export interface SecurityIncident extends BaseEntity {
  incident_type?: string;
  severity?: string;
  resolved?: boolean;
}

export interface RiskAssessment extends BaseEntity {
  category?: string;
  score?: number;
  trend?: 'increasing' | 'stable' | 'decreasing' | string;
}

export interface AIModelMetric extends BaseEntity {
  model_name?: string;
  accuracy?: number;
  drift_score?: number;
}

export interface DataQualityMetric extends BaseEntity {
  dataset?: string;
  completeness?: number;
  freshness_hours?: number;
}

export interface TrustBoundaryEvent extends BaseEntity {
  boundary?: string;
  state?: string;
  details?: string;
}

export interface TemporalAnomaly extends BaseEntity {
  signal?: string;
  delta?: number;
  detected_at?: string;
}

export interface TreasuryTransaction extends BaseEntity {
  tx_hash?: string;
  amount?: number;
  direction?: 'inbound' | 'outbound' | string;
}

export interface SimulationScenario extends BaseEntity {
  scenario_name?: string;
  impact_score?: number;
  status?: string;
}

export interface AIFeedback extends BaseEntity {
  source?: string;
  comment?: string;
  sentiment?: number;
}

export interface ComplianceEvidence extends BaseEntity {
  control_id?: string;
  status?: string;
  attachment_url?: string;
}

export interface Agent extends BaseEntity {
  agent_name?: string;
  responsibility?: string;
  confidence?: number;
}

export interface PolicyState extends BaseEntity {
  policy_name?: string;
  state?: string;
  version?: string;
}

export interface AgentDecisionLog extends BaseEntity {
  decision?: string;
  outcome?: string;
  confidence?: number;
}

export interface ConstitutionalRule extends BaseEntity {
  rule_id?: string;
  description?: string;
  priority?: number;
}

export interface AgentCluster extends BaseEntity {
  cluster_name?: string;
  member_count?: number;
}

export interface MetaAudit extends BaseEntity {
  target?: string;
  scope?: string;
  score?: number;
}

export interface GovernanceProposal extends BaseEntity {
  proposal_title?: string;
  status?: string;
  vote_progress?: number;
}

export interface SystemTrustScore extends BaseEntity {
  domain?: string;
  score?: number;
  tier?: string;
}

export interface UserProfile extends BaseEntity {
  email?: string;
  full_name?: string;
  role?: string;
  settings?: Record<string, unknown>;
}

export interface EntityApi<T extends BaseEntity> {
  list(orderBy?: string, limit?: number, config?: AxiosRequestConfig): Promise<T[]>;
  filter(
    filters?: Record<string, unknown>,
    orderBy?: string,
    limit?: number,
    config?: AxiosRequestConfig
  ): Promise<T[]>;
  get(id: string, config?: AxiosRequestConfig): Promise<T>;
  create(payload: Partial<T>, config?: AxiosRequestConfig): Promise<T>;
  update(id: string, payload: Partial<T>, config?: AxiosRequestConfig): Promise<T>;
  remove(id: string, config?: AxiosRequestConfig): Promise<void>;
}

export interface EntityApiOptions<T extends BaseEntity> {
  resource: string;
  mockData?: T[];
}

type ListPayload<T> = T[] | { items?: T[]; data?: T[]; results?: T[] };

function extractList<T>(payload: ListPayload<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  if (Array.isArray(payload.results)) {
    return payload.results;
  }
  return [];
}

function buildQuery(
  filters?: Record<string, unknown>,
  orderBy?: string,
  limit?: number
): Record<string, unknown> {
  const params: Record<string, unknown> = { ...filters };
  if (orderBy) {
    params.order_by = orderBy;
  }
  if (typeof limit === 'number') {
    params.limit = limit;
  }
  return params;
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 12);
}

export function createEntityApi<T extends BaseEntity>({ resource, mockData }: EntityApiOptions<T>): EntityApi<T> {
  const basePath = resource.startsWith('/') ? resource : `/entities/${resource}`;
  const fallbackStore = mockData ? [...mockData] : undefined;

  return {
    async list(orderBy, limit, config) {
      try {
        const params = buildQuery(undefined, orderBy, limit);
        const data = await get<ListPayload<T>>(basePath, { ...config, params });
        return extractList<T>(data);
      } catch (error) {
        if (fallbackStore) {
          console.warn(`Falling back to mock data for ${resource}`, error);
          return [...fallbackStore];
        }
        throw toApiError(error);
      }
    },
    async filter(filters, orderBy, limit, config) {
      try {
        const params = buildQuery(filters, orderBy, limit);
        const data = await get<ListPayload<T>>(basePath, { ...config, params });
        return extractList<T>(data);
      } catch (error) {
        if (fallbackStore) {
          console.warn(`Falling back to mock data for ${resource}`, error);
          return fallbackStore.filter((item) => {
            if (!filters) {
              return true;
            }
            return Object.entries(filters).every(([key, value]) => item[key] === value);
          });
        }
        throw toApiError(error);
      }
    },
    async get(id, config) {
      try {
        return await get<T>(`${basePath}/${id}`, config);
      } catch (error) {
        if (fallbackStore) {
          const item = fallbackStore.find((entry) => entry.id === id);
          if (item) {
            console.warn(`Returning mock record for ${resource}:${id}`);
            return item;
          }
        }
        throw toApiError(error);
      }
    },
    async create(payload, config) {
      try {
        return await post<T>(basePath, payload, config);
      } catch (error) {
        if (fallbackStore) {
          const created = { id: generateId(), ...payload } as T;
          fallbackStore.push(created);
          console.warn(`Mock create applied for ${resource}`, error);
          return created;
        }
        throw toApiError(error);
      }
    },
    async update(id, payload, config) {
      try {
        return await patch<T>(`${basePath}/${id}`, payload, config);
      } catch (error) {
        if (fallbackStore) {
          const index = fallbackStore.findIndex((item) => item.id === id);
          if (index >= 0) {
            const updated = { ...fallbackStore[index], ...payload } as T;
            fallbackStore[index] = updated;
            console.warn(`Mock update applied for ${resource}:${id}`, error);
            return updated;
          }
        }
        throw toApiError(error);
      }
    },
    async remove(id, config) {
      try {
        await del<void>(`${basePath}/${id}`, config);
      } catch (error) {
        if (fallbackStore) {
          const index = fallbackStore.findIndex((item) => item.id === id);
          if (index >= 0) {
            fallbackStore.splice(index, 1);
            console.warn(`Mock removal applied for ${resource}:${id}`, error);
            return;
          }
        }
        throw toApiError(error);
      }
    }
  };
}

export const AdminLog: EntityApi<AdminLog> = {
  async list(orderBy?, limit?, config?) {
    return await get(`/admin/logs`, { ...config, params: { order_by: orderBy, limit } });
  },
  async filter(filters?, orderBy?, limit?, config?) {
    return await get(`/admin/logs`, { ...config, params: { ...filters, order_by: orderBy, limit } });
  },
  async get(id, config) {
    return await get(`/admin/logs/${id}`, config);
  },
  async create(payload, config) {
    return await post(`/admin/logs`, payload, config);
  },
  async update(id, payload, config) {
    return await patch(`/admin/logs/${id}`, payload, config);
  },
  async remove(id, config) {
    return await del(`/admin/logs/${id}`, config);
  }
};

// Export runtime entity APIs used by the app
export const ContractMetric = createEntityApi<ContractMetric>({ resource: 'contract-metrics' });
export const TokenAnalytic = createEntityApi<TokenAnalytic>({ resource: 'token-analytics' });
export const Market = createEntityApi<Market>({ resource: 'markets' });
export const OracleFeed = createEntityApi<OracleFeed>({ resource: 'oracle-feeds' });
export const Alert = createEntityApi<Alert>({ resource: 'alerts' });

// Minimal User runtime API expected by consumers
export const User = {
  async me(): Promise<UserProfile> {
    try {
      return await get<UserProfile>('/auth/me');
    } catch (error) {
      throw toApiError(error);
    }
  },
  async update(payload: Partial<UserProfile>): Promise<UserProfile> {
    try {
      return await patch<UserProfile>('/auth/me', payload);
    } catch (error) {
      throw toApiError(error);
    }
  },
  async logout(): Promise<void> {
    try {
      await post<void>('/auth/logout');
    } catch (error) {
      throw toApiError(error);
    }
  }
};
