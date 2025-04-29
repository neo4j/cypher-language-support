import React from 'react';

// credits to https://www.regextester.com/96504, modified though
const URL_REGEX =
  // eslint-disable-next-line
  /(?:https?|s?ftp|bolt):\/\/(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gi;

interface ClickableUrlsProps {
  text?: string | null;
  WrappingTag?: keyof JSX.IntrinsicElements | React.ElementType;
}

function ClickableUrlsComponent({ text }: ClickableUrlsProps): JSX.Element {
  const definedText = text ?? '';
  const urls = definedText.match(URL_REGEX) ?? [];

  return (
    <>
      {definedText.split(URL_REGEX).map((t, index) => {
        /* since we never move these components this key should be fine */
        return (
          <React.Fragment key={`clickable-url-${index}`}>
            {t}
            {urls[index] && (
              // Should be safe from XSS.
              // Ref: https://mathiasbynens.github.io/rel-noopener/
              <a href={urls[index]} target="_blank" rel="noopener noreferrer">
                {urls[index]}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export const ClickableUrls = React.memo(ClickableUrlsComponent);
