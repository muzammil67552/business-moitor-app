import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check } from "lucide-react";

interface HeaderCardProps {
  name: string;
  location: string;
  avatar: string;
  onNameChange: (newName: string) => void;
}

const HeaderCard = ({ name, location, avatar, onNameChange }: HeaderCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onNameChange(editedName);
    setIsEditing(false);
  };

  return (
    <div className="relative gradient-primary pt-8 pb-16 px-6 rounded-b-[44px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/30">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            {isEditing ? (
              <Input 
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-transparent text-white border-b-2 border-white/50 focus:border-white transition-all duration-300 text-base sm:text-lg font-semibold"
              />
            ) : (
              <h2 className="text-white font-semibold text-base sm:text-lg">{name}</h2>
            )}
            <p className="text-white/80 text-xs sm:text-sm">{location}</p>
          </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white animate-press"
          onClick={isEditing ? handleSaveClick : handleEditClick}
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default HeaderCard;
