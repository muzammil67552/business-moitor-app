import { Mail, Calendar, Smile, Bell, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TaskCardProps {
  time: string;
  title: string;
  icon: string;
  progress: number;
  isCompleted: boolean;
  onClick?: () => void;
  onToggleComplete?: (e: React.MouseEvent) => void;
}

const iconMap = {
  mail: Mail,
  calendar: Calendar,
  smile: Smile,
  bell: Bell,
};

const TaskCard = ({ time, title, icon, progress, isCompleted, onClick, onToggleComplete }: TaskCardProps) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Mail;

  return (
    <div 
      onClick={onClick}
      className="flex items-start gap-4 bg-card p-4 rounded-2xl shadow-card hover:shadow-elevated transition-all cursor-pointer animate-press"
    >
      <div className="flex flex-col items-center gap-2 pt-1">
        <span className="text-sm font-semibold text-foreground whitespace-nowrap">{time}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.(e);
          }}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
            isCompleted ? "bg-primary" : "bg-muted hover:bg-muted/80"
          }`}
          title={isCompleted ? "Mark incomplete" : "Mark complete"}
          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          <CheckCircle2 className={`h-4 w-4 ${
            isCompleted ? "text-white" : "text-muted-foreground"
          }`} />
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <IconComponent className="h-4 w-4 text-foreground flex-shrink-0" />
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
  );
};

export default TaskCard;
