
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagBadge } from "./TagBadge";
import { supabase } from "@/integrations/supabase/client";
import { Tags, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactsTagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  userId: string;
  className?: string;
}

export const ContactsTagFilter = ({
  selectedTags,
  onTagsChange,
  userId,
  className
}: ContactsTagFilterProps) => {
  const [inputValue, setInputValue] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch user's available tags
  useEffect(() => {
    const fetchUserTags = async () => {
      const { data, error } = await supabase
        .from('user_tags')
        .select('tag_name')
        .eq('user_id', userId);
      
      if (!error && data) {
        setAvailableTags(data.map(tag => tag.tag_name));
      }
    };

    if (userId) {
      fetchUserTags();
    }
  }, [userId]);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableTags, selectedTags]);

  const addTag = (tagName: string) => {
    if (!tagName.trim() || selectedTags.includes(tagName)) return;
    onTagsChange([...selectedTags, tagName]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Tags</span>
        </div>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              removable
              onRemove={() => removeTag(tag)}
              variant="default"
            />
          ))}
        </div>
      )}
      
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type to search tags..."
          className="w-full"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
