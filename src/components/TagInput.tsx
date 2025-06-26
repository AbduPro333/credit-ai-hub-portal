
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagBadge } from "./TagBadge";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  userId: string;
  className?: string;
}

export const TagInput = ({ selectedTags, onTagsChange, userId, className }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTags, setUserTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch user's existing tags
  useEffect(() => {
    const fetchUserTags = async () => {
      const { data, error } = await supabase
        .from('user_tags')
        .select('tag_name')
        .eq('user_id', userId);
      
      if (!error && data) {
        setUserTags(data.map(tag => tag.tag_name));
      }
    };

    if (userId) {
      fetchUserTags();
    }
  }, [userId]);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = userTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, userTags, selectedTags]);

  const addTag = async (tagName: string) => {
    if (!tagName.trim() || selectedTags.includes(tagName)) return;

    // Add to user_tags if it doesn't exist
    if (!userTags.includes(tagName)) {
      const { error } = await supabase
        .from('user_tags')
        .insert({ user_id: userId, tag_name: tagName });
      
      if (!error) {
        setUserTags(prev => [...prev, tagName]);
      }
    }

    onTagsChange([...selectedTags, tagName]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const canCreateNew = inputValue.trim() && !userTags.includes(inputValue.trim()) && !selectedTags.includes(inputValue.trim());

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            removable
            onRemove={() => removeTag(tag)}
          />
        ))}
      </div>
      
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search or create tags..."
          className="w-full"
        />
        
        {showSuggestions && (suggestions.length > 0 || canCreateNew) && (
          <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
            
            {canCreateNew && (
              <button
                onClick={() => addTag(inputValue.trim())}
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors flex items-center gap-2 border-t"
              >
                <Plus className="h-4 w-4 text-primary" />
                <span>Create new tag: <strong>"{inputValue.trim()}"</strong></span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
