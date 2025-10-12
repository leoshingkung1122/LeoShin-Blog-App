import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

function DropdownMenuDemo() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="sm:hidden focus:outline-none">
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:hidden w-screen rounded-none mt-4 flex flex-col gap-6 py-10 px-6">
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-4 rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
        >
          Log in
        </button>
        <button
          onClick={() => navigate("/SignUp")}
          className="px-8 py-4 bg-foreground text-center text-white rounded-full hover:bg-muted-foreground transition-colors"
        >
          Sign up
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuDemo;
