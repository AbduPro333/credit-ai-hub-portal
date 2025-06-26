import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Trash2, Download, UserPlus, Clock, Loader2, Users, Database, Tags, Search } from 'lucide-react';
import { format } from 'date-fns';
import { TagBadge } from '@/components/TagBadge';
import { TagManagementModal } from '@/components/TagManagementModal';
import { ContactsSearchBar } from '@/components/ContactsSearchBar';
import { ContactsTagFilter } from '@/components/ContactsTagFilter';
import { ContactsSortControl } from '@/components/ContactsSortControl';
import { useContactsFiltering } from '@/hooks/useContactsFiltering';
import { supabase } from '@/integrations/supabase/client';

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

const ContactsPage = () => {
  const { user } = useAuth();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const {
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
    refetchContacts
  } = useContactsFiltering({ userId: user?.id });

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .in('id', selectedContacts);

      if (error) {
        console.error('Error deleting contacts:', error);
        toast({
          title: "Error",
          description: "Failed to delete contacts. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${selectedContacts.length} contact(s) deleted successfully.`,
      });

      setSelectedContacts([]);
      await refetchContacts();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = () => {
    const selectedContactsData = contacts.filter(contact => 
      selectedContacts.includes(contact.id)
    );

    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Position', 'Address', 'Status', 'Tags', 'Added Date'],
      ...selectedContactsData.map(contact => [
        contact.name || '',
        contact.email || '',
        contact.phone_number || '',
        contact.company_name || '',
        contact.contact_position || '',
        contact.address || '',
        contact.status || '',
        (contact.tags || []).join(', '),
        format(new Date(contact.added_at_date), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `${selectedContacts.length} contact(s) exported successfully.`,
    });
  };

  const handleAddToCRM = () => {
    toast({
      title: "CRM Integration",
      description: `Adding ${selectedContacts.length} contact(s) to CRM - Feature coming soon!`,
    });
  };

  const handleFollowUp = () => {
    toast({
      title: "Follow Up",
      description: `${selectedContacts.length} contact(s) marked for follow-up - Feature coming soon!`,
    });
  };

  const handleTagsChange = () => {
    const selectedContactsData = contacts.filter(contact => 
      selectedContacts.includes(contact.id)
    );
    setTagModalOpen(true);
  };

  const getSelectedContactsData = () => {
    return contacts.filter(contact => selectedContacts.includes(contact.id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
              <p className="text-muted-foreground">
                Organize and manage your imported lead generation contacts
              </p>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {contacts.length} total contacts
        </div>
      </div>

      {/* Enhanced Search, Filter, and Sort Controls */}
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Find & Organize Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Prevent form submission wrapper */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Search Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Search Contacts</label>
              <ContactsSearchBar
                searchQuery={searchQuery}
                searchField={searchField}
                onSearchQueryChange={setSearchQuery}
                onSearchFieldChange={setSearchField}
                onClearSearch={clearSearch}
              />
            </div>
            
            {/* Filter and Sort Row - Improved alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4 border-t border-border/30 items-end">
              {/* Tag Filter */}
              <div className="lg:col-span-3 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Filter by Tags</label>
                {user && (
                  <ContactsTagFilter
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    userId={user.id}
                  />
                )}
              </div>
              
              {/* Sort Control - Better alignment */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Sort Contacts</label>
                <div className="flex items-center">
                  <ContactsSortControl
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    className="justify-start w-full"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Always Visible Action Bar */}
      <Card className="bg-background border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">
                {selectedContacts.length > 0 
                  ? `${selectedContacts.length} contact(s) selected` 
                  : 'No contacts selected'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={selectedContacts.length === 0 || actionLoading}
                className="text-destructive hover:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={selectedContacts.length === 0 || actionLoading}
                className="disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTagsChange}
                disabled={selectedContacts.length === 0 || actionLoading}
                className="disabled:opacity-50"
              >
                <Tags className="h-4 w-4 mr-2" />
                Change Tags
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddToCRM}
                disabled={selectedContacts.length === 0 || actionLoading}
                className="disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add to CRM
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleFollowUp}
                disabled={selectedContacts.length === 0 || actionLoading}
                className="disabled:opacity-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                Follow Up
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || selectedTags.length > 0 ? 'No matching contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || selectedTags.length > 0 
                ? 'Try adjusting your search or filter criteria to find contacts.'
                : 'Start using our lead generation tools to import your first contacts. They\'ll appear here for easy management.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Contacts</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="ml-auto"
                >
                  {selectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedContacts.length === contacts.length && contacts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow 
                        key={contact.id}
                        className={selectedContacts.includes(contact.id) ? 'bg-muted/50' : ''}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => handleSelectContact(contact.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.name || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-48">
                            {contact.tags && contact.tags.length > 0 ? (
                              contact.tags.map((tag) => (
                                <TagBadge key={tag} tag={tag} />
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No tags</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.email || '-'}
                        </TableCell>
                        <TableCell>
                          {contact.phone_number || '-'}
                        </TableCell>
                        <TableCell>
                          {contact.company_name || '-'}
                        </TableCell>
                        <TableCell>
                          {contact.contact_position || '-'}
                        </TableCell>
                        <TableCell>
                          {contact.address || '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === 'new' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {contact.status || 'new'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(contact.added_at_date), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tag Management Modal */}
      {user && (
        <TagManagementModal
          isOpen={tagModalOpen}
          onClose={() => setTagModalOpen(false)}
          selectedContacts={getSelectedContactsData()}
          onTagsUpdated={() => {
            refetchContacts();
            setSelectedContacts([]);
          }}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default ContactsPage;
