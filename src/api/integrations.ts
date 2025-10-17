
import type { AxiosRequestConfig } from 'axios';
import { post, toApiError } from '@/lib/apiClient';

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

async function integrationPost<T>(
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    return await post<T>(url, payload, config);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function InvokeLLM(payload: InvokeLLMPayload): Promise<string> {
  const data = await integrationPost<InvokeLLMResponse | string>(
    '/integrations/core/invoke-llm',
    payload
  );

  if (typeof data === 'string') {
    return data;
  }
  return data.response;
}

export async function SendEmail(payload: EmailPayload): Promise<void> {
  await integrationPost<void>('/integrations/core/send-email', payload);
}

export async function UploadFile(payload: FileUploadPayload): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append('file', payload.file, payload.filename);
  if (payload.contentType) {
    formData.append('contentType', payload.contentType);
  }
  if (payload.metadata) {
    formData.append('metadata', JSON.stringify(payload.metadata));
  }

  return integrationPost<{ id: string }>('/integrations/core/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
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
  formData.append('file', payload.file, payload.filename);
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

