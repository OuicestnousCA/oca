import { useState } from "react";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-bar animate-slide-down">
      <div className="container flex items-center justify-center gap-4">
        <span className="font-body">
          Subscribe to our mailing list and get <strong>10% off</strong> your first purchase.
        </span>
        <button 
          onClick={() => setIsVisible(false)}
          className="underline hover:no-underline transition-all font-medium"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
