import React from "react";
import { TabsBar, TabButton, TabHighlight } from "./Tabs.styles";

export type Tab = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, className }) => {
  const activeIdx = tabs.findIndex(tab => tab.value === active);
  return (
    <TabsBar className={className} role="tablist">
      {tabs.map((tab, idx) => (
        <TabButton
          key={tab.value}
          $active={active === tab.value}
          $disabled={!!tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.value)}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          aria-disabled={!!tab.disabled}
          tabIndex={tab.disabled ? -1 : active === tab.value ? 0 : -1}
          disabled={!!tab.disabled}
        >
          {tab.label}
        </TabButton>
      ))}
      {activeIdx !== -1 && (
        <TabHighlight $index={activeIdx} $count={tabs.length} />
      )}
    </TabsBar>
  );
};

export default Tabs; 