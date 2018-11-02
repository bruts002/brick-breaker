import { h, updateElement } from './vdom';
import Component from './Component';

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
  newNode: JSX.IntrinsicElements|HTMLElement|Text,
  mountNode: HTMLElement
) : void => {
  updateElement(mountNode, newNode)
}

const micro = {
  render,
  updateElement,
  h,
  Fragment,
  Component
}

export { Component };
export default micro;
