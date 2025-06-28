
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TagInput } from './TagInput';
import { toast } from '@/hooks/use-toast';
import { addContactsToDatabase, normalizeContactData, ContactData } from '@/utils/contacts';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface FileImportFormProps {
  userId: string;
  onContactsAdded: () => void;
  onCancel: () => void;
}

export const FileImportForm = ({ userId, onContactsAdded, onCancel }: FileImportFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ContactData[]>([]);
  const [previewData, setPreviewData] = useState<ContactData[]>([]);
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'tags'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV, XLS, or XLSX file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      let data: any[] = [];
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        // Parse CSV
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim()
        });
        data = result.data;
      } else {
        // Parse Excel
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      }

      const normalizedData = normalizeContactData(data);
      setParsedData(normalizedData);
      setPreviewData(normalizedData.slice(0, 5)); // Show first 5 for preview
      setStep('preview');
      
      toast({
        title: "File Processed",
        description: `Successfully parsed ${normalizedData.length} contacts from the file.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process the file. Please check the file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;

    setIsImporting(true);
    
    try {
      // Add initial tags to all contacts
      const contactsWithTags = parsedData.map(contact => ({
        ...contact,
        tags: [...(contact.tags || []), ...initialTags]
      }));

      const result = await addContactsToDatabase(contactsWithTags, userId);
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.count} contacts.`,
        });
        onContactsAdded();
      } else {
        toast({
          title: "Import Error",
          description: result.error || "Failed to import contacts. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      toast({
        title: "Import Error",
        description: "Failed to import contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setParsedData([]);
    setPreviewData([]);
    setInitialTags([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 py-4">
      {step === 'upload' && (
        <>
          <div className="space-y-2">
            <Label>Select File</Label>
            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Click to select a CSV, XLS, or XLSX file
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      )}

      {step === 'preview' && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-medium">File processed successfully!</p>
            </div>
            
            <div className="space-y-2">
              <Label>Preview (First 5 contacts)</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Company</th>
                          <th className="text-left p-2">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((contact, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{contact.name || '-'}</td>
                            <td className="p-2">{contact.email || '-'}</td>
                            <td className="p-2">{contact.company_name || '-'}</td>
                            <td className="p-2">{contact.contact_position || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total contacts to import: {parsedData.length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Choose Different File
            </Button>
            <Button type="button" onClick={() => setStep('tags')}>
              Continue to Import
            </Button>
          </div>
        </>
      )}

      {step === 'tags' && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="font-medium">Add tags to all imported contacts (Optional)</p>
            </div>
            
            <div className="space-y-2">
              <Label>Initial Tags</Label>
              <TagInput
                selectedTags={initialTags}
                onTagsChange={setInitialTags}
                userId={userId}
              />
              <p className="text-xs text-muted-foreground">
                These tags will be applied to all {parsedData.length} contacts being imported.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setStep('preview')}>
              Back to Preview
            </Button>
            <Button
              type="button"
              onClick={handleImport}
              disabled={isImporting}
              className="flex-1"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing {parsedData.length} Contacts...
                </>
              ) : (
                `Import ${parsedData.length} Contacts`
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
