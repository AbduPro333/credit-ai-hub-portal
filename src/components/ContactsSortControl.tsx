
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactsSortControlProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const sortOptions = [
  { value: "added_at_date", label: "Added Date" },
  { value: "name", label: "Name" }
];

export const ContactsSortControl = ({
  sortBy,
  sortOrder,
  onSortChange,
  className
}: ContactsSortControlProps) => {
  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrderToggle = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortOrderLabel = () => {
    if (sortBy === 'added_at_date') {
      return sortOrder === 'desc' ? 'Newest First' : 'Oldest First';
    } else {
      return sortOrder === 'asc' ? 'A-Z' : 'Z-A';
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        onClick={handleSortOrderToggle}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
        title={getSortOrderLabel()}
      >
        {sortOrder === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        <span className="hidden sm:inline">{getSortOrderLabel()}</span>
      </button>
    </div>
  );
};
