import Observable from "./Observable";
import { expect, assert } from "chai";
import { spy, SinonSpy } from "sinon";
import "mocha";

describe("Observable", () => {
  const observable: Observable = new Observable();
  const callback: SinonSpy<any[], any> = spy();
  const message: string = "passed";
  const type: string = "observable";

  it("Should subscribe", () => {
    observable.subscribe(type, callback);
    const result = observable.getObservers(type).length;
    expect(result).equal(1);
  });
  it("Should emit event", () => {
    observable.subscribe(type, callback);
    observable.emit(type, message);
    assert(callback.calledWith(message));
  });
  it("Should unsubscribe", () => {
    observable.subscribe(type, callback);
    observable.unsubscribe(type, callback);
    const result = observable.getObservers(type).length;
    expect(result).equal(0);
  });
});
