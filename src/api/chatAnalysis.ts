import { apiClient } from './client';
import type { AnalysisProgress, ChatAnalysisJob, ChatAnalysisResult } from '@/types';


export async function uploadChatImages(files: File[]): Promise<ChatAnalysisJob> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const { data } = await apiClient.post<ChatAnalysisJob>('/chat-analysis/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}


export async function getAnalysisProgress(jobId: string): Promise<AnalysisProgress> {
  const { data } = await apiClient.get<AnalysisProgress>(`/chat-analysis/jobs/${jobId}/progress`);
  return data;
}


export async function getChatAnalysisResult(jobId: string): Promise<ChatAnalysisResult> {
  const { data } = await apiClient.get<ChatAnalysisResult>(`/chat-analysis/jobs/${jobId}/result`);
  return data;
}
