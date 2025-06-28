import { useState, useEffect, useRef } from "react";
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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user's available tags
  useEffect(() => {
    const fetchUserTags = async () => {
      const { data, error } = await supabase
        .from('user_tags')
        .select('tag_name')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAvailableTags(data.map(tag => tag.tag_name));
      }
    };

    if (userId) {
      fetchUserTags();
    }
  }, [userId]);

  // Filter suggestions based on input or show initial suggestions
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else if (isFocused) {
      // Show first 5 available tags when focused but no input
      const initialSuggestions = availableTags
        .filter(tag => !selectedTags.includes(tag))
        .slice(0, 5);
      setSuggestions(initialSuggestions);
      setShowSuggestions(initialSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, availableTags, selectedTags, isFocused]);

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
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
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Type to search tags..."
          className="w-full h-9"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg z-50 max-h-32 overflow-y-auto mt-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                type="button"
                className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {selectedTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllTags}
          type="button"
          className="text-xs h-6 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};
