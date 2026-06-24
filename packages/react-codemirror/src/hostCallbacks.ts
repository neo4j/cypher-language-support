/**
 * Lifecycle callbacks for host-rendered overlay content (inline panels, editor
 * action buttons, …). The host renders into the provided DOM container (e.g.
 * via React `createPortal`) and is expected to clean up on unmount.
 */
export type HostPortalCallbacks = {
  onMount: (container: HTMLElement) => void;
  onUnmount: () => void;
};
