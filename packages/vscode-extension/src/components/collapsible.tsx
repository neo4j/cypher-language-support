import { IconButton } from '@neo4j-ndl/react';
import {
  ChevronDownIconOutline,
  ChevronRightIconOutline,
} from '@neo4j-ndl/react/icons';
import React from 'react';

type CollapsibleProps = {
  title: string;
  active: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  active,
  onToggle,
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="collapsible">
      <div className="collapsible-header" data-expanded={expanded}>
        <IconButton
          isClean
          ariaLabel={expanded ? 'Collapse statement' : 'Expand statement'}
          htmlAttributes={{
            'aria-expanded': expanded,
            title: expanded ? 'Collapse statement' : 'Expand statement',
          }}
          onClick={() => {
            setExpanded((e) => !e);
          }}
          size="small"
        >
          {expanded ? (
            <ChevronDownIconOutline className="text-palette-neutral-text-weak" />
          ) : (
            <ChevronRightIconOutline className="text-palette-neutral-text-weak" />
          )}
        </IconButton>

        <div
          className="collapsible-title"
          data-active={active}
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <p className="collapsible-title-text">{title}</p>
        </div>
      </div>
      {expanded && <div className="collapsible-content">{children}</div>}
    </div>
  );
};
