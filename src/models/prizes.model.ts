import { Fan } from './fans.model';

export interface Prize {
  id: number;
  title: string;
  status: PrizeStatus;
  min_days_between_redemptions?: number;
  short_desc: string;
  long_desc: string;
  image: string;
  external_url: string;
  points_cost: number;
  redemption_type: string;
}

export enum PrizeStatus {
  Available = 'Available Now',
  ComingSoon = 'Coming Soon',
}

export interface PrizeCode {
  id: number;
  prize_id: number;
  code: string;
  pin: string | null;
  expiration_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface PrizeRedemption {
  id: number;
  fan_id: number;
  prize_id: number;
  prize_code_id: number;
  redeemed_at: Date;
}

export interface CreatePrizeRequest {
  title: string;
  status: PrizeStatus;
  short_desc: string;
  long_desc: string;
  external_url: string;
  points_cost: number;
}

export interface CreatePrizeCodesRequest {
  codes: string[];
  pins: string[];
  prize_id: number;
  expiration_date: Date | null;
  same_length: boolean;
}

export interface CreatePrizeCodesResponse {
  created: number;
  failed: string[];
  message?: string;
}

export interface RedeemPrizeCodesResponse {
  assignedToFan: boolean;
  emailSent: boolean;
}

export interface RedeemPrizeCodesRequest {
  prize_id: number;
  fan: Fan;
  update_profile: boolean;
}

export interface RedemptionDateDTO {
  prizeId: string;
  nextRedemption: string;
}

export interface PrizeRedemption {
  prize_id: number;
  fan_id: number;
  prize_code_id: number;
  redeemed_at: Date;
  min_days_between_redemptions: number;
}
