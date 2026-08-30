export type ActivityType = 'chat' | 'account' | 'transfer';

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  title: string;
  summary: string;
  status: string;
  riskScore?: number;
  createdAt: string;
}

export interface SafetySnapshot {
  riskScore: number;
  riskLabel: string;
  analysisCompleted: boolean;
  accountChecked: boolean;
  checklistCompleted: boolean;
  updatedAt: string | null;
}

const HISTORY_KEY = 'financial-ai-history';
const SAFETY_KEY = 'financial-ai-safety-snapshot';
const SAFETY_EVENT = 'financial-ai-safety-updated';

const DEFAULT_SNAPSHOT: SafetySnapshot = {
  riskScore: 0,
  riskLabel: '확인 전',
  analysisCompleted: false,
  accountChecked: false,
  checklistCompleted: false,
  updatedAt: null,
};

export function getHistory(): ActivityRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActivityRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistory(record: Omit<ActivityRecord, 'id' | 'createdAt'>) {
  const next: ActivityRecord = {
    ...record,
    id: `${record.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const history = [next, ...getHistory()].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return next;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getSafetySnapshot(): SafetySnapshot {
  try {
    const raw = localStorage.getItem(SAFETY_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    return { ...DEFAULT_SNAPSHOT, ...(JSON.parse(raw) as Partial<SafetySnapshot>) };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

export function updateSafetySnapshot(patch: Partial<Omit<SafetySnapshot, 'updatedAt'>>) {
  const next: SafetySnapshot = {
    ...getSafetySnapshot(),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SAFETY_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent<SafetySnapshot>(SAFETY_EVENT, { detail: next }));
  return next;
}

export function subscribeSafetySnapshot(callback: (snapshot: SafetySnapshot) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<SafetySnapshot>;
    callback(customEvent.detail ?? getSafetySnapshot());
  };
  const storageHandler = (event: StorageEvent) => {
    if (event.key === SAFETY_KEY) callback(getSafetySnapshot());
  };
  window.addEventListener(SAFETY_EVENT, handler);
  window.addEventListener('storage', storageHandler);
  return () => {
    window.removeEventListener(SAFETY_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
