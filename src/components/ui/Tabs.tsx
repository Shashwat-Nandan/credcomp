"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      <div
        className="flex border-b border-surface-border"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "relative px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                isActive
                  ? "text-accent"
                  : "text-text-muted hover:text-text"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="pt-4"
      >
        {children(activeTab)}
      </div>
    </div>
  );
}
