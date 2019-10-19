export function _createElement(name: string = "div", attributes?: any) {
  const element = document.createElement(name);
  Object.keys(attributes).forEach(attribute => {
    element.setAttribute(attribute, attributes[attribute]);
  });

  return element;
}

export function _asArray(a: any) {
  return Array.isArray(a) ? a : [a];
}

export function _range(value: number, min: number, max: number) {
  return value > min ? (value < max ? value : max) : min;
}
