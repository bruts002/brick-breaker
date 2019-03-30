// https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
// https://medium.com/@deathmood/write-your-virtual-dom-2-props-events-a957608f5c76

interface JSXType {
  type: HTMLElementTagNameMap;
  props: any;
  children: JSXType[];
}

export const h: Function = (
  type: HTMLElementTagNameMap,
  props: any = {},
  ...children: JSXType[]
): JSXType => {
  const spreadChildren: JSXType[] = [];
  children.forEach( child => {
    if (child instanceof Array) {
      spreadChildren.push(...child);
    } else {
      spreadChildren.push(child);
    }
  });
  return {
    type,
    props,
    children: spreadChildren
  };
};

export const createElement: Function = (node: JSXType|string): HTMLElement|Text => {
  if (typeof node === 'number') {
    throw TypeError(`children must either be a node or a string! typeof 'number' is not allowed`);
  }
  if (typeof node === 'string') {
    return document.createTextNode(String(node));
  }
  const $el: HTMLElement = document.createElement( String(node.type) );
  setProps($el, node.props);
  addEventListeners($el, node.props);
  node.children
    .map( (child: JSXType) => createElement(child))
    .forEach($el.appendChild.bind($el));
  return $el;
};

const changed: Function = (
  node1: JSXType|string,
  node2: JSXType|string
): boolean => {
  const differentTypes: boolean = typeof node1 !== typeof node2;
  if (differentTypes) return true;

  if (typeof node1 === 'string') {
    const str1 = node1 as string;
    const str2 = node2 as string;
    const differentStrings: boolean = str1 !== str2;
    if (differentStrings) return true;
  } else {
    const n1 = node1 as JSXType;
    const n2 = node2 as JSXType;
    const differentTypes: boolean = n1.type !== n2.type;
    if (differentTypes) return true;
  }
  return false;
};

export const updateElement: Function = (
  $parent: HTMLElement,
  newNode: JSXType|string,
  oldNode: JSXType|string,
  index = 0
): void => {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (typeof newNode === 'object' && typeof oldNode === 'object') {
    newNode.props = newNode.props || {};
    oldNode.props = oldNode.props || {};
    updateProps(
      $parent.childNodes[index],
      newNode.props,
      oldNode.props
    );
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
};

const setProp = (
  $target: HTMLElement,
  name: string,
  value: any
): void => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
};

const setProps = (
  $target: HTMLElement,
  props: any
): void => {
  for (const key in props) {
    setProp($target, key, props[key]);
  }
};

const setBooleanProp = (
  $target: HTMLElement,
  name: string,
  value: any
): void => {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
};

const isCustomProp = (name: string): boolean => {
  return isEventProp(name);
};

const removeBooleanProp = (
  $target: HTMLElement,
  name: string
): void => {
  $target.removeAttribute(name);
  $target[name] = false;
};

const removeProp = (
  $target: HTMLElement,
  name: string,
  value: any
): void => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
};

const updateProp = (
  $target: HTMLElement,
  name: string,
  newVal: any,
  oldVal: any
): void => {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
};

const updateProps: Function = (
  $target: HTMLElement,
  newProps: any,
  oldProps = {}
): void => {
  const props = { ...newProps, oldProps };
  for (const prop in props) {
    updateProp($target, prop, newProps[prop], oldProps[prop]);
  }
};

const isEventProp = (name: string): boolean => /^on/.test(name);

const extractEventName = (name: string): string => name.slice(2).toLowerCase();

const addEventListeners = (
  $target: HTMLElement,
  props: any = {}
): void => {
  props = props || {};
  Object.keys(props).forEach(name => {
    if (isEventProp(name)) {
      $target.addEventListener(
        extractEventName(name),
        props[name]
      );
    }
  });
};




// ---------------------------------------------------------------------
// const micro = {
//   createElement
// }

// const simple = (
//   <h1>Hello</h1>
// )
// const a = (
//   <ul>
//     <li>item 1</li>
//     <li>item 2</li>
//   </ul>
// );

// const b = (
//   <ul>
//     <li>item 1</li>
//     <li>hello!</li>
//   </ul>
// );

// const $root = document.getElementById('root');
// const $reload = document.getElementById('reload');

// updateElement($root, a);
// $reload.addEventListener('click', () => {
//   updateElement($root, b, a);
// });



