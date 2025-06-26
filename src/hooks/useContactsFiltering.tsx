
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  company_name: string | null;
  contact_position: string | null;
  address: string | null;
  status: string | null;
  added_at_date: string;
  tags: string[] | null;
}

interface UseContactsFilteringProps {
  userId: string | undefined;
}

export const useContactsFiltering = ({ userId }: UseContactsFilteringProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("added_at_date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId);

      // Apply text search if present
      if (searchQuery.trim()) {
        query = query.ilike(searchField, `%${searchQuery.trim()}%`);
      }

      // Apply tag filtering if present
      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error",
          description: "Failed to load contacts. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error in fetchContacts:', error);
      toast({
        title: "Error",
        description: "Failed to load contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, searchQuery, searchField, selectedTags, sortBy, sortOrder, toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return {
    contacts,
    loading,
    searchQuery,
    searchField,
    selectedTags,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSearchField,
    setSelectedTags,
    clearSearch,
    handleSortChange,
    refetchContacts: fetchContacts
  };
};
