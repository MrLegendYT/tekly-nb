
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Search, 
  Settings, 
  User, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tools: Array<{
    id: string;
    title: string;
    description: string;
    icon: any;
    gradient: string;
  }>;
}

const Sidebar = ({ isOpen, onToggle, activeTab, onTabChange, tools }: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    ...tools.map(tool => ({ id: tool.id, label: tool.title, icon: tool.icon })),
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">NebulaBench</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
              activeTab === item.id 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-200' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-400' : ''}`} />
            
            {isOpen && (
              <span className="font-medium">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && hoveredItem === item.id && (
              <div className="absolute left-14 bg-slate-800 text-white px-2 py-1 rounded-md text-sm whitespace-nowrap z-50 border border-slate-700/50">
                {item.label}
              </div>
            )}
            
            {/* Active indicator */}
            {activeTab === item.id && (
              <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Guest User</div>
              <div className="text-xs text-slate-400">Free Plan</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
