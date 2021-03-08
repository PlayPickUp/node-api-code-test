interface PostBody {
  post_title: string;
  league: { leagues: string };
  prop_id: number;
  article_url: string;
  headline: string;
  excerpt: string;
  featured_img: string;
  publisher_name: string;
  author_id: number | string | null;
  publisher_id: number | string | null;
  publisher_source_url: string | null;
  publisher_logo: string | null;
}

export interface Post extends PostBody {
  id: number;
  published_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

export type PostCreate = PostBody;

export interface PostUpdate extends PostBody {
  id: string | number;
  updated_at: Date | null;
}
