import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search",
  className = ""
}: SearchBarProps) {
  return (
    <div className={`w-full md:max-w-sm ${className}`}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="py-3 bg-white rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
        />
      </div>
    </div>
  );
}
