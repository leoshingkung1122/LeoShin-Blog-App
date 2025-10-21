export type Category = string;

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category_id: number;
  author_id: string; // UUID is a string
  status_id: number;
  likes: number;
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  // Optional fields for joined data
  category?: string;
  author?: string;
  status?: string;
}

export type FilterCategory = string;
