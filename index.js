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

  if ( formEl.getAttribute('enctype') == "application/json" ) {
    formEl.addEventListener('submit', async submission => {
      submission.preventDefault();
      const fields = [...formEl.querySelectorAll('[name]:not(fieldset)')];
      const data = {};
      fields.forEach(f => {
        let value = 'default';
        const path = f.name.split(/[\[\]]/g).map(l => l.trim()).filter(l => l.length);
        switch(f.localName) {
          case "select": {
            break;
          }
          case "button": {
            break;
          }
          case "textarea" : {
            break;
          }
          default: {
            value = f.value || 'novalue';
          }
        }
        setPropertyAtPath(data, path, value);
      });
      const url = formEl.getAttribute('action');
      const method = formEl.getAttribute('method');
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': formEl.getAttribute('enctype')
          },
          body: JSON.stringify(data)
        });
        const text = await response.text();
        console.log("response", text);
      } catch(e) {
        console.warn(`Error making ${method} request to ${url}: ${e + e.stack}`);
      }
    }, {capture:true});
  }
}

function setPropertyAtPath(data, path, value) {
  let currentObject = data;
  let link = path[0];
  if ( path.length == 1 ) {
    data[link] = value;
  } else {
    let last = {link, type: getTypeOf(link)};
    for (let i = 1; i < path.length; i++) {
      link = path[i];
      const current = {link, type: getTypeOf(link)};

      let nextObject;
      if ( ! currentObject[last.link] ) {
        nextObject = getNextObject(current);
        currentObject[last.link] = nextObject;
      } else {
        nextObject = currentObject[last.link]
      }

      currentObject = nextObject;
      last = current;
    }
    currentObject[last.link] = value;
  }
}

function getTypeOf(link) {
  const numberValue = parseInt(link); 
  let linkType;
  if ( Number.isInteger(numberValue) ) {
    linkType = "array";
  } else {
    linkType = "object";
  }
  return linkType;
}

function getNextObject(lastLink) {
  let nextObject;
  switch(lastLink.type) {
    case "array": {
      nextObject = [];
      break;
    }
    case "object": {
      nextObject = {};
      break;
    }
  }
  return nextObject;
}
