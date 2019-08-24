export default class ErrorBuilder extends Error {
  private _error: string;
  private _types: Array<string>;
  constructor(key: string, ...types: Array<string>) {
    const lasterror = ErrorBuilder.getError("" + types.pop());
    const errors = types.map(errtype => ErrorBuilder.getError(errtype));
    let msg;
    msg = `Error in key '${key}': value must be ${
      (types.length
        ? errors.join(", ") + " or "
        : ""
      ) 
      + lasterror}`;
    super(msg);
    this._error = msg;
    this._types = types;
  }
  private static getError(type: string) {
    const ErrorTypes: Record<string, string> = {
      number: "a number",
      string: "a string",
      boolean: "a boolean",
      arrayOfNumbers: "an array of numbers",
      arrayOfStrings: "an array of strings"
    };
    if (ErrorTypes[type]) {
      return ErrorTypes[type];
    }
    return;
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
