
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Upload, ArrowLeft } from 'lucide-react';
import { ManualContactForm } from './ManualContactForm';
import { FileImportForm } from './FileImportForm';

interface AddContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactsAdded: () => void;
  userId: string;
}

type ModalView = 'selection' | 'manual' | 'import';

export const AddContactsModal = ({ isOpen, onClose, onContactsAdded, userId }: AddContactsModalProps) => {
  const [currentView, setCurrentView] = useState<ModalView>('selection');

  const handleClose = () => {
    setCurrentView('selection');
    onClose();
  };

  const handleBack = () => {
    setCurrentView('selection');
  };

  const handleContactAdded = () => {
    onContactsAdded();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentView !== 'selection' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1 h-6 w-6"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            Add New Contacts
          </DialogTitle>
        </DialogHeader>

        {currentView === 'selection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => setCurrentView('manual')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Add by Hand</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Manually enter contact information using a form
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => setCurrentView('import')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Import from Excel/CSV</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Upload and import contacts from a spreadsheet file
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'manual' && (
          <ManualContactForm
            userId={userId}
            onContactAdded={handleContactAdded}
            onCancel={handleBack}
          />
        )}

        {currentView === 'import' && (
          <FileImportForm
            userId={userId}
            onContactsAdded={handleContactAdded}
            onCancel={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
