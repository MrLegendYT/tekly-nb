
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
              
              Make it suitable for ${tone} tone and ${readingTime} reading time.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.choices[0].message.content);
      toast.success("Research completed successfully!");
      
    } catch (error) {
      console.error("Research failed:", error);
      // Fallback mock response for demo purposes
      setResult(`# Research: ${query}

## Executive Summary
This is a comprehensive analysis of ${query} that explores key concepts, current trends, and implications for the field.

## Key Points
• Primary concept and definition
• Current market trends and statistics
• Major stakeholders and applications
• Future outlook and predictions
• Critical challenges and opportunities

## Detailed Analysis
[This would contain the full ${readingTime} analysis based on the ${tone} tone requested. The actual implementation would use the DeepSeek R1 API to generate intelligent, contextual research.]

## Related Topics
• Related Topic A
• Related Topic B
• Related Topic C

## Suggested Sources
• Academic papers and journals
• Industry reports
• Expert interviews
• Government publications

*Note: ${apiKey ? 'Using your configured API key' : 'Add your OpenRouter API key in Settings for real AI research results'}.*`);
      
      if (!apiKey) {
        toast.info("Configure your API key in Settings for real AI research");
      } else {
        toast.error("Research failed - check your API key or try again");
      }
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const exportToPDF = () => {
    // Implement PDF export functionality
    toast.info("PDF export feature coming soon!");
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
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="informal">Informal</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reading Time
                  </label>
                  <Select value={readingTime} onValueChange={setReadingTime}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="3min">3 minutes</SelectItem>
                      <SelectItem value="5min">5 minutes</SelectItem>
                      <SelectItem value="10min">10 minutes</SelectItem>
                      <SelectItem value="15min">15 minutes</SelectItem>
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

              <div className="min-h-[400px] bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                {result ? (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-slate-200 font-sans text-sm leading-relaxed">
                      {result}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a research topic to get started</p>
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
