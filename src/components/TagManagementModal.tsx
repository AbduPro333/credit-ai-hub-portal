
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagInput } from "./TagInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";

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

  const isBulkEdit = selectedContacts.length > 1;

  // Initialize tags when modal opens
  useEffect(() => {
    if (isOpen && selectedContacts.length > 0) {
      if (isBulkEdit) {
        // For bulk edit, start with empty tags (replace all behavior)
        setSelectedTags([]);
      } else {
        // For single contact, show existing tags
        const contact = selectedContacts[0];
        setSelectedTags(contact.tags || []);
      }
    }
  }, [isOpen, selectedContacts, isBulkEdit]);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Update tags for all selected contacts with the new tags array
      // This replaces all existing tags for each contact
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
        description: isBulkEdit 
          ? `Tags replaced for ${selectedContacts.length} contacts.`
          : `Tags updated for ${selectedContacts[0].name || 'contact'}.`,
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
    return "Add tags to apply to all selected contacts.";
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
        
        {/* Bulk Edit Warning */}
        {isBulkEdit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                All existing tags on the selected contacts will be replaced with the new tags you add here.
              </p>
            </div>
          </div>
        )}
        
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
