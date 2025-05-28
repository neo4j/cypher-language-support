import { IconButton } from '@neo4j-ndl/react';
import {
  ChevronDownIconOutline,
  ChevronRightIconOutline,
  ExploreIcon,
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

        <span
          className="collapsible-title"
          data-active={active}
          onClick={onToggle}
        >
          <p className="collapsible-title-text">{title}</p>
          <IconButton
            isClean
            ariaLabel="Show visualization"
            size="small"
            className="collapsible-title-icon"
            isActive={active}
            htmlAttributes={{
              title: 'Show in visualization panel',
            }}
          >
            <ExploreIcon />
          </IconButton>
        </span>
      </div>
      {expanded && <div className="collapsible-content">{children}</div>}
    </div>
  );
};
