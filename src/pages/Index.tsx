
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">AI Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 Now with 50+ AI Tools Available
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Your AI Toolkit for
            <span className="gradient-text">
              {" "}Everything
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access powerful AI tools for content creation, image generation, code optimization, and more. 
            Pay only for what you use with our credit-based system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-border hover:bg-accent">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose AI Hub?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to supercharge your workflow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="dashboard-card text-center hover:border-primary/50">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular AI Tools</h2>
            <p className="text-xl text-muted-foreground">Discover what our community loves most</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="dashboard-card hover:border-primary/50">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-foreground">{tool.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{tool.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{tool.credits} credits</span>
                    <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">Try Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-blue-600/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators, developers, and businesses using AI Hub to achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                Start Free Trial <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-8 text-muted-foreground">
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
      <footer className="bg-card/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">AI Hub</span>
            </div>
            <div className="flex space-x-6 text-muted-foreground">
              <Link to="/pricing" className="hover:text-primary">Pricing</Link>
              <a href="#" className="hover:text-primary">Support</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 AI Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
