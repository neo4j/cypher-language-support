import { IconButton, Menu, Tooltip } from '@neo4j-ndl/react';
import { ArrowDownTrayIconOutline } from '@neo4j-ndl/react/icons';
import React from 'react';
import { useRef, useState } from 'react';

export type Downloadable = {
  title: string;
  isDisabled?: boolean;
  download: () => void;
};

export function DownloadButton({
  downloadables,
  clean,
  floating,
  buttonClassName = '',
}: {
  downloadables: Downloadable[];
  clean?: boolean;
  floating?: boolean;
  buttonClassName?: string;
}) {
  const [downloadMenuOpen, setOpen] = useState(false);
  const closeFileMenu = () => setOpen(false);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Menu
        isOpen={downloadMenuOpen}
        onClose={closeFileMenu}
        anchorRef={downloadButtonRef}
        className="mt-1"
      >
        <Menu.Items>
          {downloadables.map(({ title, isDisabled, download }) => (
            <Menu.Item
              isDisabled={isDisabled}
              title={title}
              key={title}
              onClick={() => {
                download();
                closeFileMenu();
              }}
            />
          ))}
        </Menu.Items>
      </Menu>
      <Tooltip type="simple" placement="bottom">
        <Tooltip.Trigger hasButtonWrapper>
          <IconButton
            ref={downloadButtonRef}
            isClean={clean}
            size="small"
            isFloating={floating}
            onClick={() => setOpen((o) => !o)}
            ariaLabel="Download"
            className={buttonClassName}
          >
            <ArrowDownTrayIconOutline />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content className="n-body-small">Download</Tooltip.Content>
      </Tooltip>
    </>
  );
}
