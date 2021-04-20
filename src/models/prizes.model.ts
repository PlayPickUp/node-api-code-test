import {Fan} from "./fans.model";

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
}

export enum PrizeStatus {
  Available= "Available Now",
  ComingSoon= "Coming Soon"
}

export interface PrizeCode {
  id: number;
  prize_id: number;
  fan_id?: number;
  code: string;
  redeemed_at: Date | null;
  expiration_date: Date | null;
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
  codes: string[]
  prize_id: number
  expiration_date: Date | null;
}

export interface CreatePrizeCodesResponse {
  created: number
  failed: string[]
}

export interface RedeemPrizeCodesResponse {
  assignedToFan: boolean
  emailSent: boolean
}

export interface RedeemPrizeCodesRequest {
  prize_id: number;
  fan: Fan;
  update_profile: boolean;
}

export interface RedemptionDateDTO {
  prizeId: number;
  nextRedemption: string;
}
