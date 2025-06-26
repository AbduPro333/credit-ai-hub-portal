
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ContactSelectionRowProps {
  lead: any;
  index: number;
  allKeys: string[];
  isAdded: boolean;
  isSelected: boolean;
  onContactSelection: (index: number, checked: boolean) => void;
}

export const ContactSelectionRow: React.FC<ContactSelectionRowProps> = ({
  lead,
  index,
  allKeys,
  isAdded,
  isSelected,
  onContactSelection
}) => {
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) {
      return value.map((item, idx) => {
        if (typeof item === 'object') {
          return Object.values(item).join(' - ');
        }
        return item;
      }).join('; ');
    }
    if (typeof value === 'object') {
      return Object.values(value).filter(v => v !== null && v !== undefined).join(', ') || '-';
    }
    return String(value);
  };

  return (
    <TableRow 
      className={cn(
        isAdded && "opacity-50 bg-muted/50"
      )}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onContactSelection(index, !!checked)}
          disabled={isAdded}
        />
      </TableCell>
      {allKeys.map((key) => (
        <TableCell 
          key={key} 
          className={cn(
            "text-foreground",
            isAdded && "text-muted-foreground"
          )}
        >
          {formatCellValue(lead[key])}
        </TableCell>
      ))}
    </TableRow>
  );
};
