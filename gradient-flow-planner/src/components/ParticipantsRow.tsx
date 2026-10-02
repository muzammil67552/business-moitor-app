import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ParticipantsRowProps {
  participants: string[];
  onAddParticipant?: () => void;
}

const ParticipantsRow = ({ participants, onAddParticipant }: ParticipantsRowProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Participants</h3>
      <div className="flex items-center gap-2">
        {participants.map((avatar, index) => (
          <Avatar key={index} className="h-12 w-12 border-2 border-white">
            <AvatarImage src={avatar} alt={`Participant ${index + 1}`} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              P{index + 1}
            </AvatarFallback>
          </Avatar>
        ))}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 animate-press"
          onClick={onAddParticipant}
          aria-label="Add participant"
        >
          <Plus className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default ParticipantsRow;
