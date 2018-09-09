import { h, updateElement } from './vdom';

declare global {
  namespace JSX {
    interface Element { }
    interface IntrinsicElements {
      [tagName: string]: any;
    }
  }
}

const Fragment: Function = () => {
  console.error('Fragment not implemented');
  throw new TypeError('Fragment not implemented')
}

const render: Function = (
  newNode: HTMLElement|Text,
  mountNode: HTMLElement
) : void => {
  updateElement(mountNode, newNode)
}

const micro = {
  render,
  h,
  Fragment
}

export default micro
