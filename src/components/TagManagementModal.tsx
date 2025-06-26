
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagInput } from "./TagInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Contact {
  id: string;
  name: string | null;
  tags: string[] | null;
}

interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContacts: Contact[];
  onTagsUpdated: () => void;
  userId: string;
}

export const TagManagementModal = ({
  isOpen,
  onClose,
  selectedContacts,
  onTagsUpdated,
  userId
}: TagManagementModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize tags when modal opens
  useEffect(() => {
    if (isOpen && selectedContacts.length > 0) {
      // Get common tags across all selected contacts
      const allTags = selectedContacts.flatMap(contact => contact.tags || []);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Only show tags that are present in ALL selected contacts
      const commonTags = Object.entries(tagCounts)
        .filter(([_, count]) => count === selectedContacts.length)
        .map(([tag]) => tag);
      
      setSelectedTags(commonTags);
    }
  }, [isOpen, selectedContacts]);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Update tags for all selected contacts
      const updates = selectedContacts.map(contact => ({
        id: contact.id,
        tags: selectedTags
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('contacts')
          .update({ tags: update.tags })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Tags Updated",
        description: `Tags updated for ${selectedContacts.length} contact${selectedContacts.length !== 1 ? 's' : ''}.`,
      });

      onTagsUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating tags:', error);
      toast({
        title: "Error",
        description: "Failed to update tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    if (selectedContacts.length === 1) {
      return `Manage Tags for ${selectedContacts[0].name || 'Contact'}`;
    }
    return `Manage Tags for ${selectedContacts.length} Contacts`;
  };

  const getModalDescription = () => {
    if (selectedContacts.length === 1) {
      return "Add or remove tags for this contact.";
    }
    return "Tags will be applied to all selected contacts. Remove a tag to remove it from all selected contacts.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {getModalDescription()}
          </p>
        </DialogHeader>
        
        <div className="py-4">
          <TagInput
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            userId={userId}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
