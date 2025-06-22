
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Lightbulb,
  Save,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface DrawingTool {
  type: "pen" | "square" | "circle" | "text" | "eraser" | "move";
  color: string;
  size: number;
}

interface DrawingState {
  strokes: any[];
  currentStroke: any;
}

const AIWhiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>({
    type: "pen",
    color: "#3b82f6",
    size: 3
  });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [collaborators] = useState([
    { id: 1, name: "Alice", color: "#3b82f6", active: true },
    { id: 2, name: "Bob", color: "#10b981", active: true },
    { id: 3, name: "Charlie", color: "#f59e0b", active: false }
  ]);

  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6b7280",
    "#ffffff", "#000000"
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
    
    // Save initial state
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryIndex(historyIndex - 1);
      ctx.putImageData(drawingHistory[historyIndex - 1], 0, 0);
      toast.success("↩️ Undo");
    }
  };

  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryIndex(historyIndex + 1);
      ctx.putImageData(drawingHistory[historyIndex + 1], 0, 0);
      toast.success("↪️ Redo");
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom - panOffset.x,
      y: (e.clientY - rect.top) / zoom - panOffset.y
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getMousePos(e);
    setIsDrawing(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool.type === "text") {
      setTextPosition(pos);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = tool.color;
    ctx.lineWidth = tool.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool.type === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool.type === "text") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getMousePos(e);

    if (tool.type === "pen" || tool.type === "eraser") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && tool.type !== "text") {
      saveToHistory();
    }
    setIsDrawing(false);
  };

  const addText = () => {
    if (!textPosition || !textInput.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = tool.color;
    ctx.font = `${tool.size * 6}px Inter, sans-serif`;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput("");
    setTextPosition(null);
    saveToHistory();
    toast.success("✏️ Text added!");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
    toast.success("🧹 Canvas cleared!");
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataURL = canvas.toDataURL('image/png');
      localStorage.setItem('nebula_whiteboard', dataURL);
      toast.success("💾 Canvas saved!");
    } catch (error) {
      toast.error("Failed to save canvas");
    }
  };

  const loadCanvas = () => {
    const savedCanvas = localStorage.getItem('nebula_whiteboard');
    if (!savedCanvas) {
      toast.info("No saved canvas found");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToHistory();
      toast.success("📂 Canvas loaded!");
    };
    img.src = savedCanvas;
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `nebula-whiteboard-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success("📥 Canvas exported!");
  };

  const generateAISuggestion = () => {
    const suggestions = [
      "Try grouping related elements with different colors",
      "Add connecting lines between related concepts",
      "Use consistent shapes for similar types of content",
      "Consider adding labels or titles to your sections",
      "Try using the text tool to add explanations",
      "Use different line thicknesses to show hierarchy"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    toast.info(`💡 AI Suggestion: ${randomSuggestion}`);
  };

  const zoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.2, 3);
      toast.success(`🔍 Zoom: ${Math.round(newZoom * 100)}%`);
      return newZoom;
    });
  };

  const zoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.2, 0.3);
      toast.success(`🔍 Zoom: ${Math.round(newZoom * 100)}%`);
      return newZoom;
    });
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
                      tool.color === color ? 'border-white ring-2 ring-blue-400' : 'border-slate-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">Size:</span>
                <Select value={tool.size.toString()} onValueChange={(value) => setTool({ ...tool, size: parseInt(value) })}>
                  <SelectTrigger className="w-20 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 text-white">
                    <SelectItem value="1" className="text-white focus:bg-slate-600/50">1px</SelectItem>
                    <SelectItem value="2" className="text-white focus:bg-slate-600/50">2px</SelectItem>
                    <SelectItem value="3" className="text-white focus:bg-slate-600/50">3px</SelectItem>
                    <SelectItem value="5" className="text-white focus:bg-slate-600/50">5px</SelectItem>
                    <SelectItem value="8" className="text-white focus:bg-slate-600/50">8px</SelectItem>
                    <SelectItem value="12" className="text-white focus:bg-slate-600/50">12px</SelectItem>
                    <SelectItem value="20" className="text-white focus:bg-slate-600/50">20px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* History Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50"
              >
                <Undo className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= drawingHistory.length - 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50"
              >
                <Redo className="w-4 h-4" />
              </Button>

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
                onClick={saveCanvas}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={loadCanvas}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                Load
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
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
            </div>
          </div>
        </Card>

        {/* Text Input Modal */}
        {textPosition && (
          <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm border-slate-700/50 p-4 z-50">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Add Text</h3>
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="bg-slate-700/50 border-slate-600/50 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addText()}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button onClick={addText} className="bg-gradient-to-r from-green-600 to-teal-600">
                  Add Text
                </Button>
                <Button variant="outline" onClick={() => setTextPosition(null)} className="border-slate-600 text-slate-300">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Canvas */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={1200}
              height={700}
              className="w-full h-[700px] bg-slate-700 rounded-lg cursor-crosshair border border-slate-600/30"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            />
            
            {/* Canvas Overlay Info */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs text-slate-300 space-y-1">
                <div>Tool: {tool.type} | Size: {tool.size}px | Zoom: {Math.round(zoom * 100)}%</div>
                <div>Color: <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: tool.color }}></span></div>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white">Quick Tips</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>• Click colors to change brush color</div>
                <div>• Use text tool to add labels</div>
                <div>• Save your work with the save button</div>
                <div>• Use undo/redo for corrections</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIWhiteboard;
