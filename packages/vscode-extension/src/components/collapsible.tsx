import React from 'react';

type CollapsibleProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="collapsible">
      <div className="collapsible-header" onClick={onToggle} data-open={isOpen}>
        <div className="collapsible-icon" aria-hidden="true">
          {isOpen ? '>' : '>'}
        </div>
        <p className="collapsible-title">{title}</p>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};
