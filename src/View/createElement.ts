export function createElement(name: string = "div", attributes?: any) {
  const element = document.createElement(name);
  Object.keys(attributes).forEach(attribute => {
    element.setAttribute(attribute, attributes[attribute]);
  });

  return element;
}

export default createElement;
