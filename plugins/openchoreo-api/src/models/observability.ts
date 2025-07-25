/**
 * Observability API models and types
 * @public
 */

/**
 * Request for fetching component logs
 * @public
 */
export interface ComponentLogsPostRequest {
  componentId: string;
  environmentId: string;
  logLevels?: string[];
  startTime?: string;
  endTime?: string;
  limit?: number;
  offset?: number;
}

/**
 * Response containing runtime logs data
 * @public
 */
export interface RuntimeLogsResponse {
  logs: LogEntry[];
  totalCount: number;
  tookMs: number;
}

/**
 * Individual log entry
 * @public
 */
export interface LogEntry {
  timestamp: string;
  log: string;
  logLevel: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  componentId: string;
  environmentId: string;
  projectId: string;
  version: string;
  versionId: string;
  namespace: string;
  podId: string;
  containerName: string;
  labels: Record<string, string>;
}