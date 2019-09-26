export default class ErrorBuilder extends Error {
  private _error: string;
  private _types: Array<string>;
  constructor(key: string, ...types: Array<string>) {
    const lasterror = ErrorBuilder.getError("" + types.pop());
    const errors = types.map(errtype => ErrorBuilder.getError(errtype));
    let msg;
    msg = `Error in key '${key}': value must be ${(types.length
      ? errors.join(", ") + " or "
      : "") + lasterror}`;
    super(msg);
    this._error = msg;
    this._types = types;
    this.getError = this.getError.bind(this);
    this.getTypes = this.getTypes.bind(this);

    Object.setPrototypeOf(this, ErrorBuilder.prototype);
  }
  private static getError(type: string) {
    const ErrorTypes: Record<string, string> = {
      /*Common errors*/
      common: "a valid type",
      nonConfig: "any possible type, but key isn't found in config or invalid",

      /*Types*/
      number: "a number",
      string: "a string",
      boolean: "a boolean",
      arrayOfNumbers: "an array of numbers",
      arrayOfStrings: "an array of strings",
      arrayOfBooleans: "an array of booleans",
      orientation: "\"horizontal\" or \"vertical\"",
      
      /*Validation Errors*/
      range: "in range",
      positive: "positive",
    };
    if (ErrorTypes[type]) {
      return ErrorTypes[type];
    }
    return;
  }

  toString() {
    return this.getError();
  }

  getError() {
    return this._error;
  }
  getTypes() {
    return this._types;
  }
  show() {
    console.error(this.getError());
  }
}
