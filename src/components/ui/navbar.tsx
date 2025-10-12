import DropdownMenuDemo from "./DropdownMenuDemo";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <header className="bg-[var(--brown-100)] border-b">
      <nav className="container mx-auto flex items-center justify-between py-4 px-8">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          LeoShin<span className="text-green-500">.</span>
        </button>
        <div className="hidden sm:flex space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors"
          >
            Sign up
          </button>
        </div>
        <DropdownMenuDemo />
      </nav>
    </header>
  );
}

export default NavBar;
