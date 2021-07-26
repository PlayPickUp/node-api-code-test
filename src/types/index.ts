// non model types go here!

export interface CreateFanPick {
  fan_id?: string | number | null;
  pick_id: string | number;
  prop_id: string | number;
  source_url: string;
  ip_address: string;
  publisher_id: string | number;
}

interface IPInfoASN {
  asn: string;
  name: string;
  domain: string;
  route: string;
  type: string;
}

export interface IPInfoPayload {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  asn: IPInfoASN;
}
