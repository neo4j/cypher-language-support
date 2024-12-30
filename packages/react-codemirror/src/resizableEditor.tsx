import { Extension } from '@codemirror/state';
import { EditorView, ViewPlugin } from '@codemirror/view';

const MIN_HEIGHT = 27.4;
const LINE_HEIGHT = 20;
const DRAG_HANDLE_SIZE = 14;
const MIN_LINES = 1;

function resizableEditor(): Extension {
  const resizeHandlePlugin = ViewPlugin.fromClass(
    class {
      private resizeHandle: HTMLDivElement;

      constructor(view: EditorView) {
        const scroller = view.scrollDOM;
        const handleOffset = view.dom.clientWidth / 2 - DRAG_HANDLE_SIZE;

        // Create a resize handle using the raw NDL icon svg
        this.resizeHandle = document.createElement('div');
        this.resizeHandle.innerHTML =
          '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.66667 6H9.33333C9.70152 6 10 6.29848 10 6.66667V7.33333C10 7.70152 9.70152 8 9.33333 8H8.66667C8.29848 8 8 7.70152 8 7.33333V6.66667C8 6.29848 8.29848 6 8.66667 6Z" fill="currentColor"></path><path d="M14.6667 6H15.3333C15.7015 6 16 6.29848 16 6.66667V7.33333C16 7.70152 15.7015 8 15.3333 8H14.6667C14.2985 8 14 7.70152 14 7.33333V6.66667C14 6.29848 14.2985 6 14.6667 6Z" fill="currentColor"></path><path d="M15.3333 16H14.6667C14.2985 16 14 16.2985 14 16.6667V17.3333C14 17.7015 14.2985 18 14.6667 18H15.3333C15.7015 18 16 17.7015 16 17.3333V16.6667C16 16.2985 15.7015 16 15.3333 16Z" fill="currentColor"></path><path d="M8.66667 11H9.33333C9.70152 11 10 11.2985 10 11.6667V12.3333C10 12.7015 9.70152 13 9.33333 13H8.66667C8.29848 13 8 12.7015 8 12.3333V11.6667C8 11.2985 8.29848 11 8.66667 11Z" fill="currentColor"></path><path d="M15.3333 11H14.6667C14.2985 11 14 11.2985 14 11.6667V12.3333C14 12.7015 14.2985 13 14.6667 13H15.3333C15.7015 13 16 12.7015 16 12.3333V11.6667C16 11.2985 15.7015 11 15.3333 11Z" fill="currentColor"></path><path d="M8.66667 16H9.33333C9.70152 16 10 16.2985 10 16.6667V17.3333C10 17.7015 9.70152 18 9.33333 18H8.66667C8.29848 18 8 17.7015 8 17.3333V16.6667C8 16.2985 8.29848 16 8.66667 16Z" fill="currentColor"></path></svg>';
        this.resizeHandle.className = 'cm-resize-handle';
        this.resizeHandle.style.position = 'absolute';
        this.resizeHandle.style.bottom = '0';
        this.resizeHandle.style.cursor = 'row-resize';
        this.resizeHandle.style.transform = `rotate(90deg) translate(16px, -${handleOffset}px)`;
        view.dom.appendChild(this.resizeHandle);

        let dragging = false;

        this.resizeHandle.addEventListener('mousedown', (event: MouseEvent) => {
          dragging = true;
          // Capture the height of the editor and the mouse position when the drag starts
          const startHeight = view.dom.offsetHeight;
          const startClientY = event.clientY;

          if (scroller) {
            // Hides the horizontal scrollbar while resizing, prevents flickering
            scroller.style.overflowX = 'hidden';
          }

          event.preventDefault();

          const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;

            // Calculate the new editor height based on its starting height, 
            // plus the delta between the current mouse position and the position when the drag started
            const verticalDragDelta = e.clientY - startClientY;
            const newEditorHeight = Math.max(MIN_HEIGHT, startHeight + verticalDragDelta);
            view.dom.style.height = newEditorHeight + 'px';

            // Calculate the number of visible lines in the editor based on the current contents
            const currentContent = view.state.doc.toString();
            const currentLines = currentContent.split('\n');

            // Find the last non-empty line in the editor
            let lastNonEmptyLine = currentLines.length - 1;
            while (
              lastNonEmptyLine >= 0 &&
              currentLines[lastNonEmptyLine].trim() === ''
            ) {
              lastNonEmptyLine--;
            }

            // Calculate the target number of new lines to create in/remove from the resized editor
            const minLines = Math.max(lastNonEmptyLine, MIN_LINES);
            const visibleLines = Math.floor(newEditorHeight / LINE_HEIGHT);
            const targetLines = Math.max(visibleLines, minLines);

            // If we're expanding the editor, continue to add empty lines
            // If we're shrinking the editor, remove empty lines until we reach the last non-empty line
            if (currentLines.length < targetLines) {
              while (currentLines.length < targetLines) {
                currentLines.push('');
              }
            } else if (currentLines.length > targetLines) {
              while (
                currentLines.length > targetLines &&
                currentLines[currentLines.length - 1].trim() === ''
              ) {
                currentLines.pop();
              }
            }

            // Only update the editor content if it has actually changed
            const newContent = currentLines.join('\n');
            if (newContent !== currentContent) {
              view.dispatch({
                changes: {
                  from: 0,
                  to: view.state.doc.length,
                  insert: newContent,
                },
              });
            }

            view.requestMeasure();
          };

          const onMouseUp = () => {
            dragging = false;

            if (scroller) {
              // Reset the horizontal scrollbar to its default state
              scroller.style.overflowX = '';
            }

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }

      destroy() {
        this.resizeHandle.remove();
      }
    },
  );

  return [
    EditorView.theme({
      '&': {
        position: 'relative',
        resize: 'none',
      },
    }),
    resizeHandlePlugin,
  ];
}

export default resizableEditor;
