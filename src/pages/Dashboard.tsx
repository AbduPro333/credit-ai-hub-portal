
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Users, Coins, Filter, Grid, List, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tools, setTools] = useState<Tool[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch tools and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from("tools")
          .select("*")
          .order("rating", { ascending: false });

        if (toolsError) throw toolsError;
        setTools(toolsData || []);

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
          description: "Failed to load data: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-800">AI Hub</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <Coins className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-800">
                  {userProfile?.credits || 0} credits
                </span>
              </div>
              <Link to="/pricing">
                <Button variant="outline" size="sm">Buy Credits</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-600">Discover and use powerful AI tools to enhance your workflow</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg border mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search AI tools, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredTools.length} of {tools.length} tools
          </p>
        </div>

        {/* Tools Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {tool.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-600">{tool.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-slate-800 group-hover:text-slate-600 transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{tool.total_uses.toLocaleString()} uses</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{tool.credit_cost} credits</div>
                      <Link to={`/tool/${tool.id}`}>
                        <Button size="sm" className="mt-2">
                          Use Tool
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No tools found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
