
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, BarChart3, Users, MessageSquare, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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

const services: Service[] = [
  {
    id: "lead-generation",
    name: "Lead Generation",
    icon: Users,
    tools: [
      { id: "email-writer", name: "Email Writer", href: "/tool/email-writer" },
      { id: "social-media", name: "Social Media", href: "/tool/social-media" },
      { id: "content-creator", name: "Content Creator", href: "/tool/content-creator" },
    ],
  },
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

export const AppSidebar = () => {
  const [expandedServices, setExpandedServices] = useState<string[]>(["lead-generation"]);
  const location = useLocation();

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
            <span className="text-xs font-medium">DS</span>
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
