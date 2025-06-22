
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Users, BarChart3, Search, Zap, Sparkles, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import AIResearchAssistant from "@/components/tools/AIResearchAssistant";
import TaskManager from "@/components/tools/TaskManager";
import AIWhiteboard from "@/components/tools/AIWhiteboard";
import SmartSpreadsheet from "@/components/tools/SmartSpreadsheet";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tools = [
    {
      id: "research",
      title: "AI Research Assistant",
      description: "Smart research with real-time AI summaries, citations, and export options",
      icon: Brain,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "tasks",
      title: "Task & Notes Manager",
      description: "Intelligent task management with voice-to-note and semantic search",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "whiteboard",
      title: "AI Whiteboard Tool",
      description: "Collaborative infinite canvas with AI-powered suggestions",
      icon: Users,
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: "spreadsheet",
      title: "Smart Spreadsheet",
      description: "Excel-style sheets with AI formulas and auto-insights",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "research":
        return <AIResearchAssistant />;
      case "tasks":
        return <TaskManager />;
      case "whiteboard":
        return <AIWhiteboard />;
      case "spreadsheet":
        return <SmartSpreadsheet />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-10 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
              <div className="text-center max-w-4xl mx-auto">
                <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-200 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Powered by DeepSeek R1 AI
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
                  Tekly NebulaBench
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
                  Your AI-Powered Digital Workspace
                </p>
                
                <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
                  Empower creativity, clarity, and productivity with our all-in-one AI productivity suite. 
                  Research, organize, collaborate, and analyze with intelligent assistance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                    onClick={() => setActiveTab("research")}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Launch Workspace
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                  >
                    View Demo
                  </Button>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {tools.map((tool) => (
                  <Card 
                    key={tool.id}
                    className="group relative overflow-hidden bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer hover:scale-105"
                    onClick={() => setActiveTab(tool.id)}
                  >
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Card>
                ))}
              </div>

              {/* Stats Section */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">10K+</div>
                  <div className="text-slate-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">1M+</div>
                  <div className="text-slate-400">AI Queries Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-slate-400">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tools={tools}
      />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <CommandPalette onToolChange={setActiveTab} tools={tools} />
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
