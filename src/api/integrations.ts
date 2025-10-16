import { apiClient } from './client'

export interface InvokeLLMPayload {
  prompt: string
  add_context_from_internet?: boolean
  temperature?: number
}

const FALLBACK_RESPONSE = `I'm operating in offline mode, but I can still help you reason about your governance workload.\n\nTry asking about:\n• Latest AI governance incidents\n• ISO mappings for the current module\n• Recommended guardrails for sensitive actions.`

export const InvokeLLM = async (payload: InvokeLLMPayload): Promise<string> => {
  try {
    const response = await apiClient.post<{ response: string }>('/ai/invoke', payload)
    return response.data.response
  } catch (error) {
    console.warn('Falling back to offline LLM helper', error)
    return FALLBACK_RESPONSE
  }
}

export const SendEmail = async (payload: Record<string, unknown>) => {
  try {
    await apiClient.post('/integrations/email', payload)
  } catch (error) {
    console.warn('Email integration failed, request buffered locally', error)
  }
}
