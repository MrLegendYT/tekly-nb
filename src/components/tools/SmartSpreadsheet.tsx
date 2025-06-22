
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calculator, 
  Brain,
  TrendingUp,
  PieChart,
  BarChart,
  LineChart
} from "lucide-react";
import { toast } from "sonner";

interface Cell {
  row: number;
  col: number;
  value: string;
  formula?: string;
  type?: "text" | "number" | "formula";
}

interface SpreadsheetData {
  [key: string]: Cell;
}

const SmartSpreadsheet = () => {
  const [data, setData] = useState<SpreadsheetData>({
    "0-0": { row: 0, col: 0, value: "Product", type: "text" },
    "0-1": { row: 0, col: 1, value: "Q1 Sales", type: "text" },
    "0-2": { row: 0, col: 2, value: "Q2 Sales", type: "text" },
    "0-3": { row: 0, col: 3, value: "Total", type: "text" },
    "1-0": { row: 1, col: 0, value: "Product A", type: "text" },
    "1-1": { row: 1, col: 1, value: "1000", type: "number" },
    "1-2": { row: 1, col: 2, value: "1200", type: "number" },
    "1-3": { row: 1, col: 3, value: "2200", type: "number" },
    "2-0": { row: 2, col: 0, value: "Product B", type: "text" },
    "2-1": { row: 2, col: 1, value: "800", type: "number" },
    "2-2": { row: 2, col: 2, value: "950", type: "number" },
    "2-3": { row: 2, col: 3, value: "1750", type: "number" },
  });

  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const rows = 10;
  const cols = 8;
  const columnLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellClick = (row: number, col: number) => {
    const key = getCellKey(row, col);
    setSelectedCell(key);
    setEditingCell(null);
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    const key = getCellKey(row, col);
    setEditingCell(key);
    setTempValue(data[key]?.value || "");
  };

  const handleCellChange = (value: string) => {
    setTempValue(value);
  };

  const handleCellSubmit = () => {
    if (editingCell) {
      const [row, col] = editingCell.split("-").map(Number);
      const newData = { ...data };
      
      newData[editingCell] = {
        row,
        col,
        value: tempValue,
        type: isNaN(Number(tempValue)) ? "text" : "number"
      };
      
      setData(newData);
      setEditing

Cell(null);
      setTempValue("");
    }
  };

  const generateAIInsights = () => {
    const insights = [
      "Product A shows 20% growth from Q1 to Q2",
      "Product B has steady performance with 18.75% increase",
      "Total sales increased by 19.32% quarter over quarter",
      "Consider focusing marketing efforts on Product A's success factors"
    ];
    
    toast.success("AI Insights generated! Check the insights panel.");
    return insights;
  };

  const autoCreateChart = () => {
    toast.info("Auto-generating chart based on selected data...");
  };

  const explainFormula = () => {
    if (selectedCell && data[selectedCell]?.formula) {
      toast.info(`Formula explanation: ${data[selectedCell]?.formula}`);
    } else {
      toast.info("Select a cell with a formula to get an explanation");
    }
  };

  const autoFillSuggestion = () => {
    toast.info("AI suggests filling down the pattern. Would you like to continue?");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Smart Spreadsheet</h1>
              <p className="text-slate-400">Excel-style sheets with AI formulas and auto-insights</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>

              <div className="h-6 w-px bg-slate-600"></div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoFillSuggestion}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Auto Fill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={explainFormula}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  Explain Formula
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoCreateChart}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  <BarChart className="w-4 h-4 mr-1" />
                  Auto Chart
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <SortAsc className="w-4 h-4 mr-1" />
                Sort
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Spreadsheet */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-12 h-8 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm"></th>
                      {columnLabels.slice(0, cols).map((label, index) => (
                        <th key={index} className="min-w-24 h-8 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rows }, (_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="w-12 h-8 bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm text-center">
                          {rowIndex + 1}
                        </td>
                        {Array.from({ length: cols }, (_, colIndex) => {
                          const key = getCellKey(rowIndex, colIndex);
                          const cell = data[key];
                          const isSelected = selectedCell === key;
                          const isEditing = editingCell === key;

                          return (
                            <td
                              key={colIndex}
                              className={`min-w-24 h-8 border border-slate-600/50 relative ${
                                isSelected ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-800/20 hover:bg-slate-700/30'
                              }`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                            >
                              {isEditing ? (
                                <Input
                                  value={tempValue}
                                  onChange={(e) => handleCellChange(e.target.value)}
                                  onBlur={handleCellSubmit}
                                  onKeyPress={(e) => e.key === 'Enter' && handleCellSubmit()}
                                  className="w-full h-full border-none bg-transparent text-white text-sm p-1"
                                  autoFocus
                                />
                              ) : (
                                <div className="p-1 text-sm text-white min-h-6 flex items-center">
                                  {cell?.value || ""}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Formula Bar */}
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-slate-400 w-16">
                  {selectedCell ? `${columnLabels[parseInt(selectedCell.split('-')[1])]}${parseInt(selectedCell.split('-')[0]) + 1}` : ''}
                </span>
                <Input
                  placeholder="Enter formula or value..."
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-orange-500/50"
                  value={selectedCell ? data[selectedCell]?.value || "" : ""}
                  readOnly
                />
              </div>
            </Card>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-white">AI Insights</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIInsights}
                  className="ml-auto border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Generate
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Growth Trend</span>
                  </div>
                  <p className="text-xs text-slate-300">Product A shows 20% growth from Q1 to Q2</p>
                </div>
                
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <BarChart className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Performance</span>
                  </div>
                  <p className="text-xs text-slate-300">Overall sales increased by 19.32% QoQ</p>
                </div>
              </div>
            </Card>

            {/* Quick Charts */}
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
              <h3 className="font-semibold text-white mb-4">Quick Charts</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  onClick={autoCreateChart}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Bar Chart
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  onClick={autoCreateChart}
                >
                  <LineChart className="w-4 h-4 mr-2" />
                  Line Chart
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  onClick={autoCreateChart}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Pie Chart
                </Button>
              </div>
            </Card>

            {/* Functions Helper */}
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4">
              <h3 className="font-semibold text-white mb-4">Common Functions</h3>
              
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-700/30 rounded">
                  <code className="text-orange-400">=SUM(A1:A10)</code>
                  <p className="text-slate-400 mt-1">Sum of range</p>
                </div>
                <div className="p-2 bg-slate-700/30 rounded">
                  <code className="text-orange-400">=AVERAGE(B1:B10)</code>
                  <p className="text-slate-400 mt-1">Average of range</p>
                </div>
                <div className="p-2 bg-slate-700/30 rounded">
                  <code className="text-orange-400">=MAX(C1:C10)</code>
                  <p className="text-slate-400 mt-1">Maximum value</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSpreadsheet;
