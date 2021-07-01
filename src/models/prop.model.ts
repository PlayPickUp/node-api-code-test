export interface Prop {
  id: string;
  created_at: Date;
  updated_at: Date;
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
}
