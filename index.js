function enhanceForm(formEl) {
  const walker = document.createTreeWalker(formEl, NodeFilter.SHOW_ELEMENT);
  while(walker.nextNode()) {
    const node = walker.currentNode;
    switch(node.localName) {
      case "fieldset": {
        // push name to stack
      }
      default: {
        if ( node.hasAttribute('name') ) {
          // convert name to nested
        }
      }
    }
  }
  if ( formEl.enctype == 'application/json' ) {
    formEl.addEventListener('submit', submission => {
      // convert fields to JSON object and programmatically send with fetch
    });
  }
}
