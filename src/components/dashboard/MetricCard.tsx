
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: "success" | "warning" | "error";
  className?: string;
}

export const MetricCard = ({ title, value, subtitle, status, className }: MetricCardProps) => {
  return (
    <div className={cn("dashboard-card p-6", className)}>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className={cn(
          "text-3xl font-bold",
          status === "success" && "text-green-400",
          status === "warning" && "text-orange-400",
          status === "error" && "text-red-400",
          !status && "text-primary"
        )}>
          {value}
        </div>
        {subtitle && (
          <div className={cn(
            "text-xs",
            status === "warning" && "text-orange-400",
            !status && "text-muted-foreground"
          )}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
