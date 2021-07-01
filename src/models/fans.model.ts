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
