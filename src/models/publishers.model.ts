export interface Publisher {
  id: number;
  name: string;
  source_url: string;
  embed_title: string;
  embed_subtitle: string;
  logo: string;
  display_url: string;
  access_token: string;
  published_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}