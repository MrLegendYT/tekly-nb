
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Undo, 
  Redo, 
  Download, 
  Share, 
  Palette,
  Layers,
  ZoomIn,
  ZoomOut,
  Move,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

interface DrawingTool {
  type: "pen" | "square" | "circle" | "text" | "eraser" | "move";
  color: string;
  size: number;
}

const AIWhiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>({
    type: "pen",
    color: "#3b82f6",
    size: 2
  });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [collaborators] = useState([
    { id: 1, name: "Alice", color: "#3b82f6", active: true },
    { id: 2, name: "Bob", color: "#10b981", active: true },
    { id: 3, name: "Charlie", color: "#f59e0b", active: false }
  ]);

  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6b7280"
  ];

  const tools = [
    { type: "pen" as const, icon: Pen, label: "Pen" },
    { type: "square" as const, icon: Square, label: "Rectangle" },
    { type: "circle" as const, icon: Circle, label: "Circle" },
    { type: "text" as const, icon: Type, label: "Text" },
    { type: "eraser" as const, icon: Eraser, label: "Eraser" },
    { type: "move" as const, icon: Move, label: "Move" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set default styles
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x;
    const y = (e.clientY - rect.top) / zoom - panOffset.y;

    setIsDrawing(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool.color;
    ctx.lineWidth = tool.size;
    ctx.lineCap = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom - panOffset.x;
    const y = (e.clientY - rect.top) / zoom - panOffset.y;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool.type === "pen") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    toast.success("Canvas cleared!");
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Canvas exported!");
  };

  const generateAISuggestion = () => {
    toast.info("AI suggestions: Try grouping related elements or adding connecting lines between concepts!");
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Whiteboard Tool</h1>
                <p className="text-slate-400">Collaborative infinite canvas with AI-powered suggestions</p>
              </div>
            </div>

            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Collaborators:</span>
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white relative ${
                    collab.active ? 'ring-2 ring-green-400' : ''
                  }`}
                  style={{ backgroundColor: collab.color }}
                >
                  {collab.name[0]}
                  {collab.active && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Drawing Tools */}
              <div className="flex space-x-2">
                {tools.map((t) => (
                  <Button
                    key={t.type}
                    variant={tool.type === t.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTool({ ...tool, type: t.type })}
                    className={`${
                      tool.type === t.type 
                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>

              {/* Color Palette */}
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setTool({ ...tool, color })}
                    className={`w-6 h-6 rounded-full border-2 ${
                      tool.color === color ? 'border-white' : 'border-slate-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tool.size}
                  onChange={(e) => setTool({ ...tool, size: parseInt(e.target.value) })}
                  className="w-16"
                />
                <span className="text-sm text-slate-300 w-6">{tool.size}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomOut}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-300 px-2">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomIn}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={generateAISuggestion}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                AI Suggest
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportCanvas}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Canvas */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-[600px] bg-slate-700 rounded-lg cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            />
            
            {/* Canvas Overlay Info */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2">
              <div className="text-xs text-slate-300">
                Tool: {tool.type} | Size: {tool.size} | Zoom: {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">AI Suggestions</span>
              </div>
              <div className="text-xs text-slate-300">
                • Group related elements together
                • Add connecting lines between concepts
                • Use consistent colors for categories
                • Consider adding labels to shapes
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIWhiteboard;
