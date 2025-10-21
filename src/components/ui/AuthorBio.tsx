

interface AuthorBioProps {
  authorName?: string;
  authorUsername?: string;
  authorProfilePic?: string;
  authorIntroduction?: string;
}

function AuthorBio({ 
  authorName = "UnKnown", 
  authorProfilePic = "https://gdhzlflnjkhdmveayqne.supabase.co/storage/v1/object/public/post-images/public/post-1761054110626-amin11ghasemi.gif",
  authorIntroduction = "UnKnown"
}: AuthorBioProps) {
    return (
      <div className="bg-[#EFEEEB] rounded-3xl p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            {authorProfilePic ? (
              <img
                src={authorProfilePic}
                alt={authorName}
                className="object-cover w-16 h-16"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-lg font-semibold">
                  {authorName?.charAt(0) || "A"}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm">Author</p>
            <h3 className="text-2xl font-bold">{authorName}</h3>
          </div>
        </div>
        <hr className="border-gray-300 mb-4" />
        <div className="text-muted-foreground space-y-4">
          <p>{authorIntroduction}</p>
        </div>
      </div>
    );
  }

export default AuthorBio;