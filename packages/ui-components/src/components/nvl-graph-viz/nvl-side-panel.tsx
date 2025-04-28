import type { ResizeCallback } from 're-resizable';
import { Resizable } from 're-resizable';

import React from 'react';

type NvlSidePanelProps = {
  children: React.ReactNode;
  open: boolean;
  defaultWidth?: number;
  onResizeStop?: ResizeCallback;
};

export function NvlSidePanel({
  children,
  open,
  defaultWidth,
  onResizeStop,
}: NvlSidePanelProps) {
  if (!open) {
    return null;
  }

  const templateAreas = `"title closeButton"
   "content content"`;

  return (
    <Resizable
      defaultSize={{
        width: defaultWidth ?? 400,
        height: '100%',
      }}
      className="nvlResizable"
      minWidth={230}
      maxWidth="66%"
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleClasses={{ left: 'ml-1' }}
      onResizeStop={onResizeStop}
    >
      <div
        className="grid h-full gap-2 overflow-auto pt-2 font-sans"
        style={{
          gridTemplateAreas: templateAreas,
          gridTemplateRows: '36px 1fr',
          gridTemplateColumns: '1fr auto',
        }}
        data-testid="viz-inspector"
      >
        {children}
      </div>
    </Resizable>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-4 flex items-center" style={{ gridArea: 'title' }}>
      {children}
    </div>
  );
}
NvlSidePanel.Title = Title;

function Content({ children }: { children: React.ReactNode }) {
  return <section style={{ gridArea: 'content' }}>{children}</section>;
}
NvlSidePanel.Content = Content;
