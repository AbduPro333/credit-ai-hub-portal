
import { ArrowRight } from "lucide-react";

interface FunnelStage {
  label: string;
  value: number;
}

const stages: FunnelStage[] = [
  { label: "New Leads", value: 50 },
  { label: "Contacted", value: 35 },
  { label: "Qualified", value: 20 },
  { label: "Order Placed", value: 8 },
];

export const SalesFunnel = () => {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Sales Funnel</h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex items-center">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{stage.label}</div>
              <div className="text-3xl font-bold text-foreground">{stage.value}</div>
            </div>
            {index < stages.length - 1 && (
              <ArrowRight className="w-6 h-6 text-muted-foreground mx-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
