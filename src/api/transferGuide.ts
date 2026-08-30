import { apiClient } from './client';
import type { TransferAmountGuide, TransferChecklistItem } from '@/types';


export async function getTransferAmountGuide(amount: number): Promise<TransferAmountGuide> {
  const { data } = await apiClient.get<TransferAmountGuide>('/transfer-guide/amount-tier', {
    params: { amount },
  });
  return data;
}


export async function getTransferChecklist(amount: number): Promise<TransferChecklistItem[]> {
  const { data } = await apiClient.get<TransferChecklistItem[]>('/transfer-guide/checklist', {
    params: { amount },
  });
  return data;
}


export async function updateChecklistItem(
  itemId: string,
  completed: boolean,
): Promise<TransferChecklistItem> {
  const { data } = await apiClient.patch<TransferChecklistItem>(
    `/transfer-guide/checklist/${itemId}`,
    { completed },
  );
  return data;
}
