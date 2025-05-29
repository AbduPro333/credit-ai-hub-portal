
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Users, Star, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Tools",
      description: "Access cutting-edge AI tools for text generation, image creation, and more"
    },
    {
      icon: "💳",
      title: "Credit System",
      description: "Pay only for what you use with our flexible credit-based pricing"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized AI infrastructure"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  const tools = [
    { name: "Text Generator", description: "Create compelling content", credits: 2, rating: 4.8 },
    { name: "Image Creator", description: "Generate stunning visuals", credits: 5, rating: 4.9 },
    { name: "Code Helper", description: "Optimize your code", credits: 3, rating: 4.7 },
    { name: "Data Analyzer", description: "Extract insights from data", credits: 4, rating: 4.6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-slate-800" />
              <span className="text-2xl font-bold text-slate-800">AI Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-slate-200 text-slate-700">
            🚀 Now with 50+ AI Tools Available
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Your AI Toolkit for
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Everything
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Access powerful AI tools for content creation, image generation, code optimization, and more. 
            Pay only for what you use with our credit-based system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose AI Hub?</h2>
            <p className="text-xl text-slate-600">Everything you need to supercharge your workflow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular AI Tools</h2>
            <p className="text-xl text-slate-600">Discover what our community loves most</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-slate-800">{tool.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-slate-600">{tool.rating}</span>
                    </div>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{tool.credits} credits</span>
                    <Button size="sm" variant="outline">Try Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of creators, developers, and businesses using AI Hub to achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Free Trial <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>50+ AI Tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>4.9 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-slate-800" />
              <span className="text-xl font-bold text-slate-800">AI Hub</span>
            </div>
            <div className="flex space-x-6 text-slate-600">
              <Link to="/pricing" className="hover:text-slate-800">Pricing</Link>
              <a href="#" className="hover:text-slate-800">Support</a>
              <a href="#" className="hover:text-slate-800">Privacy</a>
              <a href="#" className="hover:text-slate-800">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-slate-500">
            <p>&copy; 2024 AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
