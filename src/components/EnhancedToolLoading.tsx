
import { useState, useEffect } from "react";
import { Loader2, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedToolLoadingProps {
  toolId: string;
  userId: string;
  toolName: string;
}

export const EnhancedToolLoading = ({ toolId, userId, toolName }: EnhancedToolLoadingProps) => {
  const [estimatedTime, setEstimatedTime] = useState<string>("This may take a few minutes");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchEstimatedTime = async () => {
      try {
        // Fetch recent execution durations for this tool and user
        const { data: executions, error } = await supabase
          .from('tool_executions')
          .select('duration_ms')
          .eq('tool_id', toolId)
          .eq('user_id', userId)
          .not('duration_ms', 'is', null)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching execution history:', error);
          return;
        }

        if (executions && executions.length > 0) {
          // Calculate average duration
          const totalDuration = executions.reduce((sum, exec) => sum + (exec.duration_ms || 0), 0);
          const avgDuration = Math.round(totalDuration / executions.length);
          
          // Format time display
          const minutes = Math.floor(avgDuration / 60000);
          const seconds = Math.floor((avgDuration % 60000) / 1000);
          
          if (minutes > 0) {
            setEstimatedTime(`Estimated time: ${minutes} minute${minutes > 1 ? 's' : ''} ${seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : ''}`);
          } else if (seconds > 0) {
            setEstimatedTime(`Estimated time: ${seconds} second${seconds > 1 ? 's' : ''}`);
          } else {
            setEstimatedTime("Estimated time: Less than a minute");
          }
        }
      } catch (error) {
        console.error('Error calculating estimated time:', error);
      }
    };

    fetchEstimatedTime();

    // Start elapsed time counter
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [toolId, userId]);

  const formatElapsedTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <Card className="dashboard-card">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <Loader2 className="h-12 w-12 text-primary animate-spin absolute -top-2 -left-2" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              Generating Leads...
            </h3>
            <p className="text-muted-foreground">
              Processing your {toolName} request
            </p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Elapsed: {formatElapsedTime(elapsedTime)}
          </div>
        </div>

        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-md">
          We're analyzing data and generating high-quality leads for you. 
          This process ensures the best possible results.
        </p>
      </CardContent>
    </Card>
  );
};
