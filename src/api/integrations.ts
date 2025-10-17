import type { AxiosRequestConfig } from 'axios';
import { apiClient, ApiError } from './client';

export interface InvokeLLMPayload {
  prompt: string;
  model?: string;
  temperature?: number;
  add_context_from_internet?: boolean;
  metadata?: Record<string, unknown>;
}

export interface InvokeLLMResponse {
  response: string;
  tokens_used?: number;
  latency_ms?: number;
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{ filename: string; content: string }>;
}

export interface FileUploadPayload {
  file: File | Blob;
  filename: string;
  contentType?: string;
  metadata?: Record<string, unknown>;
}

export interface SignedUrlResponse {
  uploadUrl: string;
  expiresInSeconds: number;
  headers?: Record<string, string>;
}

const FALLBACK_RESPONSE = `I'm operating in offline mode, but I can still help you reason about your governance workload.\n\nTry asking about:\n• Latest AI governance incidents\n• ISO mappings for the current module\n• Recommended guardrails for sensitive actions.`

async function integrationPost<T>(
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await apiClient.post<T>(url, payload, config);
    return res.data as T;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Integration request failed';
    throw new ApiError(message, error?.response?.status, error?.response?.data);
  }
}

export async function InvokeLLM(payload: InvokeLLMPayload): Promise<string> {
  try {
    const data = await integrationPost<InvokeLLMResponse | string>(
      '/integrations/core/invoke-llm',
      payload
    );

    if (typeof data === 'string') return data;
    return data.response;
  } catch (error) {
    console.warn('InvokeLLM failed, returning fallback response', error);
    return FALLBACK_RESPONSE;
  }
}

export async function SendEmail(payload: EmailPayload): Promise<void> {
  try {
    await integrationPost<void>('/integrations/core/send-email', payload);
  } catch (error) {
    console.warn('SendEmail failed, request not sent', error);
  }
}

export async function UploadFile(payload: FileUploadPayload): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append('file', payload.file as Blob, payload.filename);
  if (payload.contentType) {
    formData.append('contentType', payload.contentType);
  }
  if (payload.metadata) {
    formData.append('metadata', JSON.stringify(payload.metadata));
  }

  try {
    return await integrationPost<{ id: string }>('/integrations/core/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } catch (error) {
    // fallback: throw wrapped error so callers can handle
    throw error;
  }
}

export async function GenerateImage(prompt: string): Promise<{ url: string }> {
  return integrationPost<{ url: string }>('/integrations/core/generate-image', { prompt });
}

export async function ExtractDataFromUploadedFile(fileId: string): Promise<Record<string, unknown>> {
  return integrationPost<Record<string, unknown>>('/integrations/core/extract-file-data', { fileId });
}

export async function CreateFileSignedUrl(
  payload: { filename: string; contentType: string }
): Promise<SignedUrlResponse> {
  return integrationPost<SignedUrlResponse>('/integrations/core/create-signed-url', payload);
}

export async function UploadPrivateFile(payload: FileUploadPayload): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append('file', payload.file as Blob, payload.filename);
  if (payload.metadata) {
    formData.append('metadata', JSON.stringify(payload.metadata));
  }
  return integrationPost<{ id: string }>('/integrations/core/upload-private-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
};
