export type Category = "General" | "Cat" | "Inspiration";

export interface BlogPost {
  id: number;
  image: string;
  category: Category;
  title: string;
  description: string;
  author: string;
  date: string;
  likes: number;
  content: string;
}

export type FilterCategory = "highlight" | "cat" | "inspiration" | "general";
