type PostTitle = string;
type League = { leagues: string };
type PropId = number;
type ArticleURL = string;
type Headline = string;
type Excerpt = string;
type FeaturedImg = string;
type PublisherName = string;
type AuthorID = number | string | null;
type PublisherID = number | string | null;
type PublisherSourceURL = string | null;
type PublisherLogo = string | null;
export type PostID = number | string;
type PostUpdatedAt = Date | null;
type PostDeletedAt = Date | null;

interface PostBody {
  post_title: PostTitle;
  league: League;
  prop_id: PropId;
  article_url: ArticleURL;
  headline: Headline;
  excerpt: Excerpt;
  featured_img: FeaturedImg;
  publisher_name: PublisherName;
  author_id: AuthorID;
  publisher_id: PublisherID;
  publisher_source_url: PublisherSourceURL;
  publisher_logo: PublisherLogo;
  slug?: string;
}

export interface Post extends PostBody {
  id: PostID;
  published_at: Date;
  updated_at?: PostUpdatedAt;
  deleted_at?: PostDeletedAt;
}

export type PostCreate = PostBody;

export interface PostUpdate extends PostBody {
  id: PostID;
  updated_at: PostUpdatedAt;
}

export interface PostPatch {
  id: PostID;
  updated_at?: PostUpdatedAt;
  post_title?: PostTitle;
  league?: League;
  prop_id?: PropId;
  article_url?: ArticleURL;
  headline?: Headline;
  excerpt?: Excerpt;
  featured_img?: FeaturedImg;
  publisher_name?: PublisherName;
  author_id?: AuthorID;
  publisher_id?: PublisherID;
  publisher_source_url?: PublisherSourceURL;
  publisher_logo?: PublisherLogo;
}
