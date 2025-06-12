
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface DynamicOutputProps {
  output: any;
  status: 'pending' | 'success' | 'error' | 'completed';
  outputSchema?: {
    type: string;
    label: string;
    format?: string;
  };
}

export const DynamicOutput: React.FC<DynamicOutputProps> = ({
  output,
  status,
  outputSchema
}) => {
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

  const renderOutput = () => {
    if (!output) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No output available yet. Execute the tool to see results.</p>
        </div>
      );
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

    // If output is an object, display it as formatted JSON
    if (typeof output === 'object') {
      return (
        <Textarea
          value={JSON.stringify(output, null, 2)}
          readOnly
          className="min-h-[200px] bg-background border-border font-mono text-sm"
        />
      );
    }

    // Fallback for other types
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
