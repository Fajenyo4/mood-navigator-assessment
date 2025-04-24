
/**
 * Utility to prevent automatic page refreshes
 * This can be called from components that need to block refresh behavior
 */
export const preventPageRefresh = (): (() => void) => {
  // Block beforeunload event to prevent refresh confirmations
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  };

  // Add the event listener
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Block form submissions that might trigger refreshes
  const handleFormSubmit = (e: Event) => {
    // Only prevent default for forms that don't have a data-allow-submit attribute
    const form = e.target as HTMLFormElement;
    if (form && !form.hasAttribute('data-allow-submit')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Add listeners to all forms in the document
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
  
  // Return a cleanup function to remove these listeners when needed
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.querySelectorAll('form').forEach(form => {
      form.removeEventListener('submit', handleFormSubmit);
    });
  };
};
