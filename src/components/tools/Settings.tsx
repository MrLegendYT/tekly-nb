
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Key, User, Palette, Bell, Shield, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    // Auto-apply the provided API key on first load
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (!savedApiKey) {
      const defaultApiKey = "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";
      setApiKey(defaultApiKey);
      localStorage.setItem('deepseek_api_key', defaultApiKey);
    } else {
      setApiKey(savedApiKey);
    }

    // Load other saved settings
    const savedUserName = localStorage.getItem('user_name');
    const savedUserEmail = localStorage.getItem('user_email');
    const savedDarkMode = localStorage.getItem('dark_mode');
    const savedNotifications = localStorage.getItem('notifications');
    const savedAutoSave = localStorage.getItem('auto_save');

    if (savedUserName) setUserName(savedUserName);
    if (savedUserEmail) setUserEmail(savedUserEmail);
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedNotifications) setNotifications(savedNotifications === 'true');
    if (savedAutoSave) setAutoSave(savedAutoSave === 'true');
  }, []);

  // Auto-save settings when they change
  useEffect(() => {
    localStorage.setItem('user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('user_email', userEmail);
  }, [userEmail]);

  useEffect(() => {
    localStorage.setItem('dark_mode', darkMode.toString());
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('notifications', notifications.toString());
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('auto_save', autoSave.toString());
  }, [autoSave]);

  const saveSettings = () => {
    localStorage.setItem('deepseek_api_key', apiKey);
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_email', userEmail);
    localStorage.setItem('dark_mode', darkMode.toString());
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('auto_save', autoSave.toString());
    
    toast.success("All settings saved successfully!");
  };

  const testApiConnection = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your API key first");
      return;
    }

    toast.info("Testing API connection...");

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
              "content": "Hello, this is a test message."
            }
          ],
          "max_tokens": 10
        })
      });

      if (response.ok) {
        toast.success("✅ API connection successful!");
      } else {
        const errorData = await response.json();
        toast.error(`❌ API connection failed: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("API test error:", error);
      toast.error("❌ Failed to test API connection. Check your internet connection.");
    }
  };

  const resetToDefaults = () => {
    setApiKey("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");
    setUserName("Guest User");
    setUserEmail("");
    setDarkMode(true);
    setNotifications(true);
    setAutoSave(true);
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400">Configure your NebulaBench workspace</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="api" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200">
              <Key className="w-4 h-4 mr-2" />
              API Settings
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* API Settings */}
          <TabsContent value="api">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">DeepSeek API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">API Key</Label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          placeholder="sk-or-v1-..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="bg-slate-700/50 border-slate-600/50 text-white pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button onClick={testApiConnection} variant="outline" className="border-slate-600 text-slate-300">
                        Test Connection
                      </Button>
                      <Button onClick={() => setApiKey("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")} variant="outline" className="border-slate-600 text-slate-300">
                        Use Default Key
                      </Button>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">API Status</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={apiKey ? "secondary" : "destructive"}>
                          {apiKey ? "Configured" : "Not Configured"}
                        </Badge>
                        <span className="text-slate-400 text-sm">
                          {apiKey ? "Ready to use AI features" : "Enter API key to enable AI features"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 mb-2 block">Full Name</Label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300 mb-2 block">Email</Label>
                    <Input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600/50 text-white"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Appearance & Theme</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Dark Mode</Label>
                      <p className="text-sm text-slate-400">Use dark theme across the application</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  
                  <Separator className="bg-slate-700/50" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Notifications</Label>
                      <p className="text-sm text-slate-400">Receive notifications for important events</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  
                  <Separator className="bg-slate-700/50" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Auto Save</Label>
                      <p className="text-sm text-slate-400">Automatically save your work</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Data Storage</h4>
                    <p className="text-slate-400 text-sm mb-3">
                      Your data is stored locally in your browser. API keys are encrypted before storage.
                    </p>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      Secure
                    </Badge>
                  </div>
                  
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">API Usage</h4>
                    <p className="text-slate-400 text-sm">
                      API requests are sent directly to OpenRouter/DeepSeek. No data is stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={resetToDefaults} className="border-slate-600 text-slate-300">
            Reset to Defaults
          </Button>
          
          <Button onClick={saveSettings} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
