import TaskCard from "./TaskCard";

interface Task {
  id: string;
  time: string;
  title: string;
  icon: string;
  progress: number;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  children?: React.ReactNode;
}

const TaskList = ({ tasks, onTaskClick, onToggleComplete, children }: TaskListProps) => {
  return (
    <div className="bg-white px-6 py-6 rounded-t-[36px] -mt-6 relative z-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Today's Tasks</h2>
      <div className="space-y-4 pb-24">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            time={task.time}
            title={task.title}
            icon={task.icon}
            progress={task.progress}
            isCompleted={task.isCompleted}
            onClick={() => onTaskClick(task.id)}
            onToggleComplete={() => onToggleComplete?.(task.id)}
          />
        ))}
        {children}
      </div>
    </div>
  );
};

export default TaskList;
