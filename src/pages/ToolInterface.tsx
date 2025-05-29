
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Coins, Star, Users, Zap, Download, Copy } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ToolInterface = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock user data - this will come from Supabase
  const userCredits = 250;

  // Mock tool data - this will come from Supabase based on ID
  const tool = {
    id: 1,
    name: "AI Content Generator",
    description: "Create high-quality blog posts, articles, and marketing copy with advanced AI",
    category: "Writing",
    rating: 4.9,
    users: 12500,
    price: 5,
    image: "📝",
    tags: ["Content", "Marketing", "SEO"],
    inputLabel: "What would you like me to write about?",
    inputPlaceholder: "Enter your topic, keywords, or brief description...",
    features: [
      "SEO-optimized content",
      "Multiple writing styles",
      "Plagiarism-free output",
      "Grammar correction"
    ]
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to process",
        variant: "destructive"
      });
      return;
    }

    if (userCredits < tool.price) {
      toast({
        title: "Insufficient credits",
        description: `You need ${tool.price} credits to use this tool`,
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

    // Simulate API call delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Mock AI response
      setOutput(`Here's your AI-generated content based on "${input}":\n\n# The Future of AI Technology\n\nArtificial Intelligence has revolutionized the way we approach problem-solving and automation. In this comprehensive guide, we'll explore the key developments shaping the AI landscape.\n\n## Key Benefits\n\n1. **Increased Efficiency**: AI tools can process information faster than traditional methods\n2. **Cost Reduction**: Automated processes reduce operational costs\n3. **Better Decision Making**: Data-driven insights lead to informed choices\n\n## Implementation Strategies\n\nWhen implementing AI solutions, consider these important factors:\n\n- Start with clear objectives and measurable goals\n- Ensure data quality and accessibility\n- Train your team on new AI tools and processes\n- Monitor performance and iterate based on results\n\n## Conclusion\n\nThe integration of AI technology offers tremendous opportunities for growth and innovation. By following best practices and maintaining a strategic approach, organizations can harness the full potential of artificial intelligence.\n\n*This content was generated using advanced AI technology and optimized for SEO performance.*`);
      
      setIsProcessing(false);
      
      toast({
        title: "Content generated!",
        description: `${tool.price} credits have been deducted from your balance`
      });
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The generated content has been copied to your clipboard"
    });
  };

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
                <span className="font-medium text-slate-800">{userCredits} credits</span>
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
                  <div className="text-3xl">{tool.image}</div>
                  <div>
                    <CardTitle className="text-slate-800">{tool.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600">{tool.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-600">{tool.users.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">Cost per use</span>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-slate-600" />
                        <span className="font-bold text-slate-800">{tool.price} credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>{tool.inputLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={tool.inputPlaceholder}
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
                        Generate ({tool.price} credits)
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
