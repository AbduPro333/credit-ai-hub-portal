
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, Clock, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { addContactsToDatabase, normalizeContactData } from "@/utils/contacts";
import { InitialTaggingModal } from "./InitialTaggingModal";
import { cn } from "@/lib/utils";

interface DynamicOutputProps {
  output: any;
  status: 'pending' | 'success' | 'error' | 'completed';
  outputSchema?: {
    type: string;
    label: string;
    format?: string;
  };
  toolCategory?: string;
}

export const DynamicOutput: React.FC<DynamicOutputProps> = ({
  output,
  status,
  outputSchema,
  toolCategory
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [addedContacts, setAddedContacts] = useState<Set<number>>(new Set());
  const [isAddingContacts, setIsAddingContacts] = useState(false);
  const [showTaggingModal, setShowTaggingModal] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isLeadGenTool = () => {
    return toolCategory?.toLowerCase().includes('lead') || toolCategory?.toLowerCase().includes('gen');
  };

  const isLeadDataArray = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    const firstItem = data[0];
    if (typeof firstItem !== 'object' || firstItem === null) return false;
    
    // Check for common lead fields
    const leadFields = ['name', 'full_name', 'email', 'phone', 'contact', 'profile_url', 'headline', 'location'];
    return leadFields.some(field => field in firstItem);
  };

  const handleContactSelection = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedContacts);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedContacts(newSelected);
  };

  const handleSelectAll = (leads: any[], checked: boolean) => {
    if (checked) {
      const availableIndexes = leads
        .map((_, index) => index)
        .filter(index => !addedContacts.has(index));
      setSelectedContacts(new Set(availableIndexes));
    } else {
      setSelectedContacts(new Set());
    }
  };

  const getSelectedContactsData = (leads: any[]) => {
    return Array.from(selectedContacts).map(index => leads[index]);
  };

  const handleAddToContacts = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add contacts.",
        variant: "destructive",
      });
      return;
    }

    setShowTaggingModal(true);
  };

  const handleConfirmAddContacts = async (initialTags: string[]) => {
    setIsAddingContacts(true);
    setShowTaggingModal(false);

    try {
      const leads = getLeadsArray();
      const selectedContactsData = getSelectedContactsData(leads);
      
      // Normalize the contact data
      const contactsData = normalizeContactData(selectedContactsData);
      
      if (contactsData.length === 0) {
        toast({
          title: "No Contacts Found",
          description: "No valid contact data found to import.",
          variant: "destructive",
        });
        return;
      }

      // Add initial tags to each contact
      const contactsWithTags = contactsData.map(contact => ({
        ...contact,
        tags: initialTags
      }));

      // Add contacts to database
      const result = await addContactsToDatabase(contactsWithTags, user.id);

      if (result.success) {
        // Mark selected contacts as added
        const newAddedContacts = new Set([...addedContacts, ...selectedContacts]);
        setAddedContacts(newAddedContacts);
        setSelectedContacts(new Set());

        toast({
          title: "Contacts Added Successfully",
          description: `${result.count} contact${result.count !== 1 ? 's' : ''} added to your contact list${initialTags.length > 0 ? ` with ${initialTags.length} tag${initialTags.length !== 1 ? 's' : ''}` : ''}.`,
          className: "border-green-500/20 bg-green-500/10 text-green-700",
        });
      } else {
        throw new Error(result.error || 'Failed to add contacts');
      }
    } catch (error) {
      console.error('Error adding contacts:', error);
      toast({
        title: "Error Adding Contacts",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAddingContacts(false);
    }
  };

  const getLeadsArray = () => {
    if (isLeadDataArray(output)) return output;
    if (output.leads && isLeadDataArray(output.leads)) return output.leads;
    if (output.data && isLeadDataArray(output.data)) return output.data;
    return [];
  };

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

  const renderLeadTable = (leads: any[]) => {
    if (leads.length === 0) return null;

    const allKeys = Array.from(new Set(leads.flatMap(lead => Object.keys(lead))));
    const formatHeader = (key: string) => {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    };

    const availableContacts = leads.filter((_, index) => !addedContacts.has(index));
    const allAvailableSelected = availableContacts.length > 0 && 
      availableContacts.every((_, originalIndex) => {
        const actualIndex = leads.findIndex(lead => lead === leads[originalIndex]);
        return selectedContacts.has(actualIndex);
      });

    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allAvailableSelected}
                    onCheckedChange={(checked) => handleSelectAll(leads, !!checked)}
                    disabled={availableContacts.length === 0}
                  />
                </TableHead>
                {allKeys.map((key) => (
                  <TableHead key={key} className="text-muted-foreground">
                    {formatHeader(key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, index) => {
                const isAdded = addedContacts.has(index);
                const isSelected = selectedContacts.has(index);
                
                return (
                  <TableRow 
                    key={index}
                    className={cn(
                      isAdded && "opacity-50 bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleContactSelection(index, !!checked)}
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
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleAddToContacts} 
            disabled={selectedContacts.size === 0 || isAddingContacts}
            className={cn(
              "transition-all duration-200",
              selectedContacts.size === 0 
                ? "opacity-50 cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Users className="h-4 w-4 mr-2" />
            Add {selectedContacts.size} Contact{selectedContacts.size !== 1 ? 's' : ''}
          </Button>
        </div>

        {user && (
          <InitialTaggingModal
            isOpen={showTaggingModal}
            onClose={() => setShowTaggingModal(false)}
            onConfirm={handleConfirmAddContacts}
            selectedCount={selectedContacts.size}
            isLoading={isAddingContacts}
            userId={user.id}
          />
        )}
      </div>
    );
  };

  const renderOutput = () => {
    if (!output) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No output available yet. Execute the tool to see results.</p>
        </div>
      );
    }

    console.log('DynamicOutput - output:', output);
    console.log('DynamicOutput - isLeadGenTool:', isLeadGenTool());
    console.log('DynamicOutput - isLeadDataArray(output):', isLeadDataArray(output));

    // Check if this is a Lead Gen tool and the output is an array of lead objects
    if (isLeadGenTool() && isLeadDataArray(output)) {
      return renderLeadTable(output);
    }

    // Check if output has a 'leads' property that contains the lead data
    if (isLeadGenTool() && output.leads && isLeadDataArray(output.leads)) {
      return renderLeadTable(output.leads);
    }

    // Check if output has a 'data' property that contains the lead data
    if (isLeadGenTool() && output.data && isLeadDataArray(output.data)) {
      return renderLeadTable(output.data);
    }

    // If output is a string, display it in a textarea
    if (typeof output === 'string') {
      return (
        <Textarea
          value={output}
          readOnly
          className="min-h-[200px] bg-background border-border font-mono text-sm"
        />
      );
    }

    if (typeof output === 'object') {
      return (
        <Textarea
          value={JSON.stringify(output, null, 2)}
          readOnly
          className="min-h-[200px] bg-background border-border font-mono text-sm"
        />
      );
    }

    return (
      <Textarea
        value={String(output)}
        readOnly
        className="min-h-[200px] bg-background border-border font-mono text-sm"
      />
    );
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">
              {outputSchema?.label || 'Output Results'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tool execution results and status
            </CardDescription>
          </div>
          <Badge className={getStatusColor()}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderOutput()}
      </CardContent>
    </Card>
  );
};
