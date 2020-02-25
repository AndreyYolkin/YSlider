import Observable from "../Observable/Observable";
import { ModelOptions } from "../Options";
import ErrorBuilder from "./Error";
import { _asArray } from "../tools";

class Model extends Observable {
  private state!: ModelOptions;

  constructor(options: ModelOptions) {
    super();
    this.validateOptions = this.validateOptions.bind(this);
    this.checkOptionType = this.checkOptionType.bind(this);
    this.setState = this.setState.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setState(options);
  }

  checkOptionType(option: string, value: any) {
    let types: Array<string> = [];
    switch (option) {
      case "values": {
        types = ["number", "arrayOfNumbers"];
        break;
      }
      case "range": {
        types = ["arrayOfNumbers"];
        break;
      }
      /*case "connects": {
        types = ["boolean", "arrayOfBooleans"];
        break;
      }*/
      case "step": {
        types = ["number"];
        break;
      }
      case "margin": {
        types = ["number"];
        break;
      }
      /*case "orientation": {
        types = ["orientation"];
        break;
      }
      case "displaySteps":
      case "displayBubbles": {
        types = ["boolean"];
        break;
      }*/
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

    keys = keys.filter(
      (key: string) =>
        !(this.checkOptionType(key, options[key]) instanceof ErrorBuilder)
    );
    let _state = { ...this.state };

    let order = [
      "range",
      "step",
      "margin",
      "values"
      /*"connects",
      "orientation",
      "displaySteps",
      "displayBubbles"*/
    ].filter(param => keys.includes(param));
    try {
      order.forEach(key => {
        switch (key) {
          case "range": {
            const { range } = options;
            let result = this._getValidatedRange(range);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.range = result;
            }
            break;
          }
          case "step": {
            const { step } = options,
              { range } = _state;
            let result = this._getValidatedStep(step, range);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.step = result;
            }
            break;
          }
          case "margin": {
            const { margin } = options,
              { step } = _state;
            let result = this._getValidatedMargin(step, margin);
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.margin = result;
            }
            break;
          }
          case "values": {
            const { values } = options,
              { range, step, margin } = _state;
            let result = this._getValidatedSliderValue(
              values,
              range,
              step,
              margin
            );
            if (result instanceof ErrorBuilder) {
              throw result;
            } else {
              _state.values = result;
            }
            break;
          }
          /*case "connects": {
            const { values } = _state,
              { connects } = options;
            if (Array.isArray(connects)) {
              if (_asArray(values).length != connects.length - 1) {
                throw new ErrorBuilder(
                  "connects",
                  "boolean",
                  "be an array and match handle count"
                );
              }
            }
            _state.connects = connects;
            break;
          }
          case "orientation": {
            _state.orientation = options.orientation;
            break;
          }
          case "displaySteps": {
            _state.displaySteps = options.displaySteps;
            break;
          }
          case "displayBubbles": {
            _state.displayBubbles = options.displayBubbles;
            break;
          }*/
        }
      });
      const state = keys.reduce(
        (a: Partial<ModelOptions>, i) => (a = { ...a, [i]: _state[i] }),
        {}
      );
      return { ...state };
    } catch (e) {
      return e;
    }
  }

  setValue(values: ModelOptions["values"]) {
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

  setState(state: Partial<ModelOptions>) {
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

  get values() {
    return this.state.values;
  }

  private _isValidType(value: any, ...types: Array<string>) {
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

  private _getValidatedRange(range: Array<number>) {
    if (range.length === 2) {
      let _length = Number(range[1]) - Number(range[0]);
      if (_length < 0) {
        [range[0], range[1]] = [range[1], range[0]];
      }
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

  private _getValidatedMargin(step: number, margin: number) {
    if (margin < 0) {
      return new ErrorBuilder("margin", "positive");
    }
    if (margin % step !== 0) {
      return new ErrorBuilder("margin", "divisible");
    }
    return margin;
  }

  private _getValidatedSliderValue(
    values: number | Array<number>,
    range: Array<number>,
    step: number = 1,
    margin: number = 0
  ) {
    const _checkRange = (
      values: number | Array<number>,
      range: Array<any>,
      step: number,
      margin: number
    ) => {
      let resultMapped = _asArray(values)
        .sort((a, b) => a - b)
        .map(value => {
          let relValue = value - range[0];
          let result;
          if (relValue % step === 0 || relValue === range[1]) {
            result = value;
          } else {
            const _mod = relValue % step;
            const _delta = Math.min(_mod, Math.max(margin, step) - _mod);
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
        });
      resultMapped.forEach((_, i) => {
        if (resultMapped[i] <= resultMapped[i - 1] + margin) {
          resultMapped[i] = Math.min(resultMapped[i - 1] + margin, range[1]);
        }
      });
      return resultMapped;
    };
    if (
      (typeof values === "number" || Array.isArray(values)) &&
      range.length === 2
    ) {
      return _checkRange(values, range, step, margin);
    }
    return new ErrorBuilder("values", "range");
  }
}

export default Model;
