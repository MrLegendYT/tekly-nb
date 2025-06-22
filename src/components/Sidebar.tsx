
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Menu, 
  Home, 
  Search, 
  Settings, 
  User, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Edit
} from "lucide-react";
import { toast } from "sonner";

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
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('user_name') || 'Guest User';
  });
  const [editName, setEditName] = useState(userName);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    ...tools.map(tool => ({ id: tool.id, label: tool.title, icon: tool.icon })),
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNameUpdate = () => {
    if (editName.trim()) {
      setUserName(editName.trim());
      localStorage.setItem('user_name', editName.trim());
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false);
    } else {
      toast.error("Name cannot be empty");
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className={`flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors ${!isOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{userName}</div>
                  <div className="text-xs text-slate-400 flex items-center">
                    <Edit className="w-3 h-3 mr-1" />
                    Click to edit
                  </div>
                </div>
              )}
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white mt-2"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleNameUpdate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;
