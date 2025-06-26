
import React from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { ContactSelectionRow } from "./ContactSelectionRow";
import { LeadTableHeader } from "./LeadTableHeader";
import { AddContactsButton } from "./AddContactsButton";

interface LeadTableProps {
  leads: any[];
  selectedContacts: Set<number>;
  addedContacts: Set<number>;
  onContactSelection: (index: number, checked: boolean) => void;
  onSelectAll: (leads: any[], checked: boolean) => void;
  onAddToContacts: () => void;
  isAddingContacts: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedContacts,
  addedContacts,
  onContactSelection,
  onSelectAll,
  onAddToContacts,
  isAddingContacts
}) => {
  if (leads.length === 0) return null;

  const allKeys = Array.from(new Set(leads.flatMap(lead => Object.keys(lead))));
  
  const availableContacts = leads.filter((_, index) => !addedContacts.has(index));
  const availableIndexes = leads
    .map((_, index) => index)
    .filter(index => !addedContacts.has(index));
  
  const allAvailableSelected = availableIndexes.length > 0 && 
    availableIndexes.every(index => selectedContacts.has(index));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <LeadTableHeader
              allKeys={allKeys}
              allAvailableSelected={allAvailableSelected}
              availableContactsCount={availableContacts.length}
              onSelectAll={(checked) => onSelectAll(leads, checked)}
            />
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <ContactSelectionRow
                key={index}
                lead={lead}
                index={index}
                allKeys={allKeys}
                isAdded={addedContacts.has(index)}
                isSelected={selectedContacts.has(index)}
                onContactSelection={onContactSelection}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center pt-4">
        <AddContactsButton
          selectedCount={selectedContacts.size}
          onAddToContacts={onAddToContacts}
          isAddingContacts={isAddingContacts}
        />
      </div>
    </div>
  );
};
