export interface GetFeedsResponse {
  data: Feed[];
  page: number;
  limit: number;
}
export interface Feed {
  id: string;
  title: string;
}

export interface LatestPost {
  title: string;
  tags: string[];
  href: string;
}

export interface PostMetadata {
  commentsCount: number;
  reactionsCount: number;
  bookmarkCount: number;
}
