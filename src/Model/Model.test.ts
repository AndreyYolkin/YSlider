import { Options } from "../Options";
import Model from "./Model";
import ErrorBuilder from "./Error";
import { expect, assert } from "chai";
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
  model.setState(options);
  it("Check params type", () => {
    expect(model.checkOptionType("values", 10)).to.equal(10);
    expect(model.checkOptionType("values", [0, 10])).to.deep.equal([0, 10]);
    expect(model.checkOptionType("values", "string")).to.equal("string");

    expect(model.checkOptionType("range", [0, 10])).to.deep.equal([0, 10]);
    expect(model.checkOptionType("range", ["test1", "test2", "test3"])).to.deep.equal(
      ["test1", "test2", "test3"]
    );
  });
  it("Check wrong params type", () => {
    expect(model.checkOptionType("values", {})).to.be.an.instanceof(ErrorBuilder);
    expect(model.checkOptionType("values", 0)).to.deep.equal(0);
    expect(model.checkOptionType("values", "string")).to.equal("string");

    expect(model.checkOptionType("range", [0, 10])).to.deep.equal([0, 10]);
    expect(model.checkOptionType("range", ["test1", "test2", "test3"])).to.deep.equal(
      ["test1", "test2", "test3"]
    );
  });
  it("Validate value", () => {
    expect(model.validateOptions({ values: 5 })).to.deep.equal({ values: 5 });
    expect(model.validateOptions({ values: [0, 10] })).to.deep.equal({ values: [0, 10] });
  });
});
