
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Search, Download, Copy, FileText, Globe, BookOpen, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AIResearchAssistant = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState("formal");
  const [readingTime, setReadingTime] = useState("5min");

  const handleResearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a research topic");
      return;
    }

    // Get API key from localStorage
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (!apiKey) {
      toast.error("Please configure your API key in Settings");
      return;
    }

    setIsLoading(true);
    toast.info("🔍 Starting AI research...");
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Tekly NebulaBench",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1-distill-qwen-7b",
          "messages": [
            {
              "role": "user",
              "content": `Research the topic: "${query}". Please provide a comprehensive ${tone} analysis with the following structure:
              
              1. Executive Summary (2-3 sentences)
              2. Key Points (3-5 bullet points)
              3. Detailed Analysis (${readingTime} reading time)
              4. Related Topics for further research
              5. Suggested citations and sources
              
              Make it suitable for ${tone} tone and ${readingTime} reading time. Format with clear headings and bullet points for readability.`
            }
          ],
          "max_tokens": 2000,
          "temperature": 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResult = data.choices[0].message.content;
      setResult(aiResult);
      toast.success("✅ Research completed successfully!");
      
    } catch (error) {
      console.error("Research failed:", error);
      toast.error(`❌ Research failed: ${error.message}`);
      
      // Fallback demo response
      const fallbackResult = `# Research: ${query}

## Executive Summary
This comprehensive analysis explores ${query}, examining its key concepts, current trends, and implications across various domains. The research reveals significant developments and opportunities in this field.

## Key Points
• **Definition & Core Concepts**: Fundamental principles and foundational understanding
• **Current Trends**: Latest developments and market dynamics
• **Key Applications**: Primary use cases and real-world implementations  
• **Future Outlook**: Emerging opportunities and predicted developments
• **Challenges**: Current limitations and areas requiring attention

## Detailed Analysis (${readingTime} reading)

### Overview
${query} represents a significant area of interest with substantial implications across multiple sectors. Recent developments have accelerated adoption and innovation in this space.

### Current State
The field has experienced rapid growth, with increasing investment and research attention. Major stakeholders include industry leaders, academic institutions, and government organizations.

### Market Dynamics
- Growing market demand
- Increased competition
- Technological advancement
- Regulatory considerations

### Applications & Use Cases
Primary applications span across:
- Commercial implementations
- Research and development
- Educational applications
- Consumer products

## Related Topics for Further Research
• Advanced applications of ${query}
• Comparative analysis with similar technologies
• Economic impact and market analysis
• Regulatory and ethical considerations
• Future technological convergence

## Suggested Sources & Citations
• Academic journals in relevant fields
• Industry reports and white papers
• Government publications and data
• Expert interviews and case studies
• Recent conference proceedings

---
*Research completed using DeepSeek R1 AI | ${new Date().toLocaleDateString()}*`;

      setResult(fallbackResult);
      toast.info("📝 Showing demo research result");
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("📋 Copied to clipboard!");
  };

  const exportToPDF = () => {
    toast.info("📄 PDF export feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Research Assistant</h1>
              <p className="text-slate-400">Smart research with real-time AI summaries and citations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Research Topic
                </label>
                <Textarea
                  placeholder="Enter your research topic or question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tone
                  </label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 text-white">
                      <SelectItem value="formal" className="text-white focus:bg-slate-600/50">Formal</SelectItem>
                      <SelectItem value="informal" className="text-white focus:bg-slate-600/50">Informal</SelectItem>
                      <SelectItem value="academic" className="text-white focus:bg-slate-600/50">Academic</SelectItem>
                      <SelectItem value="conversational" className="text-white focus:bg-slate-600/50">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reading Time
                  </label>
                  <Select value={readingTime} onValueChange={setReadingTime}>
                    <SelectTrigger className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 text-white">
                      <SelectItem value="3min" className="text-white focus:bg-slate-600/50">3 minutes</SelectItem>
                      <SelectItem value="5min" className="text-white focus:bg-slate-600/50">5 minutes</SelectItem>
                      <SelectItem value="10min" className="text-white focus:bg-slate-600/50">10 minutes</SelectItem>
                      <SelectItem value="15min" className="text-white focus:bg-slate-600/50">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleResearch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Research
                  </>
                )}
              </Button>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300">Quick Research Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Artificial Intelligence",
                    "Climate Change",
                    "Blockchain Technology",
                    "Quantum Computing",
                    "Space Exploration"
                  ].map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      onClick={() => setQuery(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Research Results</h3>
                {result && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToPDF}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              <div className="min-h-[500px] bg-slate-700/30 rounded-lg p-6 border border-slate-600/30 overflow-y-auto">
                {result ? (
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-slate-200 text-sm leading-relaxed space-y-4"
                      style={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{ 
                        __html: result
                          .replace(/^# (.+)/gm, '<h1 class="text-xl font-bold text-white mb-3 border-b border-slate-600 pb-2">$1</h1>')
                          .replace(/^## (.+)/gm, '<h2 class="text-lg font-semibold text-blue-300 mb-2 mt-4">$1</h2>')
                          .replace(/^### (.+)/gm, '<h3 class="text-md font-medium text-cyan-300 mb-2 mt-3">$1</h3>')
                          .replace(/^\• (.+)/gm, '<li class="ml-4 text-slate-300">• $1</li>')
                          .replace(/^- (.+)/gm, '<li class="ml-4 text-slate-300">- $1</li>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a research topic to get started</p>
                      <p className="text-xs mt-2">AI-powered research with citations and analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIResearchAssistant;
