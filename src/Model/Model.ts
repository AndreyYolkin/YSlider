import Observable from "../Observable/Observable";
import Options, { orientation } from "./Options";
import ErrorBuilder from "./Error";

class Model extends Observable {
  private defaults: Options = {
    values: 0,
    range: [0, 100],
    step: 1,
    orientation: orientation.vertical,
    displayBubbles: false,
    displaySteps: false
  };
  //private values: number | Array<number> | Array<string>;
  constructor(options: Options) {
    super();

    options = Object.assign(this.defaults, options);

    this.validate = this.validate.bind(this);
    this.checkType = this.checkType.bind(this);

    this.setState(options);
    this.setValue(options.values);
  }
  checkType(option: any, value: any) {
    switch (option) {
      case "values": {
        const numArray =
          Array.isArray(value) &&
          !!value.filter((a: any) => typeof a === "number");
        const num = typeof value === "number";
        const str = typeof value === "string";

        if (numArray || num || str) {
          return value;
        }
        return new ErrorBuilder(option, "number", "arrayOfNubers", "string");
      }
      case "range": {
        const numArray =
          Array.isArray(value) &&
          !!value.filter((a: any) => typeof a === "number");
        const numString =
          Array.isArray(value) &&
          !!value.filter((a: any) => typeof a === "string");
        if (numArray || numString) {
          return value;
        }
        return new ErrorBuilder(option, "arrayOfStrings", "arrayOfNubers");
      }
    }
  }
  validate(value: any, expected: any) {}
  setValue(values: any) {
    return;
  }
  setState(values: any) {
    return;
  }
  getState() {
    return {};
  }
}

export default Model;
