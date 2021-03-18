export interface LogEvent {
  name: string;
  event_timestamp: Date;
  metadata: Record<string, unknown> | null;
}
