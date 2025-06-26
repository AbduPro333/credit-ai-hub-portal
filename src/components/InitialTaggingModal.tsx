
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagInput } from "./TagInput";
import { Loader2 } from "lucide-react";

interface InitialTaggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  selectedCount: number;
  isLoading: boolean;
  userId: string;
}

export const InitialTaggingModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading,
  userId
}: InitialTaggingModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleConfirm = () => {
    onConfirm(selectedTags);
  };

  const handleClose = () => {
    setSelectedTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Initial Tags</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add tags to apply to the {selectedCount} selected contact{selectedCount !== 1 ? 's' : ''} before importing.
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
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Contacts...
              </>
            ) : (
              `Add ${selectedCount} Contact${selectedCount !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
