
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  variant?: "default" | "secondary" | "outline";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const TagBadge = ({ 
  tag, 
  variant = "secondary", 
  removable = false, 
  onRemove, 
  className 
}: TagBadgeProps) => {
  return (
    <Badge 
      variant={variant} 
      className={cn(
        "text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border-2",
        variant === "secondary" && "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25",
        variant === "default" && "bg-primary text-primary-foreground border-primary/50",
        variant === "outline" && "border-primary/40 text-primary hover:bg-primary/10",
        removable && "pr-1",
        className
      )}
    >
      <span className="font-medium">{tag}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-background/30 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};
