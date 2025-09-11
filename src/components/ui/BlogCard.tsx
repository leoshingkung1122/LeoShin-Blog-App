import type { BlogPost } from "../../types/blog";

interface BlogCardProps {
  image: string;
  category: BlogPost["category"];
  title: string;
  description: string;
  author: string;
  date: string;
}

function BlogCard({ image, category, title, description, author, date }: BlogCardProps) {
    return (
      <div className="flex flex-col gap-4">
        <a href="#" className="relative h-[212px] sm:h-[360px]">
          <img
            className="w-full h-full object-cover rounded-md"
            src={image}
            alt={title}
          />
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {category}
            </span>
          </div>
          <a href="#">
            <h2 className="font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 rounded-full mr-2 bg-brown-300 flex items-center justify-center text-brown-600 font-medium">
              {author.charAt(0)}
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