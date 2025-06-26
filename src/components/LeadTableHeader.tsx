
import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadTableHeaderProps {
  allKeys: string[];
  allAvailableSelected: boolean;
  availableContactsCount: number;
  onSelectAll: (checked: boolean) => void;
}

export const LeadTableHeader: React.FC<LeadTableHeaderProps> = ({
  allKeys,
  allAvailableSelected,
  availableContactsCount,
  onSelectAll
}) => {
  const formatHeader = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  };

  return (
    <TableRow>
      <TableHead className="w-12">
        <Checkbox
          checked={allAvailableSelected}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          disabled={availableContactsCount === 0}
        />
      </TableHead>
      {allKeys.map((key) => (
        <TableHead key={key} className="text-muted-foreground">
          {formatHeader(key)}
        </TableHead>
      ))}
    </TableRow>
  );
};
