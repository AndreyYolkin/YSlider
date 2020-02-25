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
  private margin!: Options["margin"];
  private range!: Options["range"];
  private orientation!: Options["orientation"];
  private order!: Array<number>;

  private move: boolean = false;

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
    const {
      orientation,
      values,
      range,
      step,
      margin,
      displaySteps,
      displayBubbles,
      connects
    } = options;
    this.range = range;
    this.step = step;
    this.margin = margin;
    this.orientation = orientation;
    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.onConnectClicked = this.onConnectClicked.bind(this);
    this.order = new Array(_asArray(values).length)
      .fill(0)
      .map((_, i) => i + 1);
    this.initEntities(_asArray(values).length);
    if (displaySteps) {
      this.initSteps(range, step);
    }
    this.setHandlesBubble(displayBubbles);
    this.setConnectsVisibility(connects);
    this.update(options);
  }

  update(options: Pick<Options, "range" | "values" | "step">) {
    const { range, values, step } = options;
    if (this.step !== step) {
      this.initSteps(range, step);
      this.step = step;
    }
    this.updateConnects({ range, values });
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
      connect.subscribe("connectClicked", (e: Event) =>
        this.onConnectClicked(e)
      );
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
    let clipping = _createElement("div", { class: "y-slider__steps_clipping" });
    for (let i = 0; i < range[1] - range[0] + step; i += step) {
      let HTMLstep = _createElement("div", { class: "y-slider__step" });
      clipping.appendChild(HTMLstep);
    }
    clipping.style.width = clipping.style.height = `${step *
      Math.ceil((range[1] - range[0]) / step)}%`;
    this.steps.appendChild(
      _createElement("div", { class: "y-slider__step y-slider__step-edge" })
    );
    this.steps.appendChild(clipping);
    this.steps.appendChild(
      _createElement("div", { class: "y-slider__step y-slider__step-edge" })
    );
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

  private changeOrder(handleIndex: number) {
    if (this.order.length > handleIndex && handleIndex >= 0) {
      this.order[handleIndex] = Math.max(...this.order) + 1;
      if (!this.order.includes(1)) {
        this.order = this.order.map(a => --a);
      }
    }
    this.handlesList.forEach((a, i) => a.setZIndex(this.order[i]));
  }

  private onConnectClicked(event: Event) {
    if (!this.move) {
      this.move = true; 
      let connectIndex: number = this.connectsList.findIndex(
        a => !a.clickArea.none
      );
      let handleIndex: number = 0;
      if (connectIndex >= 0) {
        const connect = this.connectsList[connectIndex];
        if (connectIndex == 0) {
          handleIndex = 0;
        } else if (connectIndex == this.connectsList.length - 1) {
          handleIndex = this.handlesList.length - 1;
        } else {
          if (this.orientation == "horizontal") {
            if (connect.clickArea.left) {
              handleIndex = connectIndex - 1;
            } else {
              handleIndex = connectIndex;
            }
          }
          if (this.orientation == "vertical") {
            if (connect.clickArea.top) {
              handleIndex = connectIndex - 1;
            } else {
              handleIndex = connectIndex;
            }
          }
        }
        let values = this.calculate(event, handleIndex);
        this.connectsList.forEach(a => (a.clickArea.none = true));
        this.emit("valuesChanged", values);
      }
      this.move = false; 
    }
  }

  private calculate(event: Event, handleIndex: number) {
    let range: Array<number> = [...this.range];
    if (handleIndex > 0) {
      range[0] = this.handlesList[handleIndex - 1].value + this.margin;
    }
    if (handleIndex < this.handlesList.length - 1) {
      range[1] = this.handlesList[handleIndex + 1].value - this.margin;
    }
    const { left, top, width, height } = this.slider.getBoundingClientRect();
    let size: number, offset: number, shiftAxis: "x" | "y", clientAxis: number;
    if (this.orientation === "vertical") {
      clientAxis = 0;
      shiftAxis = "y";
      size = height;
      offset = top;
      if (event instanceof MouseEvent) {
        clientAxis = event.clientY;
      }
      if (event instanceof TouchEvent) {
        clientAxis = event.touches[0].clientY;
      }
    } else {
      clientAxis = 0;
      shiftAxis = "x";
      size = width;
      offset = left;
      if (event instanceof MouseEvent) {
        clientAxis = event.clientX;
      }
      if (event instanceof TouchEvent) {
        clientAxis = event.touches[0].clientX;
      }
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
    return values;
  }

  private onHandleDrag() {
    if (!this.move) {
      this.move = true; 
      let handleIndex: number = this.handlesList.findIndex(a => a.isActive);
      this.changeOrder(handleIndex);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("touchend", this.onMouseUp);
      document.addEventListener("touchmove", this.onMouseMove);
    }
  }

  private onMouseMove(event: MouseEvent | TouchEvent) {
    let handleIndex: number = this.handlesList.findIndex(a => a.isActive);
    let values = this.calculate(event, handleIndex);
    this.emit("valuesChanged", values);
  }

  private onMouseUp = (event: MouseEvent | TouchEvent) => {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("touchend", this.onMouseUp);
    document.removeEventListener("touchmove", this.onMouseMove);
    this.handlesList.forEach(handle => handle.setInactive());
    this.move = false; 
  };

  compareRoot(root: HTMLElement) {
    return root === this.root;
  }
}

export default Slider;
