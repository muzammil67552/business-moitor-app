import React, { useEffect, useState, useRef } from "react";
import { useTasks } from "@/contexts/TaskContext";

interface NativeAdBannerProps {
  className?: string;
  label?: string;
  isModalAd?: boolean;
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
 * - Prevents duplicate script injection in React StrictMode
 * - Coordinates DOM ID between modal and inline banner instances to prevent duplicate ID conflicts
 * - Responsive container suitable for mobile and desktop
 * - Clear "Sponsored" label matching the application's design system
 * - Graceful fallback / hidden container if blocked or failed to load
 * - Reusable and isolated component architecture
 */
export const NativeAdBanner: React.FC<NativeAdBannerProps> = ({
  className = "",
  label = "Sponsored",
  isModalAd = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely check if an ad modal is currently open
  let isAdModalOpen = false;
  try {
    const taskContext = useTasks();
    isAdModalOpen = taskContext.isAdModalOpen;
  } catch {
    isAdModalOpen = false;
  }

  // To prevent duplicate container IDs in DOM:
  // When a modal ad is open, the modal receives the official CONTAINER_ID.
  // The inline ad yields its ID so Adsterra scripts target the modal container.
  const activeId = isModalAd
    ? CONTAINER_ID
    : isAdModalOpen
    ? `${CONTAINER_ID}-inline-paused`
    : CONTAINER_ID;

  useEffect(() => {
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
  }, [activeId, isModalAd]);

  // Gracefully hide ad slot if blocked or failed to avoid broken layouts
  if (hasError) {
    return null;
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Sponsored Label */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 px-1 select-none">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70 bg-secondary/80 px-2 py-0.5 rounded-full border border-border/40">
          {label}
        </span>
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
