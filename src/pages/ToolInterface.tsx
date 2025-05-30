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
  input_labels: string[];
  example_input: string;
  category: string;
}

const mockTools: Tool[] = [
  {
    id: "summarizer",
    name: "Text Summarizer",
    description: "Summarize long articles into concise summaries.",
    credit_cost: 1,
    input_labels: ["Article Text"],
    example_input: "Paste a long article here to summarize it.",
    category: "Text",
  },
  {
    id: "translator",
    name: "Language Translator",
    description: "Translate text between multiple languages.",
    credit_cost: 2,
    input_labels: ["Text to Translate", "Target Language"],
    example_input: "Hello world|Spanish",
    category: "Text",
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Increase the resolution of low-quality images.",
    credit_cost: 3,
    input_labels: ["Image URL"],
    example_input: "https://example.com/low-res-image.jpg",
    category: "Image",
  },
];

const ToolInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tool, setTool] = useState<Tool | undefined>(undefined);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foundTool = mockTools.find((tool) => tool.id === id);
    setTool(foundTool);
  }, [id]);

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
      // Check user's current credits
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw new Error('Failed to check credits');
      }

      const currentCredits = userData?.credits || 0;
      const requiredCredits = tool?.credit_cost || 1;

      if (currentCredits < requiredCredits) {
        const result = await handleInsufficientCredits();
        if (result?.url) {
          toast({
            title: "Insufficient Credits",
            description: `You need ${requiredCredits} credits but only have ${currentCredits}. Redirecting to purchase...`,
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
          // Open payment link in new tab
          window.open(result.url, '_blank');
        }
        return;
      }

      // Simulate tool processing (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Deduct credits from user's account
      const newCredits = currentCredits - requiredCredits;
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Failed to deduct credits');
      }

      // Simulate output
      setOutput(`Tool output: ${input}`);
      toast({
        title: "Success",
        description: "Tool ran successfully!",
      });

      // Fetch the updated user data to reflect the new credit balance
      const { data: updatedUserData, error: updatedUserError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (updatedUserError) {
        console.error("Failed to fetch updated user data:", updatedUserError);
      } else {
        // Optionally, update the user context with the new credit balance
        // setUser({ ...user, credits: updatedUserData?.credits || 0 });
        console.log("Remaining credits:", updatedUserData?.credits || 0);
      }

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
                  <span className="font-medium text-slate-800">{user?.user_metadata?.credits || 0} credits</span>
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
            {tool.input_labels.map((label, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`input-${index}`}>{label}</Label>
                <Input
                  id={`input-${index}`}
                  placeholder={tool.example_input.split('|')[index] || tool.example_input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            ))}

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
