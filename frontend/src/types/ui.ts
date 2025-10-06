import type { RequestStatus } from '../constants/index.js';

export interface FormState {
  title: string;
  seniority?: string;
  companyType?: string;
}

export type AppState =
  | { type: RequestStatus.IDLE }
  | { type: RequestStatus.LOADING }
  | { type: RequestStatus.SUCCESS; data: string; metadata?: Record<string, unknown> }
  | { type: RequestStatus.ERROR; message: string };

export interface CopyState {
  isCopying: boolean;
  copied: boolean;
}

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
}
