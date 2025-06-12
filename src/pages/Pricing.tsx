
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, ArrowLeft, Coins, CreditCard, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { handleInsufficientCredits } from "@/utils/payment";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const { user } = useAuth();

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

  const handleGetStarted = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      const result = await handleInsufficientCredits();
      if (result?.url) {
        // Open Stripe checkout in new tab
        window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for trying out AI tools",
      credits: 100,
      price: 20,
      popular: true,
      features: [
        "100 AI credits",
        "Access to all tools",
        "Basic support",
        "Monthly billing"
      ],
      onGetStarted: handleGetStarted
    },
    {
      name: "Pro",
      description: "Best for regular users",
      credits: 500,
      price: isAnnual ? 32 : 40,
      popular: false,
      features: [
        "500 AI credits",
        "Access to all tools",
        "Priority support",
        "90-day credit expiry",
        "Usage analytics",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      description: "For teams and businesses",
      credits: 2000,
      price: isAnnual ? 120 : 150,
      popular: false,
      features: [
        "2000 AI credits",
        "Access to all tools",
        "24/7 dedicated support",
        "No credit expiry",
        "Advanced analytics",
        "API access",
        "Custom integrations",
        "Team management"
      ]
    }
  ];

  const creditPacks = [
    { credits: 50, price: 5, bonus: 0 },
    { credits: 100, price: 10, bonus: 0 },
    { credits: 250, price: 20, bonus: 25 },
    { credits: 500, price: 40, bonus: 75 },
    { credits: 1000, price: 75, bonus: 200 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="text-xl font-bold text-foreground">Pricing</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-card px-3 py-2 rounded-lg border border-border">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{userCredits} credits</span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Flexible pricing that grows with your needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : 'border-border'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-foreground">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.credits} credits included
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.onGetStarted ? (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={plan.onGetStarted}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit Packs Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">One-Time Credit Packs</h2>
            <p className="text-xl text-muted-foreground">
              Need more credits? Purchase additional credits that never expire
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {creditPacks.map((pack, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border">
                <CardHeader className="pb-4">
                  <div className="text-2xl font-bold text-foreground">
                    {pack.credits + pack.bonus}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    credits
                    {pack.bonus > 0 && (
                      <div className="text-primary font-medium">
                        +{pack.bonus} bonus
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground mb-4">
                    ${pack.price}
                  </div>
                  <Button variant="outline" className="w-full border-border hover:bg-accent">
                    <Coins className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">How do credits work?</h3>
              <p className="text-muted-foreground text-sm">
                Each AI tool requires a certain number of credits to use. Credits are deducted from your balance when you generate content.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Do credits expire?</h3>
              <p className="text-muted-foreground text-sm">
                Subscription credits expire based on your plan (30-90 days). One-time credit packs never expire.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I change my plan?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                New users get 10 free credits to try our tools. No credit card required for the trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
