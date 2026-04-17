import { v4 as uuidv4 } from 'uuid';

export const STORAGE_KEYS = {
  MOOD_RECORDS: 'mood_tree_hole_records_v1',
  SMALL_HAPPIES: 'mood_tree_hole_happiness_v1',
  SMALL_HAPPY_RECORDS: 'mood_tree_hole_happiness_records_v1',
  USER_MEMORY: 'mood_tree_hole_memory_v1',
  SETTINGS: 'mood_tree_hole_settings_v1',
} as const;

class StorageService {
  private static instance: StorageService;
  private writeQueue: Map<string, unknown> = new Map();
  private writeTimer: number | null = null;

  private constructor() {}

  static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setDebounced(key: string, value: unknown, delay = 500): void {
    this.writeQueue.set(key, value);
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = window.setTimeout(() => {
      this.writeQueue.forEach((v, k) => {
        localStorage.setItem(k, JSON.stringify(v));
      });
      this.writeQueue.clear();
    }, delay);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  generateId(): string {
    return uuidv4();
  }
}

export const storage = StorageService.getInstance();
