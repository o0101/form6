export function enhanceForm(formEl) {
  const walker = document.createTreeWalker(formEl, NodeFilter.SHOW_ELEMENT);
  const fieldStack = [];
  while(walker.nextNode()) {
    const node = walker.currentNode;
    if ( ! node.hasAttribute('name') ) continue;
    // we need to do this because the walker does NOT show us closing tags
    // only NEXT tag in in-order DFS
    let parentIndex = fieldStack.length;
    while(parentIndex--) {
      const deepestParent = fieldStack[parentIndex];
      if ( deepestParent.contains(node) ) break;
    }
    fieldStack.length = parentIndex+1;
    switch(node.localName) {
      case "fieldset": {
        // push name to stack
        fieldStack.push(node);
        break;
      }
      default: {
        // convert name to nested
        const fieldNames = fieldStack.map(node => node.getAttribute('name'));
        if ( fieldNames.length ) {
          const fieldPath = `${fieldNames.shift()}${
            fieldNames.map(name => `[${name}]`).join('')
          }[${node.getAttribute('name')}]`;
          node.setAttribute('name', fieldPath);      
        }
        break;
      }
    }
  }
  if ( formEl.enctype == 'application/json' ) {
    formEl.addEventListener('submit', submission => {
      // convert fields to JSON object and programmatically send with fetch
    });
  }
}
