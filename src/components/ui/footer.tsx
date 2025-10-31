import { useState } from "react";
import { Mail } from "lucide-react";
import { SiLinkedin, SiGithub } from "react-icons/si";
import ComingSoonModal from "./ComingSoonModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIconType, setModalIconType] = useState<"linkedin" | "github" | "email">("linkedin");

  const handleIconClick = (iconType: "linkedin" | "github" | "email") => {
    setModalIconType(iconType);
    setIsModalOpen(true);
  };

  return (
    <>
      <footer className="bg-[var(--brown-200)]">
        <div className="container mx-auto py-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <span className="font-medium text-[var(--brown-500)]">Get in touch</span>
            <div className="flex space-x-4">
              <button
                onClick={() => handleIconClick("linkedin")}
                className="hover:text-muted-foreground transition-colors cursor-pointer"
                aria-label="LinkedIn"
              >
                <SiLinkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </button>
              <button
                onClick={() => handleIconClick("github")}
                className="hover:text-muted-foreground transition-colors cursor-pointer"
                aria-label="GitHub"
              >
                <SiGithub size={24} />
                <span className="sr-only">GitHub</span>
              </button>
              <button
                onClick={() => handleIconClick("email")}
                className="hover:text-muted-foreground transition-colors cursor-pointer"
                aria-label="Email"
              >
                <Mail size={24} />
                <span className="sr-only">Email</span>
              </button>
            </div>
          </div>
          <a href="/" className="hover:text-muted-foreground font-medium underline">
            Home page
          </a>
        </div>
      </footer>
      <ComingSoonModal
        dialogState={isModalOpen}
        setDialogState={setIsModalOpen}
        iconType={modalIconType}
      />
    </>
  );
}

