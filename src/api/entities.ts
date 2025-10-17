import { apiClient } from '@/lib/apiClient';

// Mock seed data (kept from the original file)
const mockContracts = [
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

const mockTokenAnalytics = Array.from({ length: 12 }).map((_, index) => ({
  id: `token-analytic-${index}`,
  symbol: 'LUMA',
  amount: 2000 + index * 42,
  sentiment: 60 + index,
  confidence: 0.7 + index * 0.01,
  created_date: new Date().toISOString()
}));

const mockMarkets = [
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

const mockOracleFeeds = [
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

const mockAlerts = [
  {
    id: 'alert-001',
    severity: 'high',
    title: 'Oracle latency above threshold',
    description: 'ETH/USD feed latency increased by 15% for the past 12 minutes',
    is_resolved: false,
    created_date: new Date().toISOString()
  },
  {
    id: 'alert-002',
    severity: 'medium',
    title: 'Policy evaluation delay',
    description: 'Access control policy computation exceeded SLA',
    is_resolved: false,
    created_date: new Date().toISOString()
  }
];

const mockAdminLogs = [
  {
    id: 'log-001',
    action: 'Policy Updated',
    endpoint: '/policies/core-governance',
    status: 'success',
    user_role: 'admin',
    details: 'Updated policy fallback threshold',
    created_date: new Date().toISOString()
  },
  {
    id: 'log-002',
    action: 'Oracle Failover Triggered',
    endpoint: '/oracles/failover',
    status: 'success',
    user_role: 'operator',
    details: 'Activated secondary oracle feed',
    created_date: new Date().toISOString()
  }
];

// Simple in-memory + localStorage fallback store
type AnyRecord = Record<string, any>;
const memoryStore = new Map<string, AnyRecord[]>();
const storageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const STORAGE_PREFIX = 'lumanagi-entity';

function getStorageKey(name: string) {
  return `${STORAGE_PREFIX}:${name}`;
}

function readFromStore<T extends AnyRecord>(name: string, seed: T[] = []): T[] {
  const key = getStorageKey(name);
  if (memoryStore.has(key)) return memoryStore.get(key)! as T[];

  if (storageAvailable) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T[];
        memoryStore.set(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Unable to read from localStorage', e);
    }
  }

  memoryStore.set(key, seed);
  return seed;
}

function writeToStore<T extends AnyRecord>(name: string, value: T[]) {
  const key = getStorageKey(name);
  memoryStore.set(key, value);
  if (storageAvailable) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Unable to write to localStorage', e);
    }
  }
}

function sortRecords<T extends AnyRecord>(records: T[], orderBy?: string, fallbackKey: string = 'created_date') {
  if (!records || records.length === 0) return records;
  const key = (orderBy || '').replace(/^[-+]/, '') || fallbackKey;
  const direction = (orderBy && orderBy.startsWith('-')) ? -1 : 1;
  return [...records].sort((a, b) => {
    const A = a[key], B = b[key];
    if (A === B) return 0;
    if (A === undefined || A === null) return 1;
    if (B === undefined || B === null) return -1;
    return A > B ? direction : -direction;
  });
}

function createEntityResource(name: string, opts?: { endpoint?: string; seed?: AnyRecord[] }) {
  const endpoint = opts?.endpoint || `/${name}`;
  const storageName = opts?.endpoint ? opts.endpoint.replace(/^\//, '') : name;
  const fallbackSeed = opts?.seed || [];

  return {
    async list(orderBy?: string, limit?: number) {
      try {
        const res = await apiClient.get<any>(endpoint, { params: { orderBy, limit } });
        let data: any[] = [];
        if (res && res.data) {
          // if API returns { items: [...] } use items, otherwise if it's an array use it
          if (Array.isArray(res.data)) {
            data = res.data;
          } else if (typeof res.data === 'object' && 'items' in res.data && Array.isArray((res.data as any).items)) {
            data = (res.data as any).items;
          } else {
            data = [];
          }
        }
        if (Array.isArray(data)) {
          writeToStore(storageName, data);
          return limit ? data.slice(0, limit) : data;
        }
      } catch (e) {
        console.warn(`Remote list failed for ${endpoint}, falling back to local store`, e);
      }
      const records = readFromStore(storageName, fallbackSeed);
      const sorted = sortRecords(records, orderBy);
      return limit ? sorted.slice(0, limit) : sorted;
    },

    async get(id: string) {
      try {
        const res = await apiClient.get<any>(`${endpoint}/${id}`);
        return res.data;
      } catch (e) {
        const records = readFromStore(storageName, fallbackSeed);
        return records.find((r) => r.id === id) || null;
      }
    },

    async create(payload: AnyRecord) {
      try {
        const res = await apiClient.post<any>(endpoint, payload);
        const created = res.data;
        const records = readFromStore(storageName, fallbackSeed);
        writeToStore(storageName, sortRecords([...records, created], `-created_date`));
        return created;
      } catch (e) {
        // fallback: persist locally with generated id
        const now = new Date().toISOString();
        const local = { ...payload, id: payload.id || `${name}-${Date.now()}`, created_date: now, updated_date: now };
        const records = readFromStore(storageName, fallbackSeed);
        writeToStore(storageName, sortRecords([...records, local], `-created_date`));
        return local;
      }
    },

    async update(id: string, payload: AnyRecord) {
      try {
        const res = await apiClient.put<any>(`${endpoint}/${id}`, payload);
        const updated = res.data;
        const records = readFromStore(storageName, fallbackSeed);
        const merged = records.map((r) => (r.id === id ? { ...r, ...updated } : r));
        writeToStore(storageName, merged);
        return updated;
      } catch (e) {
        const records = readFromStore(storageName, fallbackSeed);
        const updated = records.map((r) => (r.id === id ? { ...r, ...payload, updated_date: new Date().toISOString() } : r));
        writeToStore(storageName, updated);
        const entity = updated.find((r) => r.id === id);
        if (!entity) throw new Error(`Entity ${id} not found in offline store`);
        return entity;
      }
    },

    async remove(id: string) {
      try {
        await apiClient.delete(`${endpoint}/${id}`);
      } catch (e) {
        console.warn(`Remote delete failed for ${endpoint}, falling back to local removal`, e);
      }
      const records = readFromStore(storageName, fallbackSeed);
      writeToStore(storageName, records.filter((r) => r.id !== id));
    },

    // convenience filter implementation (basic)
    async filter(criteria: AnyRecord = {}, orderBy?: string, limit?: number) {
      const list = await this.list(orderBy, limit);
      return list.filter((item: AnyRecord) => {
        return Object.entries(criteria).every(([k, v]) => item[k] === v);
      });
    }
  };
}

// Create entity resources using sensible endpoints and seed data
export const ContractMetric = createEntityResource('contract-metrics', { endpoint: '/contract-metrics', seed: mockContracts });
export const TokenAnalytic = createEntityResource('token-analytics', { endpoint: '/token-analytics', seed: mockTokenAnalytics });
export const Market = createEntityResource('markets', { endpoint: '/markets', seed: mockMarkets });
export const OracleFeed = createEntityResource('oracle-feeds', { endpoint: '/oracle-feeds', seed: mockOracleFeeds });
export const AdminLog = createEntityResource('admin-logs', { endpoint: '/admin-logs', seed: mockAdminLogs });
export const Alert = createEntityResource('alerts', { endpoint: '/alerts', seed: mockAlerts });
export const ComplianceMetric = createEntityResource('compliance-metrics', { endpoint: '/compliance-metrics', seed: [] });
export const SecurityIncident = createEntityResource('security-incidents', { endpoint: '/security-incidents', seed: [] });
export const TrustBoundaryEvent = createEntityResource('trust-boundary-events', { endpoint: '/trust-boundary-events', seed: [] });
export const TemporalAnomaly = createEntityResource('temporal-anomalies', { endpoint: '/temporal-anomalies', seed: [] });
export const SimulationScenario = createEntityResource('simulation-scenarios', { endpoint: '/simulation-scenarios', seed: [] });
export const AIFeedback = createEntityResource('ai-feedback', { endpoint: '/ai-feedback', seed: [] });
export const ComplianceEvidence = createEntityResource('compliance-evidence', { endpoint: '/compliance-evidence', seed: [] });

// Simple user handling using local fallback
const FALLBACK_USER = {
  id: 'user-demo',
  email: 'avery.quinn@lumanagi.ai',
  full_name: 'Avery Quinn',
  role: 'admin',
  settings: { theme: 'dark', language: 'en' },
  created_date: new Date().toISOString()
};

const USER_STORAGE_KEY = 'lumanagi.user-profile';

export const User = {
  async me() {
    try {
      const res = await apiClient.get('/auth/me');
      const profile = res.data;
      persistUser(profile);
      return profile;
    } catch (error) {
      console.warn('Falling back to cached/default user profile', error);
      const cached = readCachedUser();
      if (cached) return cached;
      persistUser(FALLBACK_USER);
      return FALLBACK_USER;
    }
  },

  async update(payload: AnyRecord) {
    try {
      const res = await apiClient.patch('/auth/me', payload);
      const updated = res.data;
      persistUser(updated);
      return updated;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore remote errors, always clear local data
      console.warn('Logout remote failed', e);
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('lumanagi.authToken');
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }
};

function persistUser(profile: AnyRecord) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Unable to persist user profile', e);
    }
  }
}

function readCachedUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse cached user', e);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}
