
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Coins, Star, Users, Zap, Download, Copy } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Tool {
  id: string;
  name: string;
  description: string;
  credit_cost: number;
  category: string;
  rating: number;
  total_uses: number;
}

interface UserProfile {
  credits: number;
}

const ToolInterface = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch tool and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;

      try {
        // Fetch tool data
        const { data: toolData, error: toolError } = await supabase
          .from("tools")
          .select("*")
          .eq("id", id)
          .single();

        if (toolError) throw toolError;
        setTool(toolData);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profileData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load tool: " + error.message,
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchData();
    }
  }, [user, id, toast, navigate]);

  const handleGenerate = async () => {
    if (!input.trim() || !tool || !user) {
      toast({
        title: "Input required",
        description: "Please enter some text to process",
        variant: "destructive"
      });
      return;
    }

    if (!userProfile || userProfile.credits < tool.credit_cost) {
      toast({
        title: "Insufficient credits",
        description: `You need ${tool.credit_cost} credits to use this tool`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutput("");

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock response based on tool
      const mockResponse = generateMockResponse(tool.name, input);
      setOutput(mockResponse);
      
      // Deduct credits and create transaction
      const newCredits = userProfile.credits - tool.credit_cost;
      
      // Update user credits
      const { error: creditError } = await supabase
        .from("users")
        .update({ credits: newCredits })
        .eq("id", user.id);

      if (creditError) throw creditError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          tool_id: tool.id,
          input_data: { input },
          output_data: { output: mockResponse },
          credits_used: tool.credit_cost
        });

      if (transactionError) throw transactionError;

      // Update local state
      setUserProfile({ credits: newCredits });
      
      toast({
        title: "Content generated!",
        description: `${tool.credit_cost} credits have been deducted from your balance`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process request: " + error.message,
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
    }
  };

  const generateMockResponse = (toolName: string, input: string) => {
    const responses = {
      "Text Summarizer": `Summary of "${input}":\n\n• Key Point 1: Main concept extracted from your text\n• Key Point 2: Secondary important information\n• Key Point 3: Supporting details and conclusions\n\nThis summary captures the essential information from your input text.`,
      "Image Generator": `Image generation request: "${input}"\n\n[Generated Image Description]\nA high-quality AI-generated image based on your prompt. The image would show the elements you described with professional composition and lighting.\n\nNote: In a real implementation, this would return the actual generated image.`,
      "Code Reviewer": `Code Review for: "${input}"\n\n✅ Strengths:\n• Good variable naming\n• Proper error handling\n• Clear function structure\n\n⚠️ Suggestions:\n• Consider adding type hints\n• Add unit tests\n• Optimize performance for large datasets\n\nOverall: Well-written code with room for minor improvements.`,
      "Language Translator": `Translation of "${input}":\n\n[Original Text]\n${input}\n\n[Translated Text]\n[This would contain the actual translation in your target language]\n\nTranslation completed with high accuracy.`,
      "SEO Optimizer": `SEO Analysis for: "${input}"\n\n📈 Recommendations:\n• Use primary keyword in title and first paragraph\n• Add meta description (150-160 characters)\n• Include internal and external links\n• Optimize for mobile readability\n• Add alt text to images\n\nSEO Score: 85/100 - Good optimization with room for improvement.`,
      "Email Writer": `Professional Email for: "${input}"\n\nSubject: [Optimized Subject Line]\n\nDear [Recipient],\n\nI hope this email finds you well. I am writing to [purpose based on your input].\n\n[Body content tailored to your request]\n\nI look forward to your response.\n\nBest regards,\n[Your Name]`
    };
    
    return responses[toolName as keyof typeof responses] || `Generated content for ${toolName}:\n\n${input}\n\nThis is AI-generated content based on your input.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard"
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !tool) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="text-xl font-bold text-slate-800">{tool.name}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <Coins className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-800">{userProfile?.credits || 0} credits</span>
              </div>
              <Link to="/pricing">
                <Button variant="outline" size="sm">Buy Credits</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-3xl">🔧</div>
                  <div>
                    <CardTitle className="text-slate-800">{tool.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600">{tool.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-600">{tool.total_uses?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{tool.category}</Badge>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">Cost per use</span>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-slate-600" />
                        <span className="font-bold text-slate-800">{tool.credit_cost} credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Enter your content for {tool.name.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Enter your text for ${tool.name.toLowerCase()}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-32"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-slate-600">
                    {input.length > 0 && `${input.length} characters`}
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isProcessing || !input.trim()}
                    className="bg-slate-800 hover:bg-slate-700"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate ({tool.credit_cost} credits)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Processing Progress */}
            {isProcessing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing your request...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Output Section */}
            {output && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Generated Content</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
                      {output}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolInterface;
