
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Loader2 } from "lucide-react";

export const ToolLoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-20" />
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="text-2xl font-semibold text-foreground">Loading Tool...</div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              We're preparing your tool interface
            </p>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>

        {/* Loading skeleton for tool interface */}
        <div className="space-y-8">
          <Card className="dashboard-card">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
