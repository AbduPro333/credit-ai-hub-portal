import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Users, Coins, Grid, List, LogOut, Sparkles } from "lucide-react";
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
  const [dataLoading, setDataLoading] = useState(true);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated (after auth loading is complete)
  useEffect(() => {
    console.log('Dashboard: auth state changed', { user, authLoading });
    if (!authLoading && !user) {
      console.log('Redirecting to login');
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch tools and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      console.log('Fetching data for user:', user.id);
      
      try {
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from("tools")
          .select("*")
          .order("rating", { ascending: false });

        if (toolsError) {
          console.error('Tools fetch error:', toolsError);
          throw toolsError;
        }
        console.log('Tools data:', toolsData);
        setTools(toolsData || []);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
        console.log('Profile data:', profileData);
        setUserProfile(profileData);
      } catch (error: any) {
        console.error('Data fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load data: " + error.message,
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while data is being fetched
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AI Hub</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="metric-card flex items-center space-x-2 px-4 py-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary text-lg">
                  {userProfile?.credits || 0}
                </span>
                <span className="text-muted-foreground text-sm">credits</span>
              </div>
              <Link to="/pricing">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Buy Credits
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">{user?.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-muted-foreground">Discover and use powerful AI tools to enhance your workflow</p>
        </div>

        {/* Search and Filters */}
        <div className="dashboard-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI tools, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:border-primary"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-background border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-foreground hover:bg-accent">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-lg">
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
          <p className="text-muted-foreground">
            Showing <span className="text-primary font-semibold">{filteredTools.length}</span> of <span className="text-primary font-semibold">{tools.length}</span> tools
          </p>
        </div>

        {/* Tools Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="dashboard-card cursor-pointer group hover:border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {tool.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{tool.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{tool.total_uses.toLocaleString()} uses</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{tool.credit_cost} credits</div>
                      <Link to={`/tool/${tool.id}`}>
                        <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">
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
            <h3 className="text-xl font-semibold text-foreground mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="bg-primary hover:bg-primary/90">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
