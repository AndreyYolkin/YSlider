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

export function _isValidType(value: any, ...types: Array<string>) {
  let valid: Array<boolean> = [];
  types.forEach(type => {
    switch (type) {
      case "number":
      case "string":
      case "boolean": {
        valid.push(typeof value === type);
        break;
      }
      case "arrayOfNumbers":
      case "arrayOfStrings":
      case "arrayOfBooleans": {
        valid.push(
          Array.isArray(value) &&
            !!value.filter(
              (a: any) => typeof a === type.slice(7, -1).toLowerCase()
            )
        );
        break;
      }
      case "orientation": {
        valid.push(value === "horizontal" || value === "vertical");
      }
      default: {
        valid.push(false);
      }
    }
  });
  return valid.includes(true);
}

export function _getBooleanArray(
  truthy: boolean | Array<boolean>,
  count: number
): Array<boolean> {
  let result: Array<boolean>;
  if (Array.isArray(truthy)) {
    result = truthy;
  } else {
    result = [false, ...Array(count - 2).fill(truthy), false];
  }
  return result;
}