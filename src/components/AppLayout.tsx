
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const AppLayout = ({ children, showSidebar = true }: AppLayoutProps) => {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};
