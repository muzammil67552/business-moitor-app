import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Bell, Sparkles } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import NativeAdBanner from "./NativeAdBanner";

export const TaskActionAdModal = () => {
  const { adModalData, isAdModalOpen, closeAdModal } = useTasks();

  if (!adModalData) return null;

  const getIcon = () => {
    switch (adModalData.actionType) {
      case "added":
        return (
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-primary shadow-sm mb-2 animate-bounce">
            <Clock className="w-7 h-7" />
          </div>
        );
      case "completed":
        return (
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        );
      case "alarm":
        return (
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm mb-2">
            <Bell className="w-7 h-7" />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
        );
    }
  };

  return (
    <Dialog open={isAdModalOpen} onOpenChange={(open) => !open && closeAdModal()}>
      <DialogContent className="max-w-md w-[92vw] sm:w-full rounded-3xl p-6 bg-card border border-border shadow-elevated">
        <DialogHeader className="flex flex-col items-center text-center">
          {getIcon()}
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {adModalData.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1 max-w-xs">
            {adModalData.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Official Adsterra Native Banner inside the modal */}
        <div className="mt-3 mb-2">
          <NativeAdBanner isModalAd={true} label="Sponsored" />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={closeAdModal}
            className="w-full gradient-primary text-white font-semibold py-2.5 rounded-xl shadow-card hover:opacity-95 animate-press"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskActionAdModal;
