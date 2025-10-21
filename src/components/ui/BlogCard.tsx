import type { BlogPost } from "../../types/blog";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "./CategoryBadge";

interface BlogCardProps {
  id: number;
  image: string;
  category: BlogPost["category"];
  categoryId?: number;
  title: string;
  description: string;
  author: string;
  authorUsername?: string;
  authorProfilePic?: string;
  authorIntroduction?: string;
  date: string;
}

function BlogCard({ id, image, category, categoryId, title, description, author, authorProfilePic, date }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(`/post/${id}`)}
        className="relative h-[212px] sm:h-[360px]"
      >
        <img
          className="w-full h-full object-cover rounded-md"
          src={image}
          alt={title}
        />
      </button>
      <div className="flex flex-col">
        <div className="flex">
          <CategoryBadge 
            category={category} 
            categoryId={categoryId}
            className="mb-2"
          />
        </div>
        <button onClick={() => navigate(`/post/${id}`)}>
          <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
            {title}
          </h2>
        </button>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <div className="flex items-center text-sm">
          <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
            {authorProfilePic ? (
              <img
                className="w-8 h-8 object-cover"
                src={authorProfilePic}
                alt={author}
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-semibold">
                  {author?.charAt(0) || "A"}
                </span>
              </div>
            )}
          </div>
          <span>{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;