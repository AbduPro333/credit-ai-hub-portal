import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Coins, CreditCard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { handleInsufficientCredits } from "@/utils/payment";

interface Tool {
  id: string;
  name: string;
  description: string;
  credit_cost: number;
  category: string;
}

const ToolInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tool, setTool] = useState<Tool | undefined>(undefined);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;
      
      const { data: toolData, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching tool:', error);
        setTool(undefined);
      } else {
        setTool(toolData);
      }
    };

    fetchTool();
  }, [id]);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
      } else {
        setUserCredits(userData?.credits || 0);
      }
    };

    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  const handleRunTool = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use this tool.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      const requiredCredits = tool?.credit_cost || 1;

      if (userCredits < requiredCredits) {
        const result = await handleInsufficientCredits();
        if (result?.url) {
          toast({
            title: "Insufficient Credits",
            description: `You need ${requiredCredits} credits but only have ${userCredits}. Redirecting to purchase...`,
            action: (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(result.url, '_blank')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            ),
          });
          window.open(result.url, '_blank');
        }
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newCredits = userCredits - requiredCredits;
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Failed to deduct credits');
      }

      setUserCredits(newCredits);
      setOutput(`Tool output: ${input}`);
      toast({
        title: "Success",
        description: "Tool ran successfully!",
      });

    } catch (error) {
      console.error('Error running tool:', error);
      toast({
        title: "Error",
        description: "Failed to run the tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="text-xl font-bold text-foreground">Tool Not Found</div>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-foreground">Tool Not Found</CardTitle>
              <CardDescription className="text-muted-foreground">
                The requested tool could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please check the URL or return to the dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="text-xl font-bold text-foreground">{tool.name}</div>
              <Badge className="bg-primary/10 text-primary border-primary/20">{tool.category}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="metric-card flex items-center space-x-2 px-4 py-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{userCredits}</span>
                  <span className="text-muted-foreground text-sm">credits</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dashboard-card mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">{tool.name}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {tool.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Credit Cost
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.credit_cost} credits per run
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Category
                </h3>
                <p className="text-sm text-muted-foreground">{tool.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="dashboard-card mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Input</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure your input parameters below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input" className="text-foreground">Input Text</Label>
              <Input
                id="input"
                placeholder="Enter your input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-background border-border focus:border-primary"
              />
            </div>

            <Button 
              onClick={handleRunTool}
              disabled={isLoading || !input.trim()}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Tool ({tool?.credit_cost || 1} credits)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-foreground">Output</CardTitle>
            <CardDescription className="text-muted-foreground">
              Result of the tool will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Output will appear here..."
              value={output}
              readOnly
              className="min-h-[100px] bg-background border-border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolInterface;
