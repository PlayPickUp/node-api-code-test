export interface Post {
  id: number;
  post_title: string;
  league: Array<string>;
  prop_id: number;
  article_url: string;
  headline: string;
  excerpt: string;
  featured_img: string;
  published_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface PostCreate {
  post_title: string;
  league: Array<string>;
  prop_id: number;
  article_url: string;
  headline: string;
  excerpt: string;
  featured_img: string;
}
