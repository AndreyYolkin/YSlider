import Observable from "../../Observable/Observable";
import Options from "../../Options";
import { _createElement, _asArray, _range } from "../../tools";
import { Handle } from "../Handle/Handle";
import { Connect } from "../Connect/Connect";
import "./Slider.scss";

export class Slider extends Observable {
  private root: HTMLElement;
  private slider!: HTMLElement;
  private entities!: HTMLElement;
  private steps!: HTMLElement;
  private handlesList: Array<Handle>;
  private connectsList: Array<Connect>;
  private step!: Options["step"];
  private range!: Options["range"];
  private orientation!: Options["orientation"];

  constructor(root: HTMLElement) {
    super();
    this.root = root;
    this.handlesList = [];
    this.connectsList = [];
    this.initEntities = this.initEntities.bind(this);
    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.prepare();
  }

  private prepare() {
    this.slider = _createElement("div", {
      class: `y-slider`
    });
    const base = _createElement("div", { class: `y-slider__base` });
    this.steps = _createElement("div", { class: `y-slider__steps` });
    this.entities = _createElement("div", { class: `y-slider__entities` });
    this.root.innerHTML = "";
    base.appendChild(this.entities);
    this.slider.appendChild(base);
    this.root.appendChild(this.slider);
  }

  init(options: Options) {
    const { orientation, values, range, step, displaySteps, displayBubbles, connects } = options;
    this.initEntities(_asArray(values).length);
    if (displaySteps) {
      this.initSteps(range, step);
    }
    this.range = range;
    this.step = step;
    this.orientation = orientation;
    this.setHandlesBubble(displayBubbles);
    this.setConnectsVisibility(connects);
    this.update(options);
  }

  update(
    options: Pick<Options, "range" | "values" | "displayBubbles" | "connects">
  ) {
    const { range, values, displayBubbles, connects } = options;
    this.updateConnects({ range: range, values: values });
    //this.setHandlesBubble(displayBubbles);
    //this.setConnectsVisibility(connects);
    this.updateHandles(values);
  }

  draw() {
    this.drawSlider();
    this.drawHandles();
    this.drawConnects();
  }

  destroy() {
    this.connectsList = [];
    this.handlesList = [];
    this.slider.remove();
  }

  private drawSlider() {
    this.slider.className = `y-slider y-slider-${this.orientation}`;
    return this;
  }

  private drawHandles() {
    this.handlesList.forEach(handle => {
      handle.draw();
    });
    return this;
  }

  private setHandlesBubble(state: boolean) {
    this.handlesList.forEach(handle => {
      handle.displayBubble = state;
    });
    return this;
  }

  private initEntities(count: number) {
    this.entities.innerHTML = "";
    this.connectsList = [];
    this.handlesList = [];
    for (let i = 0; i <= count; i++) {
      let connect = new Connect();
      this.connectsList.push(connect);
      this.entities.appendChild(connect.connect);
      if (i < count) {
        let handle = new Handle();
        handle.subscribe("handleDrag", this.onHandleDrag);
        this.handlesList.push(handle);
        this.entities.appendChild(handle.handle);
      }
    }
    return this;
  }

  private initSteps(range: Options["range"], step: Options["step"]) {
    this.steps.innerHTML = "";
    for (let i = 0; i < range[1] - range[0] + step; i += step) {
      let HTMLstep = _createElement("div", { class: "y-slider__step" });
      HTMLstep.style.marginRight = HTMLstep.style.marginBottom = `${Math.min(
        1,
        Math.min(
          (range[1] - range[0] - i) / (range[1] - range[0]),
          step / (range[1] - range[0])
        )
      ) * 100}%`;
      this.steps.appendChild(HTMLstep);
    }
    this.entities.appendChild(this.steps);
  }

  private updateConnects(options: Pick<Options, "range" | "values">) {
    const { range, values } = options;
    const points = [range[0], ..._asArray(values), range[1]];
    this.connectsList.forEach((connect, index) => {
      connect.flexGrow =
        (points[index + 1] - points[index]) / (range[1] - range[0]);
    });
  }

  private updateHandles(values: Options["values"]) {
    const handleValues = _asArray(values);
    this.handlesList.forEach((handle, index) => {
      handle.value = handleValues[index];
    });
  }

  private drawConnects() {
    this.connectsList.forEach(connect => {
      connect.draw();
    });
    return this;
  }

  private setConnectsVisibility(connects: Options["connects"]) {
    let booleanConnects = Connect.getArrayOfVisibiliteies(
      connects,
      this.connectsList.length
    );
    this.connectsList.forEach((connect, index) => {
      if (booleanConnects[index]) {
        connect.setVisible();
      } else {
        connect.setInvisible();
      }
    });
    return this;
  }

  private onHandleDrag(event: MouseEvent) {
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove(event: MouseEvent) {
    let handleIndex: number = this.handlesList.findIndex(a => a.isActive);
    let range: Array<number> = [...this.range];
    if (handleIndex > 0) {
      range[0] = this.handlesList[handleIndex - 1].value + this.step;
    }
    if (handleIndex < this.handlesList.length - 1) {
      range[1] = this.handlesList[handleIndex + 1].value - this.step;
    }
    const { left, top, width, height } = this.slider.getBoundingClientRect();
    let size: number, offset: number, shiftAxis: "x" | "y", clientAxis: number;
    if (this.orientation === "vertical") {
      shiftAxis = "y";
      clientAxis = event.clientY;
      size = height;
      offset = top;
    } else {
      shiftAxis = "x";
      clientAxis = event.clientX;
      size = width;
      offset = left;
    }
    let value = _range(
      ((clientAxis - this.handlesList[handleIndex].shift[shiftAxis] - offset) /
        size) *
        (this.range[1] - this.range[0]),
      range[0],
      range[1]
    );
    let values = this.handlesList.map(handle => handle.value);
    values[handleIndex] = value;
    this.emit("valuesChanged", values);
  }

  private onMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    this.handlesList.forEach(handle => handle.setInactive());
  };

  compareRoot(root: HTMLElement) {
    return root === this.root;
  }
}

export default Slider;
