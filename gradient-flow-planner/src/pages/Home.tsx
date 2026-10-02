import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCard from "@/components/HeaderCard";
import TaskList from "@/components/TaskList";
import BottomNav from "@/components/BottomNav";
import AddTaskDialog from "@/components/AddTaskDialog";
import AlarmModal from "@/components/AlarmModal";
import NativeAdBanner from "@/components/NativeAdBanner";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "lucide-react";
import { userData } from "@/data/tasksData";
import { useTasks } from "@/contexts/TaskContext";

const Home = () => {
  const navigate = useNavigate();
  const { tasks, updateTask, showAdModal } = useTasks();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [name, setName] = useState(userData.name);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const willBeCompleted = !task.isCompleted;
    updateTask(taskId, {
      isCompleted: willBeCompleted,
      progress: willBeCompleted ? 100 : 0,
    });
    if (willBeCompleted) {
      showAdModal({
        title: "Task Completed! 🎉",
        subtitle: `Great job completing "${task.title}"! Keep up the momentum.`,
        actionType: "completed",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === "add") {
      setShowAddDialog(true);
    } else if (tab === "calendar") {
      navigate("/calendar");
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <HeaderCard 
        name={name}
        location={userData.location}
        avatar={userData.avatar}
        onNameChange={setName}
      />
      
      {/* Current Time Display */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-center gap-2 text-foreground">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-xl sm:text-2xl font-semibold">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks (complete or incomplete)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-6">
        <TaskList
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onToggleComplete={handleToggleComplete}
        >
          <div className="pt-2">
            <NativeAdBanner />
          </div>
        </TaskList>
      </div>
      <BottomNav activeTab="home" onTabChange={handleTabChange} />
      <AddTaskDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <AlarmModal />
    </div>
  );
};

export default Home;
