
import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddContactsButtonProps {
  selectedCount: number;
  onAddToContacts: () => void;
  isAddingContacts: boolean;
}

export const AddContactsButton: React.FC<AddContactsButtonProps> = ({
  selectedCount,
  onAddToContacts,
  isAddingContacts
}) => {
  return (
    <Button 
      onClick={onAddToContacts} 
      disabled={selectedCount === 0 || isAddingContacts}
      className={cn(
        "transition-all duration-200",
        selectedCount === 0 
          ? "opacity-50 cursor-not-allowed" 
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      <Users className="h-4 w-4 mr-2" />
      Add {selectedCount} Contact{selectedCount !== 1 ? 's' : ''}
    </Button>
  );
};
