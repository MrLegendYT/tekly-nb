
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Command } from "lucide-react";

interface CommandPaletteProps {
  onToolChange: (tool: string) => void;
  tools: Array<{
    id: string;
    title: string;
    description: string;
    icon: any;
  }>;
}

const CommandPalette = ({ onToolChange, tools }: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allCommands = [
    { id: "home", title: "Home", description: "Go to homepage", icon: Search },
    ...tools,
    { id: "settings", title: "Settings", description: "Open settings", icon: Search },
  ];

  const filteredCommands = allCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onToolChange(id);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      {/* Command Palette Trigger */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          <Command className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-slate-700 rounded">⌘K</kbd>
        </Button>
      </div>

      {/* Command Palette Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-white">Command Palette</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tools and commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/50"
                autoFocus
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800/50 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <cmd.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium group-hover:text-blue-200">
                      {cmd.title}
                    </div>
                    <div className="text-sm text-slate-400">
                      {cmd.description}
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredCommands.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No commands found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandPalette;
