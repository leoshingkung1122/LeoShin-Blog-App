import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Articles() {
  return (
    <div className="w-full container mx-auto mb-10">
      <h2 className="text-xl font-bold mb-4 px-4">Latest articles</h2>
      <div className="bg-[var(--brown-200)] px-4 py-4 md:py-3 md:rounded-sm flex flex-col space-y-4 md:flex-row-reverse md:items-center md:space-y-0 md:justify-between shadow-md">
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="py-3 bg-white rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
        </div>
        <div className="md:hidden w-full text-[var(--brown-400)]">
            <h2 className="text-sm font-medium mb-2">Category</h2>
          <Select>
            <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highlight">Highlight</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="inspiration">Inspiration</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:flex space-x-2">
          <button
            className="px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium focus:bg-[var(--brown-300)] focus:text-[var(--brown-500)] cursor-pointer
            "
          >
            Highlight
          </button>
          <button
            className="px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium focus:bg-[var(--brown-300)] focus:text-[var(--brown-500)] cursor-pointer
            "
          >
            Cat
          </button>
          <button
            className="px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium focus:bg-[var(--brown-300)] focus:text-[var(--brown-500)] cursor-pointer
            "
          >
            Inspiration
          </button>
          <button
            className="px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium focus:bg-[var(--brown-300)] focus:text-[var(--brown-500)] cursor-pointer
            "
          >
            General
          </button>
        </div>
      </div>
    </div>
  );
}