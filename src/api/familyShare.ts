import { apiClient } from './client';
import type { ShareMethod, ShareSummary } from '@/types';


export async function getShareSummary(): Promise<ShareSummary> {
  const { data } = await apiClient.get<ShareSummary>('/family-share/summary');
  return data;
}


export async function createShareLink(method: ShareMethod): Promise<{ url: string }> {
  const { data } = await apiClient.post<{ url: string }>('/family-share/links', { method });
  return data;
}
