import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, BarChart3, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  href: string;
}

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tools: Tool[];
  href?: string;
}

// Static services that don't have tools - Insights at the top
const staticServices = [
  {
    id: "insights",
    name: "Insights",
    icon: BarChart3,
    href: "/insights",
    tools: [],
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    href: "/settings",
    tools: [],
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: CreditCard,
    href: "/pricing",
    tools: [],
  },
];

// Icon mapping for different categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "lead generation": BarChart3,
  "content creation": Settings,
  "analytics": BarChart3,
  // Add more mappings as needed
};

export const AppSidebar = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedServices, setExpandedServices] = useState<string[]>(["lead-generation"]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchServicesAndTools = async () => {
      try {
        // Fetch all tools from the database
        const { data: tools, error } = await supabase
          .from('tools')
          .select('id, name, category')
          .order('name');

        if (error) {
          console.error('Error fetching tools:', error);
          return;
        }

        // Group tools by category to create services
        const serviceMap = new Map<string, Tool[]>();
        
        tools?.forEach(tool => {
          const category = tool.category || 'uncategorized';
          if (!serviceMap.has(category)) {
            serviceMap.set(category, []);
          }
          serviceMap.get(category)?.push({
            id: tool.id,
            name: tool.name,
            href: `/tool/${tool.name.toLowerCase().replace(/\s+/g, '-')}`
          });
        });

        // Convert to services array
        const dynamicServices: Service[] = Array.from(serviceMap.entries()).map(([category, tools]) => ({
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category.charAt(0).toUpperCase() + category.slice(1),
          icon: categoryIcons[category.toLowerCase()] || BarChart3,
          tools: tools,
        }));

        // Combine static services (with Insights first) with dynamic services
        setServices([...staticServices, ...dynamicServices]);
      } catch (error) {
        console.error('Error fetching services and tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndTools();
  }, []);

  const toggleService = (serviceId: string) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isServiceActive = (service: Service) => {
    if (service.href && isActive(service.href)) return true;
    return service.tools.some(tool => isActive(tool.href));
  };

  if (loading) {
    return (
      <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 z-30 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">AI Hub</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-sidebar-accent/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 z-30 overflow-y-auto">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">AI Hub</span>
        </Link>

        <nav className="space-y-2">
          {services.map((service) => {
            const Icon = service.icon;
            const hasTools = service.tools.length > 0;
            const isExpanded = expandedServices.includes(service.id);
            const serviceActive = isServiceActive(service);

            return (
              <div key={service.id}>
                {hasTools ? (
                  <button
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      serviceActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{service.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Link
                    to={service.href || "#"}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      serviceActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{service.name}</span>
                  </Link>
                )}

                {hasTools && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {service.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={tool.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(tool.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 text-sm text-sidebar-foreground/60">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">AI</span>
          </div>
          <div>
            <div className="font-medium">AI Hub</div>
            <div className="text-xs">ai@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};
