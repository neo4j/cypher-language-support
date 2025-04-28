import React, { cloneElement, useEffect, useRef, useState } from 'react';

export function ButtonGroup({ children }: { children: React.ReactNode }) {
  // const selectedIndex = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const parentRef = useRef<HTMLUListElement>(null);

  const focusElement = (index: number) => {
    const child = parentRef.current?.children[index]?.children[0];

    if (child instanceof HTMLElement) {
      child.focus();
    }
  };

  useEffect(() => {
    const childrenCount = React.Children.count(children);
    if (selectedIndex >= childrenCount) {
      setSelectedIndex(childrenCount - 1);
      return;
    }
    setSelectedIndex((prevIndex) => Math.max(0, prevIndex));
  }, [children, selectedIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    let newIndx = selectedIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      newIndx = (selectedIndex + 1) % React.Children.count(children);
      setSelectedIndex(newIndx);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      newIndx =
        (selectedIndex - 1 + React.Children.count(children)) %
        React.Children.count(children);
      setSelectedIndex(newIndx);
    }
    // set focus to new button
    focusElement(newIndx);
  };

  return (
    <ul
      onKeyDown={(e) => handleKeyDown(e)}
      ref={parentRef}
      style={{ all: 'inherit', listStyleType: 'none' }}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const clonedElement = cloneElement(child, {
          tabIndex: selectedIndex === index ? 0 : -1,
        } as React.HTMLAttributes<HTMLElement>);

        // oxlint-disable-next-line jsx-key
        return <li>{clonedElement}</li>;
      })}
    </ul>
  );
}
