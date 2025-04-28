import type { TooltipProps } from '@neo4j-ndl/react';
import { IconButton, Tooltip } from '@neo4j-ndl/react';
import { Square2StackIconOutline } from '@neo4j-ndl/react/icons';
import type { MouseEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { copyToClipboard } from '../../utils/copy-to-clipboard';

const SUCCESS_MESSAGE = 'Copied';
const FAILURE_MESSAGE = 'Failed to copy';
const SHOW_MESSAGE_DURATION_SUCCESS = 1000;
const SHOW_MESSAGE_DURATION_FAIL = 2000;

type ClipboardCopierProps = {
  textToCopy: string;
  ariaLabel: string;
  iconButtonSize?: 'small' | 'medium' | 'large';
  title?: string;
  grouped?: boolean;
  className?: string;
  rightOffset?: number;
  topOffset?: number;
  clean?: boolean;
  floating?: boolean;
  placement?: TooltipProps['placement'];
};

export function useCopyWithMessage() {
  const [messageToShow, setMessageToShow] = useState<string | null>(null);

  useEffect(() => {
    if (messageToShow !== null) {
      const timeout =
        messageToShow === SUCCESS_MESSAGE
          ? SHOW_MESSAGE_DURATION_SUCCESS
          : SHOW_MESSAGE_DURATION_FAIL;
      const timer = setTimeout(() => setMessageToShow(null), timeout);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [messageToShow]);

  const copyWithMessage = (textToCopy: string) => {
    copyToClipboard(textToCopy)
      .then(() => setMessageToShow(SUCCESS_MESSAGE))
      .catch(() => setMessageToShow(FAILURE_MESSAGE));
  };

  return [messageToShow, copyWithMessage] as const;
}

export const ClipboardCopier = ({
  textToCopy,
  ariaLabel,
  iconButtonSize = 'small',
  title = 'Copy to clipboard',
  grouped = false,
  clean = true,
  floating,
  className,
  placement = 'left',
}: ClipboardCopierProps) => {
  const [messageToShow, copyWithMessage] = useCopyWithMessage();

  const onCopyClick = (e: MouseEvent<Element, globalThis.MouseEvent>) => {
    e.stopPropagation();
    copyWithMessage(textToCopy);
  };

  return (
    <Tooltip type="simple" placement={placement}>
      <Tooltip.Trigger hasButtonWrapper>
        <IconButton
          className={className}
          ariaLabel={ariaLabel}
          isGrouped={grouped}
          size={iconButtonSize}
          onClick={onCopyClick}
          htmlAttributes={{
            title: title,
          }}
          isClean={clean}
          isFloating={floating}
        >
          <Square2StackIconOutline />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content className="n-body-small">
        {messageToShow ?? title}
      </Tooltip.Content>
    </Tooltip>
  );
};
