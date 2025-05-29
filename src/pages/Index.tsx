
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Sparkles, Star, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredTools = [
    {
      name: "AI Content Generator",
      description: "Create high-quality content in seconds",
      category: "Writing",
      rating: 4.9,
      price: 5,
      users: "12k+"
    },
    {
      name: "Image Enhancer Pro",
      description: "Upscale and enhance images with AI",
      category: "Image",
      rating: 4.8,
      price: 3,
      users: "8k+"
    },
    {
      name: "Code Assistant",
      description: "AI-powered code generation and debugging",
      category: "Development",
      rating: 4.9,
      price: 8,
      users: "15k+"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">AI Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-slate-800 hover:bg-slate-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-slate-100 text-slate-800 border-slate-200">
            <Zap className="w-3 h-3 mr-1" />
            Powered by Advanced AI
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Discover the Future of
            <span className="text-slate-600 block">AI-Powered Tools</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Access premium AI tools through our credit-based marketplace. 
            Pay only for what you use with transparent pricing and instant results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white px-8">
                Explore Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-800">50+</div>
              <div className="text-slate-600">AI Tools Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-800">100K+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-800">1M+</div>
              <div className="text-slate-600">Tasks Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured AI Tools</h2>
            <p className="text-xl text-slate-600">Discover our most popular and highly-rated tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
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
                  <CardTitle className="text-slate-800">{tool.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{tool.users}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{tool.price} credits</div>
                      <div className="text-sm text-slate-600">per use</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose AI Hub?</h2>
            <p className="text-xl text-slate-600">Built for developers, creators, and businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Pay Per Use</h3>
              <p className="text-slate-600">Only pay for what you use with our transparent credit system</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Secure & Reliable</h3>
              <p className="text-slate-600">Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Always Updated</h3>
              <p className="text-slate-600">Access the latest AI models and tools as they become available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users already using AI Hub to supercharge their workflow
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-slate-800 hover:bg-slate-100 px-8">
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-bold text-white">AI Hub</span>
              </div>
              <p className="text-slate-400">
                The premier marketplace for AI-powered tools and services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Tools</li>
                <li>Pricing</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
