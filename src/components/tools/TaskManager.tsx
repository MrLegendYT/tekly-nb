
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Mic, Tag, Calendar, Clock, Trash2, Star, Edit } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
  starred: boolean;
  createdAt: Date;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskTags, setNewTaskTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('nebula_tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        })));
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks([]);
      }
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete AI Research Project",
          description: "Finish the comprehensive research on machine learning applications",
          completed: false,
          priority: "high",
          dueDate: "2024-12-30",
          tags: ["research", "ai", "urgent"],
          starred: true,
          createdAt: new Date()
        },
        {
          id: "2",
          title: "Review Meeting Notes",
          description: "Go through the quarterly planning meeting notes",
          completed: false,
          priority: "medium",
          dueDate: "2024-12-25",
          tags: ["meeting", "review"],
          starred: false,
          createdAt: new Date()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('nebula_tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('nebula_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) {
      toast.error("Task title is required");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      description: newTaskDescription.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      tags: newTaskTags ? newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      starred: false,
      createdAt: new Date()
    };

    setTasks([task, ...tasks]);
    
    // Reset form
    setNewTask("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    setNewTaskTags("");
    
    toast.success("✅ Task added successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        toast.success(updated.completed ? "✅ Task completed!" : "↩️ Task reopened");
        return updated;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("🗑️ Task deleted!");
  };

  const toggleStar = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, starred: !task.starred };
        toast.success(updated.starred ? "⭐ Task starred!" : "☆ Star removed");
        return updated;
      }
      return task;
    }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
    toast.success("✅ Task updated!");
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    toast.info("🎤 Voice recording feature coming soon!");
    setTimeout(() => setIsRecording(false), 2000);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const starredTasks = filteredTasks.filter(task => task.starred);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Task & Notes Manager</h1>
              <p className="text-slate-400">Intelligent task management with voice-to-note and semantic search</p>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Input
                placeholder="Task title..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500/50"
              />
              <Button
                onClick={startVoiceRecording}
                variant="outline"
                className={`border-slate-600 text-slate-300 hover:bg-slate-700/50 ${isRecording ? 'bg-red-500/20 border-red-500/30' : ''}`}
              >
                <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse text-red-400' : ''}`} />
              </Button>
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />
              
              <Select value={newTaskPriority} onValueChange={(value: "low" | "medium" | "high") => setNewTaskPriority(value)}>
                <SelectTrigger className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 text-white">
                  <SelectItem value="low" className="text-white focus:bg-slate-600/50">Low Priority</SelectItem>
                  <SelectItem value="medium" className="text-white focus:bg-slate-600/50">Medium Priority</SelectItem>
                  <SelectItem value="high" className="text-white focus:bg-slate-600/50">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50 text-white"
              />
              
              <Input
                placeholder="Tags (comma separated)"
                value={newTaskTags}
                onChange={(e) => setNewTaskTags(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4 mb-6">
          <div className="flex space-x-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tasks and notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500/50"
              />
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {pendingTasks.length} Pending
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {completedTasks.length} Completed
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {starredTasks.length} Starred
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tasks List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700/50">All Tasks ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700/50">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-slate-700/50">Completed ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="starred" className="data-[state=active]:bg-slate-700/50">Starred ({starredTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">No tasks found. Create your first task above!</p>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                  onToggleStar={toggleStar}
                  onUpdate={updateTask}
                  getPriorityColor={getPriorityColor}
                  isEditing={editingTask === task.id}
                  setEditing={setEditingTask}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onToggleStar={toggleStar}
                onUpdate={updateTask}
                getPriorityColor={getPriorityColor}
                isEditing={editingTask === task.id}
                setEditing={setEditingTask}
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onToggleStar={toggleStar}
                onUpdate={updateTask}
                getPriorityColor={getPriorityColor}
                isEditing={editingTask === task.id}
                setEditing={setEditingTask}
              />
            ))}
          </TabsContent>

          <TabsContent value="starred" className="space-y-4">
            {starredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onToggleStar={toggleStar}
                onUpdate={updateTask}
                getPriorityColor={getPriorityColor}
                isEditing={editingTask === task.id}
                setEditing={setEditingTask}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onToggle, onDelete, onToggleStar, onUpdate, getPriorityColor, isEditing, setEditing }: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  getPriorityColor: (priority: string) => string;
  isEditing: boolean;
  setEditing: (id: string | null) => void;
}) => {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, description: editDescription });
  };

  return (
    <Card className={`bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-4 hover:border-slate-600/50 transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              />
            ) : (
              <h3 className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                {task.title}
              </h3>
            )}
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.starred && (
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            )}
          </div>
          
          {(task.description || isEditing) && (
            <div className="mb-2">
              {isEditing ? (
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description..."
                  className="bg-slate-700/50 border-slate-600/50 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                />
              ) : (
                <p className="text-sm text-slate-400">{task.description}</p>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {task.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <div className="flex space-x-1">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{task.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-400 hover:text-green-300"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(null)}
                className="text-slate-400 hover:text-slate-300"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(task.id)}
                className="text-slate-400 hover:text-blue-400"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStar(task.id)}
                className="text-slate-400 hover:text-yellow-400"
              >
                <Star className={`w-4 h-4 ${task.starred ? 'fill-current text-yellow-400' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskManager;
