
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactsSearchBarProps {
  searchQuery: string;
  searchField: string;
  onSearchQueryChange: (query: string) => void;
  onSearchFieldChange: (field: string) => void;
  onClearSearch: () => void;
  className?: string;
}

const searchFields = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone_number", label: "Phone" },
  { value: "company_name", label: "Company" },
  { value: "contact_position", label: "Position" },
  { value: "address", label: "Address" },
  { value: "status", label: "Status" }
];

export const ContactsSearchBar = ({
  searchQuery,
  searchField,
  onSearchQueryChange,
  onSearchFieldChange,
  onClearSearch,
  className
}: ContactsSearchBarProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchQueryChange(localSearchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchQueryChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    onClearSearch();
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search contacts by ${searchFields.find(f => f.value === searchField)?.label.toLowerCase() || 'field'}...`}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Select value={searchField} onValueChange={onSearchFieldChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Search field" />
        </SelectTrigger>
        <SelectContent>
          {searchFields.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
