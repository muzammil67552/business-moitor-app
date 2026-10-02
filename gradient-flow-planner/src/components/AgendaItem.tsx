import { Info, Presentation, Lightbulb, Users } from "lucide-react";

interface AgendaItemProps {
  icon: string;
  text: string;
}

const iconMap = {
  info: Info,
  presentation: Presentation,
  lightbulb: Lightbulb,
  users: Users,
};

const AgendaItem = ({ icon, text }: AgendaItemProps) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Info;

  return (
    <div className="flex items-center gap-3 bg-secondary px-4 py-3 rounded-2xl">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <IconComponent className="h-5 w-5 text-white" />
      </div>
      <p className="text-sm font-medium text-foreground">{text}</p>
    </div>
  );
};

export default AgendaItem;
