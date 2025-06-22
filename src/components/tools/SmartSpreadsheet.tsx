
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Plus, Download, Upload, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CellData {
  value: string;
  formula?: string;
}

const SmartSpreadsheet = () => {
  const [data, setData] = useState<{ [key: string]: CellData }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaInput, setFormulaInput] = useState("");
  const [rows] = useState(20);
  const [cols] = useState(10);

  const getCellId = (row: number, col: number) => `${String.fromCharCode(65 + col)}${row + 1}`;

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    const cellData = data[cellId];
    setFormulaInput(cellData?.formula || cellData?.value || "");
  };

  const handleCellChange = (cellId: string, value: string) => {
    setData(prev => ({
      ...prev,
      [cellId]: { value, formula: value.startsWith('=') ? value : undefined }
    }));
  };

  const exportToCSV = () => {
    toast.info("CSV export feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
              <Input
                placeholder="Formula bar (=SUM(A1:A10))"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                className="w-96 bg-slate-700/50 border-slate-600/50 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && selectedCell) {
                    handleCellChange(selectedCell, formulaInput);
                  }
                }}
              />
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </Card>

        {/* Spreadsheet */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 overflow-hidden">
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="w-12 h-8 border border-slate-600/50 text-slate-300 text-xs"></th>
                  {Array.from({ length: cols }, (_, i) => (
                    <th key={i} className="min-w-[100px] h-8 border border-slate-600/50 text-slate-300 text-xs">
                      {String.fromCharCode(65 + i)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="w-12 h-8 border border-slate-600/50 text-slate-400 text-xs text-center bg-slate-700/30">
                      {rowIndex + 1}
                    </td>
                    {Array.from({ length: cols }, (_, colIndex) => {
                      const cellId = getCellId(rowIndex, colIndex);
                      const cellData = data[cellId];
                      return (
                        <td key={colIndex} className="min-w-[100px] h-8 border border-slate-600/50">
                          <Input
                            value={cellData?.value || ""}
                            onChange={(e) => handleCellChange(cellId, e.target.value)}
                            onClick={() => handleCellClick(cellId)}
                            className={`w-full h-full border-none bg-transparent text-white text-xs p-1 focus:bg-slate-700/50 ${
                              selectedCell === cellId ? 'ring-2 ring-orange-500/50' : ''
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartSpreadsheet;
