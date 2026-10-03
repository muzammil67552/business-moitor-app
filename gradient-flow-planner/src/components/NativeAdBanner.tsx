import React, { useEffect, useState, useRef } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { X } from "lucide-react";

interface NativeAdBannerProps {
  className?: string;
  label?: string;
  isModalAd?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const AD_PLACEMENT_ID = "6093843";
const SCRIPT_SRC = "https://bauval.org/21/b5cd972fa94f123453e217acdf7e646a";
const SCRIPT_ELEMENT_ID = `adsterra-script-${AD_PLACEMENT_ID}`;
const CONTAINER_ID = "container-b5cd972fa94f123453e217acdf7e646a";

/**
 * NativeAdBanner Component
 * Integrates Adsterra Native Banner (Placement ID: 6093843)
 * 
 * Features:
 * - Inline layout presentation (not a sticky/fixed bottom overlay)
 * - User-friendly 'x' dismiss button to close/hide the ad at any time
 * - Coordinates DOM ID between modal and inline banner instances to prevent duplicate ID conflicts
 * - Responsive container suitable for mobile and desktop
 * - Clear "Sponsored" label matching the application's design system
 * - Graceful fallback / hidden container if dismissed or failed to load
 * - Reusable and isolated component architecture
 */
export const NativeAdBanner: React.FC<NativeAdBannerProps> = ({
  className = "",
  label = "Sponsored",
  isModalAd = false,
  dismissible,
  onDismiss,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLocallyDismissed, setIsLocallyDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely check if an ad modal is currently open and context dismissal state
  let isAdModalOpen = false;
  let isContextDismissed = false;
  let dismissInlineAd: (() => void) | undefined;

  try {
    const taskContext = useTasks();
    isAdModalOpen = taskContext.isAdModalOpen;
    isContextDismissed = taskContext.isInlineAdDismissed;
    dismissInlineAd = taskContext.dismissInlineAd;
  } catch {
    isAdModalOpen = false;
  }

  // Dismissible defaults to true for inline ads, false for modal ads unless explicitly specified
  const canDismiss = dismissible !== undefined ? dismissible : !isModalAd;

  // The ad is dismissed if locally dismissed or dismissed via task context
  const isDismissed = isLocallyDismissed || (!isModalAd && isContextDismissed);

  // To prevent duplicate container IDs in DOM:
  // When a modal ad is open, the modal receives the official CONTAINER_ID.
  // The inline ad yields its ID so Adsterra scripts target the modal container.
  const activeId = isModalAd
    ? CONTAINER_ID
    : isAdModalOpen
    ? `${CONTAINER_ID}-inline-paused`
    : CONTAINER_ID;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLocallyDismissed(true);
    if (!isModalAd) {
      dismissInlineAd?.();
    }
    onDismiss?.();
  };

  useEffect(() => {
    if (isDismissed) return;

    let isMounted = true;

    const handleScriptError = () => {
      if (isMounted) {
        setHasError(true);
        console.warn(
          `[Adsterra ${AD_PLACEMENT_ID}] Native ad script failed to load (likely blocked by client ad-blocker).`
        );
      }
    };

    // Check if script has already been injected to avoid duplicate loads in StrictMode
    const existingScript = document.getElementById(SCRIPT_ELEMENT_ID) as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = SCRIPT_ELEMENT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.onerror = handleScriptError;

      document.head.appendChild(script);
    } else {
      // Trigger Adsterra to populate the active container
      const triggerAdsterra = () => {
        const containerEl = document.getElementById(CONTAINER_ID) as (HTMLDivElement & { reload?: () => void }) | null;
        if (containerEl && typeof containerEl.reload === "function") {
          try {
            containerEl.reload();
            return;
          } catch {
            // fallback to popstate
          }
        }
        window.dispatchEvent(new Event("popstate"));
      };

      triggerAdsterra();
      const timer = setTimeout(triggerAdsterra, 80);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
    };
  }, [activeId, isModalAd, isDismissed]);

  // Gracefully hide ad slot if dismissed, blocked, or failed to avoid broken layouts
  if (isDismissed || hasError) {
    return null;
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header Bar: Sponsored Label & Dismiss 'X' Button */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 px-1 select-none">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70 bg-secondary/80 px-2 py-0.5 rounded-full border border-border/40">
          {label}
        </span>
        {canDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            className="flex items-center justify-center h-6 w-6 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-secondary/80 active:scale-95 transition-all"
            aria-label="Dismiss ad"
            title="Dismiss ad"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Official Adsterra Native Banner Container */}
      <div
        ref={containerRef}
        id={activeId}
        className="w-full min-h-[90px] rounded-2xl bg-card border border-border/50 shadow-card p-3 flex items-center justify-center overflow-hidden transition-all duration-200"
      />
    </div>
  );
};

export default NativeAdBanner;
