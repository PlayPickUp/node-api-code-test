export interface Pick {
  id: string | number;
  title: string;
  created_at: Date;
  updated_at?: Date | null;
  state: 'pending' | 'closed' | 'graded_false' | 'graded_true' | 'disqualified';
  fan_picks_count: string | number;
  user_id: string | number;
  graded_at: Date | null;
  pick_popularity: number;
}
