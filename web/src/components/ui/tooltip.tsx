"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "right",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const padding = 8;

    let x = 0;
    let y = 0;

    switch (position) {
      case "top":
        x = rect.left + rect.width / 2;
        y = rect.top - padding;
        break;
      case "bottom":
        x = rect.left + rect.width / 2;
        y = rect.bottom + padding;
        break;
      case "left":
        x = rect.left - padding;
        y = rect.top + rect.height / 2;
        break;
      case "right":
        x = rect.right + padding + 28; // Tăng lên 16px để dịch qua phải nhiều hơn
        y = rect.top + rect.height / 2;
        break;
    }

    setTooltipPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </div>

      {isVisible &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed pointer-events-none z-[999999]"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-gray-700/50 whitespace-nowrap">
              <div className="font-medium">{content}</div>
              {/* Arrow */}
              <div
                className={`absolute w-2 h-2 bg-gray-900/95 transform rotate-45 border border-gray-700/50 ${
                  position === "top"
                    ? "top-full -translate-x-1/2 -mt-1"
                    : position === "bottom"
                    ? "bottom-full -translate-x-1/2 -mb-1"
                    : position === "left"
                    ? "left-full -translate-y-1/2 -ml-1"
                    : "right-full -translate-y-1/2 -mr-1"
                }`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
