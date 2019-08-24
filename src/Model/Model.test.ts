import Options from "./Options";
import ErrorBuilder from "./Error";
import { expect, assert } from "chai";
import { spy, SinonSpy } from "sinon";
import "mocha";

describe("Errors", () => {
  it("Build simple error", () => {
    const error = new ErrorBuilder("test", "string");
    expect(error.message).to.equal(
      "Error in key 'test': value must be a string"
    );
  });
  it("Build combined error", () => {
    const error = new ErrorBuilder("test", "string", "number");
    expect(error.message).to.equal(
      "Error in key 'test': value must be a string or a number"
    );
  });
});

