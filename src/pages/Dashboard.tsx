
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Users, Coins, Filter, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock user data - this will come from Supabase
  const userCredits = 250;

  const aiTools = [
    {
      id: 1,
      name: "AI Content Generator",
      description: "Create high-quality blog posts, articles, and marketing copy with advanced AI",
      category: "Writing",
      rating: 4.9,
      users: 12500,
      price: 5,
      image: "📝",
      tags: ["Content", "Marketing", "SEO"]
    },
    {
      id: 2,
      name: "Image Enhancer Pro",
      description: "Upscale and enhance images using state-of-the-art AI algorithms",
      category: "Image",
      rating: 4.8,
      users: 8300,
      price: 3,
      image: "🖼️",
      tags: ["Enhancement", "Upscaling", "Photo"]
    },
    {
      id: 3,
      name: "Code Assistant",
      description: "AI-powered code generation, debugging, and optimization for developers",
      category: "Development",
      rating: 4.9,
      users: 15200,
      price: 8,
      image: "💻",
      tags: ["Coding", "Debug", "Optimization"]
    },
    {
      id: 4,
      name: "Voice Synthesizer",
      description: "Generate natural-sounding voice overs and speech from text",
      category: "Audio",
      rating: 4.7,
      users: 6800,
      price: 4,
      image: "🎤",
      tags: ["Voice", "TTS", "Audio"]
    },
    {
      id: 5,
      name: "Data Analyzer",
      description: "Extract insights and patterns from complex datasets using AI",
      category: "Analytics",
      rating: 4.6,
      users: 4200,
      price: 6,
      image: "📊",
      tags: ["Data", "Analytics", "Insights"]
    },
    {
      id: 6,
      name: "Language Translator",
      description: "Translate text between 100+ languages with context awareness",
      category: "Language",
      rating: 4.8,
      users: 9600,
      price: 2,
      image: "🌐",
      tags: ["Translation", "Language", "Global"]
    }
  ];

  const categories = ["all", "Writing", "Image", "Development", "Audio", "Analytics", "Language"];

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <span className="font-medium text-slate-800">{userCredits} credits</span>
              </div>
              <Link to="/pricing">
                <Button variant="outline" size="sm">Buy Credits</Button>
              </Link>
              <Button variant="ghost" size="sm">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
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
            Showing {filteredTools.length} of {aiTools.length} tools
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
                  <div className="text-2xl">{tool.image}</div>
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
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{tool.users.toLocaleString()} users</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{tool.price} credits</div>
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
