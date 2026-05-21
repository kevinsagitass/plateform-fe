import { useState } from "react";
import { Sidebar, PageKey } from "./Sidebar";
import { Header } from "./Header";
import CollapsedBreadcrumb from "@/components/ui/CollapsedBreadcrumb";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onNavigate,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden font-sans">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentPage={currentPage}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            <div className="text-xs text-neutral-400 md:hidden truncate">
              <CollapsedBreadcrumb />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
