
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Lead {
  id: string;
  customer: string;
  phone: string;
  lastContacted: string;
  status: "follow-up" | "hot-lead" | "issue" | "new";
  nextStep: string;
  insights: string;
}

const leads: Lead[] = [
  {
    id: "1",
    customer: "Fatima Al Jaber",
    phone: "+971XXXXXXXX",
    lastContacted: "May 07, 2:15 PM",
    status: "follow-up",
    nextStep: "Send updated catalog by tomorrow",
    insights: "Looking for bulk order of dates for Ramadan. Needs pricing for 100+ units"
  },
  {
    id: "2",
    customer: "Ahmed Al Mazrouei",
    phone: "+971XXXXXXXX",
    lastContacted: "May 06, 6:30 PM",
    status: "hot-lead",
    nextStep: "Schedule video call to discuss custom",
    insights: "Interested in premium abayas for a wedding. Has a budget of 5000 AED for 3 pieces."
  },
  {
    id: "3",
    customer: "Noura Al Shamsi",
    phone: "+971XXXXXXXX",
    lastContacted: "May 05, 1:45 PM",
    status: "issue",
    nextStep: "Follow up on shipping delay concern",
    insights: "Ordered 2 weeks ago. Unhappy with shipping delays. Considering cancellation."
  },
  {
    id: "4",
    customer: "Khalid Al Falasi",
    phone: "+971XXXXXXXX",
    lastContacted: "May 07, 12:20 PM",
    status: "new",
    nextStep: "Send welcome message and catalog",
    insights: "First-time inquiry about men's kandoras. Asked about custom embroidery options."
  },
  {
    id: "5",
    customer: "Maryam Al Hashemi",
    phone: "+971XXXXXXXX",
    lastContacted: "May 06, 3:05 PM",
    status: "follow-up",
    nextStep: "Confirm fabric preferences and provide",
    insights: "Interested in sustainable fabrics. Price-sensitive but willing to pay premium for eco-..."
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "follow-up":
      return <Badge className="status-warning">Follow-up Needed</Badge>;
    case "hot-lead":
      return <Badge className="status-success">Hot Lead</Badge>;
    case "issue":
      return <Badge className="status-error">Issue Reported</Badge>;
    case "new":
      return <Badge variant="secondary">New</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const LeadManagementTable = () => {
  return (
    <div className="dashboard-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Lead Management</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Last Contacted</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Next Step</TableHead>
              <TableHead className="text-muted-foreground">AI Insights</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">{lead.customer}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{lead.lastContacted}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell className="text-foreground max-w-xs">{lead.nextStep}</TableCell>
                <TableCell className="text-muted-foreground max-w-md text-sm">{lead.insights}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled>
            Previous
          </Button>
          <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="ghost" size="sm">
            2
          </Button>
          <Button variant="ghost" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
