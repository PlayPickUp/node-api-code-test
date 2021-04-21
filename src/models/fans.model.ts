export interface Fan {
  id: number;
  persistence_token?: string;
  first_name?: string;
  last_name?: string;
  username: string;
  hometown?: string;
  email?: string;
  points: number;
}

export interface PrizePurchaseRequest {
  fan_id: number;
  points_cost: number;
}