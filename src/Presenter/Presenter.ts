import Model from "../Model/Model";
import Slider from "../View/Slider/Slider";
import { _asArray, _range } from "../tools";

export class Presenter {
  model: Model;
  view: Slider;
  constructor(model: Model, view: Slider) {
    this.model = model;
    this.view = view;
    this.updateView = this.updateView.bind(this);
    console.log(this.model.getState());
    let valuesCount = _asArray(model.getState().values).length,
        connects = model.getState().connects;
    console.log(connects);
    this.view
      .initHandles(valuesCount)
      .initConnects(valuesCount + 1)
      .setConnectsVisibility(
        Array.isArray(connects)
          ? _asArray(connects)
          : [false, ...Array(valuesCount - 1).fill(connects), false]
      );
    this.view.subscribe("handleMove", this.calculate);
    this.view.subscribe("windowResized", this.updateView);
    this.updateView();
  }

  getView() {
    return { handles: this.view.handlesList };
  }

  calculate = () => {
    let newValues: Array<number> = [];
    const { width, left } = this.view.slider.getBoundingClientRect();
    const handles = this.view.handlesList;
    const { range, step } = this.model.getState();
    newValues = handles
      .map(
        (handle, index) =>
          (_range(
            (handle.isActive
              ? _range(
                  handle.distance,
                  handles[index > 0 ? index - 1 : 0].distance,
                  handles[
                    index < handles.length - 1 ? index + 1 : handles.length - 1
                  ].distance
                )
              : handle.distance) -
              left +
              6,
            0,
            width
          ) /
            width) *
            (range[1] - range[0]) +
          range[0]
      )
      .map((num, index, nums) => {
        if (handles[index].isActive) {
          if (index > 0 && num < nums[index - 1] + (step ? step : 0)) {
            num = nums[index - 1] + (step ? step : 0);
          }
          if (
            index < handles.length &&
            num > nums[index + 1] - (step ? step : 0)
          ) {
            num = nums[index + 1] - (step ? step : 0);
          }
        }
        return num;
      });
    this.model.setState({ values: newValues });
    this.updateView();
    document.body.style.cursor = "pointer";
  };

  updateView() {
    const { width, left } = this.view.slider.getBoundingClientRect();
    const handles = this.view.handlesList;
    const connects = this.view.connectsList;
    const { values, range } = this.model.getState();

    handles.forEach((handle, index) => {
      handle.position =
        ((_asArray(values)[index] - range[0]) * width) / (range[1] - range[0]) -
        6;
      handle.distance = handle.position + left - 3;
      handle.value = Array.isArray(values) ? values[index] : values;
    });

    const points = [range[0], ..._asArray(values), range[1]];
    console.log(points);
    connects.forEach((connect, index) => {
      connect.flexGrow =
        (points[index + 1] - points[index]) / (range[1] - range[0]);
    });

    this.view.drawHandles();
    this.view.drawConnects();
  }
}
