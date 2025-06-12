
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Coins, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { handleInsufficientCredits } from "@/utils/payment";
import { DynamicForm } from "@/components/DynamicForm";
import { DynamicOutput } from "@/components/DynamicOutput";

interface Tool {
  id: string;
  name: string;
  description: string;
  credit_cost: number;
  category: string;
  input_schema: {
    fields: Array<{
      name: string;
      type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
      label: string;
      placeholder?: string;
      required?: boolean;
      options?: string[];
      defaultValue?: any;
    }>;
  };
  output_schema: {
    type: string;
    label: string;
    format?: string;
  };
  execution_type: string;
  api_endpoint?: string;
}

interface ToolExecution {
  id: string;
  input_data: any;
  output_data: any;
  status: string;
  credits_used: number;
  created_at: string;
}

const ToolInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tool, setTool] = useState<Tool | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [currentExecution, setCurrentExecution] = useState<ToolExecution | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;
      
      const { data: toolData, error } = await supabase
        .from('tools')
        .select('*')
        .eq('name', id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
        .single();

      if (error) {
        console.error('Error fetching tool:', error);
        // Try to fetch by ID if name lookup fails
        const { data: toolById, error: idError } = await supabase
          .from('tools')
          .select('*')
          .eq('id', id)
          .single();
        
        if (idError) {
          console.error('Error fetching tool by ID:', idError);
          setTool(undefined);
        } else {
          setTool(toolById);
        }
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

  const handleExecuteTool = async (inputData: Record<string, any>) => {
    if (!user || !tool) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use this tool.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const requiredCredits = tool.credit_cost || 1;

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

      // Create execution record
      const { data: executionData, error: executionError } = await supabase
        .from('tool_executions')
        .insert({
          user_id: user.id,
          tool_id: tool.id,
          input_data: inputData,
          status: 'pending',
          credits_used: requiredCredits
        })
        .select()
        .single();

      if (executionError) {
        throw new Error('Failed to create execution record');
      }

      setCurrentExecution(executionData);

      // Simulate tool execution (replace with actual tool execution logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock output based on input
      const mockOutput = `Tool executed successfully with input: ${JSON.stringify(inputData, null, 2)}`;

      // Update execution with results
      const { error: updateError } = await supabase
        .from('tool_executions')
        .update({ 
          output_data: mockOutput,
          status: 'completed'
        })
        .eq('id', executionData.id);

      if (updateError) {
        throw new Error('Failed to update execution results');
      }

      // Deduct credits
      const newCredits = userCredits - requiredCredits;
      const { error: creditsError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', user.id);

      if (creditsError) {
        throw new Error('Failed to deduct credits');
      }

      setUserCredits(newCredits);
      setCurrentExecution(prev => prev ? {
        ...prev,
        output_data: mockOutput,
        status: 'completed'
      } : null);

      toast({
        title: "Success",
        description: "Tool executed successfully!",
      });

    } catch (error) {
      console.error('Error executing tool:', error);
      
      // Update execution status to error
      if (currentExecution) {
        await supabase
          .from('tool_executions')
          .update({ status: 'error' })
          .eq('id', currentExecution.id);
        
        setCurrentExecution(prev => prev ? { ...prev, status: 'error' } : null);
      }

      toast({
        title: "Error",
        description: "Failed to execute the tool. Please try again.",
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/insights")} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Insights
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
              <p className="text-muted-foreground">Please check the URL or return to the insights page.</p>
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/insights")} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Insights
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
        {/* Tool Information */}
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
                  {tool.credit_cost} credits per execution
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

        {/* Dynamic Input Form */}
        <div className="mb-8">
          <DynamicForm
            fields={tool.input_schema?.fields || []}
            onSubmit={handleExecuteTool}
            isLoading={isLoading}
            submitLabel={`Execute Tool (${tool.credit_cost} credits)`}
          />
        </div>

        {/* Dynamic Output Display */}
        <DynamicOutput
          output={currentExecution?.output_data}
          status={currentExecution?.status as any || 'pending'}
          outputSchema={tool.output_schema}
        />
      </div>
    </div>
  );
};

export default ToolInterface;
