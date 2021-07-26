import { Pick } from './picks.model';

export interface Prop {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  league: string;
  user_id: number;
  fan_picks_count: number;
  utm_term_tag: string | null;
  utm_content_tag: string | null;
  close_time: string | null;
  close_time_id: string | null;
  publisher_id: string | null;
  slug: string;
  proposition: string;
  status: string;
  picks: Pick[] | null;
}
