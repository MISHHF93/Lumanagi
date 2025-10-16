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

export const User = {
  async me(): Promise<UserProfile> {
    try {
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
  }
}
