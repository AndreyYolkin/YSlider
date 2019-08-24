import Model from "./Model";
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
describe("Model", () => {
  const options: Options = {
    values: 10,
    range: [0, 10]
  };
  const model = new Model(options);
  it("Check params type", () => {
    expect(model.checkType("values", 10)).to.equal(10);
    expect(model.checkType("values", [0, 10])).to.deep.equal([0, 10]);
    expect(model.checkType("values", "string")).to.equal("string");

    expect(model.checkType("range", [0, 10])).to.deep.equal([0, 10]);
    expect(model.checkType("range", ["test1", "test2", "test3"])).to.deep.equal(
      ["test1", "test2", "test3"]
    );
  });
});
