import { apiClient } from './client';
import type { AccountCheckRequest, AccountCheckResult } from '@/types';


export async function checkAccount(payload: AccountCheckRequest): Promise<AccountCheckResult> {
  const { data } = await apiClient.post<AccountCheckResult>('/account-check', payload);
  return data;
}


export async function getBankList(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/account-check/banks');
  return data;
}
