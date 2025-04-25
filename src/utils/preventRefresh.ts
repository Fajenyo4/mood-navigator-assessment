
/**
 * Utility to prevent automatic page refreshes and form submissions
 * Enhanced version with improved event handling and cleanup
 */
export const preventPageRefresh = (): (() => void) => {
  console.log('Setting up page refresh prevention');
  
  // Block beforeunload event to prevent refresh confirmations
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  };

  // Block F5 key and other refresh shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Block F5 (116) and Ctrl+R (82)
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
      e.preventDefault();
      console.log('Blocked refresh keyboard shortcut');
    }
  };
  
  // Block form submissions that might trigger refreshes
  const handleFormSubmit = (e: Event) => {
    // Only prevent default for forms that don't have a data-allow-submit attribute
    const form = e.target as HTMLFormElement;
    if (form && !form.hasAttribute('data-allow-submit')) {
      console.log('Prevented form submission that might cause refresh');
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Block clicks on links that might refresh
  const handleLinkClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link && !link.hasAttribute('data-allow-navigation')) {
      // Only block if href is current page or empty
      const href = link.getAttribute('href');
      if (href === window.location.href || href === '#' || href === '') {
        console.log('Prevented link navigation that might cause refresh');
        e.preventDefault();
      }
      
      // Allow external links to open in new tabs automatically for better UX
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        if (!link.getAttribute('target')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }
  };

  // Add all listeners
  window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
  document.addEventListener('keydown', handleKeyDown, { capture: true });
  document.addEventListener('click', handleLinkClick, { capture: true });
  
  // Add listeners to all forms in the document
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit, { capture: true });
  });

  // Create a mutation observer to watch for new forms that might be added
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const forms = document.querySelectorAll('form:not([data-observed])');
        forms.forEach(form => {
          form.setAttribute('data-observed', 'true');
          form.addEventListener('submit', handleFormSubmit, { capture: true });
        });
      }
    }
  });

  // Start observing the document for form additions
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Return a comprehensive cleanup function
  return () => {
    console.log('Removing page refresh prevention');
    window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
    document.removeEventListener('keydown', handleKeyDown, { capture: true });
    document.removeEventListener('click', handleLinkClick, { capture: true });
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.removeEventListener('submit', handleFormSubmit, { capture: true });
      form.removeAttribute('data-observed');
    });
    
    observer.disconnect();
  };
};
