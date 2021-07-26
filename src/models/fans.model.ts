export interface Fan {
  id: number;
  persistence_token?: string;
  first_name?: string;
  last_name?: string;
  username: string;
  email?: string;
  points: number;
  marketplace_pts: number;
}

export interface PrizePurchaseRequest {
  fan_id: number;
  points_cost: number;
}

export interface FanPick {
  id?: number;
  fan_id: number | null;
  pick_id: number;
  created_at: Date | string;
  updated_at?: Date | string;
  prop_id: number;
  frozen_fan_pick_popularity: number;
  short_url: string;
  frozen_points: number | null;
  graded_at: Date | null;
  graded_sms_sent_at: Date | null;
  claimed_sms_sent_at: Date | null;
  source_url: string;
  publisher_id: number;
  ip_address: string | null;
  zip_code: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  time_zone: string | null;
  geo_location: string | null;
}
