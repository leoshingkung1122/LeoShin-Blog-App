import { Mail } from "lucide-react";
import { SiLinkedin, SiGithub } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[var(--brown-200)]">
      <div className="container mx-auto py-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <span className="font-medium text-[var(--brown-500)]">Get in touch</span>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-muted-foreground">
            <SiLinkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="#" className="hover:text-muted-foreground">
            <SiGithub size={24} />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" className="hover:text-muted-foreground">
            <Mail size={24} />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
      <a href="/" className="hover:text-muted-foreground font-medium underline">
        Home page
      </a>
      </div>
    </footer>
  );
}

