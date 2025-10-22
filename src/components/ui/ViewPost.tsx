import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import ReactMarkdown from "react-markdown";
import AuthorBio from "./AuthorBio";
import Share from "./Share";
import Comment from "./comment";
import CreateAccountModal from "./CreateAccountModal";
import CategoryBadge from "./CategoryBadge";


function ViewPost() {
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [postNotFound, setPostNotFound] = useState(false);
  const { postId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [author, setAuthor] = useState("");
  const [authorUsername, setAuthorUsername] = useState("");
  const [authorProfilePic, setAuthorProfilePic] = useState("");
  const [authorIntroduction, setAuthorIntroduction] = useState("");

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://leoshin-blog-app-api-with-db.vercel.app/posts/${postId}`
      );
      const post = response.data.data;
      setImg(post.image);
      setTitle(post.title);
      setDate(post.published_at || post.created_at);
      setDescription(post.description);
      setCategory(post.categories?.name || post.category);
      setCategoryId(post.category_id);
      setContent(post.content);
      setLikes(post.likes || 0);
      setAuthor(post.users?.name || "Unknown");
      setAuthorUsername(post.users?.username || "unknown");
      setAuthorProfilePic(post.users?.profile_pic || "");
      setAuthorIntroduction(post.users?.introduction || "");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      // Check if it's a 404 error (post not found)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setPostNotFound(true);
        // Redirect to 404 page after a short delay
        setTimeout(() => {
          navigate("/404", { replace: true });
        }, 1000);
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (postNotFound) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-600">Redirecting to 404 page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 container md:px-8 pb-20 md:pb-28 md:pt-8 lg:pt-16 ">
      <div className="space-y-4 md:px-4">
        {img && (
          <img
            src={img}
            alt={title}
            className="md:rounded-lg object-cover w-full h-[260px] sm:h-[340px] md:h-[587px]"
          />
        )}
      </div>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:w-3/4 space-y-8">
          <article className="px-4">
            <div className="flex">
              <CategoryBadge 
                category={category} 
                categoryId={categoryId}
                className="mb-2"
              />
              <span className="px-3 py-1 text-sm font-normal text-muted-foreground">
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-4 mb-10">{description}</p>
            <div className="markdown">
              <ReactMarkdown>
                {content}
            </ReactMarkdown>
            </div>
          </article>
          <div className="xl:hidden px-4">
            <AuthorBio 
              authorName={author}
              authorUsername={authorUsername}
              authorProfilePic={authorProfilePic}
              authorIntroduction={authorIntroduction}
            />
          </div>
          <Share postId={postId || ""} likesAmount={likes} setDialogState={setIsDialogOpen}/>
          <Comment postId={postId || ""} setDialogState={setIsDialogOpen}/>

        
        </div>
        <div className="hidden xl:block xl:w-1/4">
          <div className="sticky top-4">
            <AuthorBio 
              authorName={author}
              authorUsername={authorUsername}
              authorProfilePic={authorProfilePic}
              authorIntroduction={authorIntroduction}
            />
          </div>
        </div>

      </div>
      <CreateAccountModal
        dialogState={isDialogOpen}
        setDialogState={setIsDialogOpen}
      />
    </div>
  )
}

export default ViewPost;
