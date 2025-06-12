
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesFunnel } from "@/components/dashboard/SalesFunnel";
import { LeadManagementTable } from "@/components/dashboard/LeadManagementTable";

interface UserProfile {
  credits: number;
}

const Dashboard = () => {
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

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      console.log('Fetching data for user:', user.id);
      
      try {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Insights</h1>
              <p className="text-lg text-muted-foreground">Sales Dashboard</p>
            </div>
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

      <div className="p-8">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Active Leads" 
            value="27" 
          />
          <MetricCard 
            title="Needs Follow-Up (Orange Status)" 
            value="5" 
            status="warning"
          />
          <MetricCard 
            title="Orders Placed (This Week)" 
            value="3" 
          />
          <MetricCard 
            title="Lead to Order (This Week)" 
            value="15%" 
          />
        </div>

        {/* Sales Funnel */}
        <div className="mb-8">
          <SalesFunnel />
        </div>

        {/* Lead Management Table */}
        <LeadManagementTable />
      </div>
    </div>
  );
};

export default Dashboard;
