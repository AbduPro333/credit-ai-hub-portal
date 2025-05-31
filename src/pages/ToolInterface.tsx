
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Coins, CreditCard } from "lucide-react";
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

      // Simulate tool processing (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Deduct credits from user's account
      const newCredits = userCredits - requiredCredits;
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Failed to deduct credits');
      }

      // Update local credits state
      setUserCredits(newCredits);

      // Simulate output
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
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="text-xl font-bold text-slate-800">Tool Not Found</div>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Tool Not Found</CardTitle>
              <CardDescription>
                The requested tool could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please check the URL or return to the dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="text-xl font-bold text-slate-800">{tool.name}</div>
              <Badge className="ml-2">{tool.category}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                  <Coins className="h-4 w-4 text-slate-600" />
                  <span className="font-medium text-slate-800">{userCredits} credits</span>
                </div>
              )}
              <Button variant="ghost" size="sm">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>
              {tool.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Credit Cost
                </h3>
                <p className="text-sm text-slate-600">
                  {tool.credit_cost} credits per run
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Category
                </h3>
                <p className="text-sm text-slate-600">{tool.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Configure your input parameters below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="input">Input Text</Label>
              <Input
                id="input"
                placeholder="Enter your input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleRunTool}
              disabled={isLoading || !input.trim()}
              className="w-full bg-slate-800 hover:bg-slate-700"
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
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              Result of the tool will be displayed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Output will appear here..."
              value={output}
              readOnly
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolInterface;
