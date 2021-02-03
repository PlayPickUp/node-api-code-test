export interface Prop {
  id: string;
  callout: unknown;
  pack_id: unknown;
  picks_count: number;
  created_at: Date;
  updated_at: Date;
  auto_resolve: boolean;
  prop_type: 'Manual Picks';
  league: string;
  prop_type_opts: unknown;
  user_id: number;
  image: string | null;
  fan_picks_count: number;
  featured_media_title: string | null;
  featured_media_url: string | null;
  summary: string;
  utm_term_tag: string | null;
  utm_content_tag: string | null;
  close_time: string | null;
  close_time_id: string | null;
  publisher_id: string | null;
  meta_source: unknown;
  slug: string;
  proposition: string;
}
