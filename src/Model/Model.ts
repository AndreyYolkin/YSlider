import Observable from "../Observable/Observable";
import {Options, defaults} from "../Options";
import ErrorBuilder from "./Error";

class Model extends Observable {
  private state!: Options;
  private defaults: Options = {
    ...defaults
  };
  constructor(options: Options) {
    super();

    options = { ...this.defaults, ...options };

    this.validateOptions = this.validateOptions.bind(this);
    this.checkOptionType = this.checkOptionType.bind(this);
    this.setState = this.setState.bind(this);
    this.setValue = this.setValue.bind(this);

    this.setState(options);
  }
  _isValidType(value: any, ...types: Array<string>) {
    let valid: Array<boolean> = [];
    types.forEach(type => {
      switch (type) {
        case "number": {
          valid.push(typeof value === "number");
          break;
        }
        case "string": {
          valid.push(typeof value === "string");
          break;
        }
        case "boolean": {
          valid.push(typeof value === "boolean");
          break;
        }
        case "arrayOfNumbers": {
          valid.push(
            Array.isArray(value) &&
              !!value.filter((a: any) => typeof a === "number")
          );
          break;
        }
        case "arrayOfStrings": {
          valid.push(
            Array.isArray(value) &&
              !!value.filter((a: any) => typeof a === "string")
          );
          break;
        }
        case "arrayOfBooleans": {
          valid.push(
            Array.isArray(value) &&
              !!value.filter((a: any) => typeof a === "boolean")
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
  
  checkOptionType(option: string, value: any) {
    let types: Array<string> = [];
    switch (option) {
      case "values": {
         types = ["number", "arrayOfNumbers", "string"];
         break;
      }
      case "range": {
         types = ["arrayOfStrings", "arrayOfNumbers"];
         break;
      }
      case "connects": {
         types = ["boolean", "arrayOfBooleans"];
         break;
      }
      case "step": {
         types = ["number"];
         break;
      }
      case "orientation": {
         types = ["orientation"];
         break;
      }
      case "displaySteps":
      case "displayBubbles": {
         types = ["boolean"];
         break;
      }
      default: {
        types = [];
      }
    }
    if (this._isValidType(value, ...types)) {
      return value;
    }
    return new ErrorBuilder(option, ...types);
  }

  validateOptions(options: any) {
    let keys: Array<string> = Object.keys(options);

    keys = keys.filter((key: string) =>
      this.checkOptionType(key, options[key])
    );

    let _state = { ...this.state };

    let order = [
      "range",
      "step",
      "values",
      "connects",
      "orientation",
      "displaySteps",
      "displayBubbles"
    ].filter(param => keys.includes(param));
    try {
      order.forEach(key => {
        switch (key) {
          case "range": {
            let range = options["range"];
            let result = this._getValidatedRange(range);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.range = result;
            }
            break;
          }
          case "step": {
            let step = options["step"],
              range = _state.range;
            let result = this._getValidatedStep(step, range);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.step = result;
            }
            break;
          }
          case "values": {
            let values = options["values"],
              range = _state.range,
              step = _state.step;
            let result = this._getValidatedSliderValue(values, range, step);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.values = result;
            }
            break;
          }
          case "orientation": {
            let orientation = options["orientation"];
            _state.orientation = orientation;
            break;
          }
          case "displaySteps": {
            let displaySteps = options["displaySteps"];
            _state.displaySteps = displaySteps;
            break;
          }
          case "displayBubbles": {
            let displayBubbles = options["displayBubbles"];
            _state.displayBubbles = displayBubbles;
            break;
          }
        }
      });
      return { ..._state };
    } catch (e) {
      return e;
    }
  }

  setValue(values: number | Array<number> | string) {
    let _state = { ...this.state },
      range = _state.range,
      step = _state.step;
    let _values = this._getValidatedSliderValue(values, range, step);
    if (_values instanceof ErrorBuilder) {
      _values.show();
    } else {
      this.state.values = _values;
      this.emit("valueUpdated", { ...this.state });
    }
  }

  setState(state: Partial<Options>) {
    let newState = this.validateOptions(state);
    if (newState instanceof ErrorBuilder) {
      newState.show();
    } else {
      this.state = { ...this.state, ...newState };
      this.emit("stateUpdated", { ...this.state });
    }
    return false;
  }

  getState() {
    return { ...this.state };
  }

  private _getValidatedRange(range: Array<number> | Array<string>) {
    if (range.length === 2 && typeof range[0] === "number") {
      let _length = Number(range[1]) - Number(range[0]);
      if (_length < 0) {
        [range[0], range[1]] = [range[1], range[0]];
        return range;
      }
      if (_length > 0) {
        return range;
      }
    } else if (
      (range.length > 2 && typeof range[0] === "number") ||
      (range.length > 1 && typeof range[0] === "string")
    ) {
      return range;
    }
    return new ErrorBuilder("range", "positive");
  }

  private _getValidatedStep(step: number, range: Array<any>) {
    if (range.length === 2 && typeof range[0] === "number") {
      let _length = Number(range[1]) - Number(range[0]);
      if (step > _length) {
        return _length;
      } else if (step > 0) {
        return step;
      }
      return new ErrorBuilder("step", "positive");
    }
    return new ErrorBuilder("step", "common");
  }

  private _getValidatedSliderValue(
    values: number | Array<number> | string,
    range: Array<number> | Array<string>,
    step: number = 1
  ) {
    const _checkRange = (
      value: number,
      range: Array<any>,
      step: number = 1
    ) => {
      let relValue = value - range[0];
      let result: number;
      if (relValue % step === 0 || relValue === range[1]) {
        result = value;
      } else {
        const _mod = relValue % step;
        const _delta = Math.min(_mod, step - _mod);
        if (_delta === _mod) {
          relValue -= _delta;
        } else {
          relValue += _delta;
        }
        result = relValue;
      }
      if (result < range[0]) result = range[0];
      if (result > range[1]) result = range[1];
      return result;
    };
    if (
      (typeof values === "number" && range.length > 2) ||
      (typeof values === "string" && range.length > 1)
    ) {
      let _finded: boolean = false;
      range.forEach((value: number | string) => {
        if (values === value) {
          _finded = true;
        }
      });
      if (_finded) {
        return values;
      } else {
        return range[0];
      }
    }
    if (typeof values === "number" && range.length === 2) {
      return _checkRange(values, range, step);
    }
    if (Array.isArray(values) && range.length === 2) {
      let _values = values.map(value => {
        return _checkRange(value, range, step);
      });
      _values.forEach((_, i: number) => {
        if (i && _values[i] <= _values[i - 1]) {
          _values[i] = _values[i - 1] + step;
        }
      });
      return _values;
    }
    return new ErrorBuilder("values", "range");
  }
}

export default Model;
