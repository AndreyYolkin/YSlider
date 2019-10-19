import Observable from "../../Observable/Observable";
import Options from "../../Options";
import { _createElement } from "../../tools";
import { Handle } from "../Handle/Handle";
import { Connect } from "../Connect/Connect";
import "./Slider.scss";

export class Slider extends Observable {
  root: HTMLElement;
  slider!: HTMLElement;
  base!: HTMLElement;
  handles!: HTMLElement;
  connects!: HTMLElement;
  handlesList: Array<Handle>;
  connectsList: Array<Connect>;
  options!: Options;
  orientation: Options["orientation"];

  constructor(root: JQuery<HTMLElement>) {
    super();
    this.root = root[0];
    this.handlesList = [];
    this.connectsList = [];
    this.onResize = this.onResize.bind(this);
    window.onresize = this.onResize;
    this.orientation = "horizontal";
    this.init();
  }

  init() {
    this.drawSlider();
    this.initHandles(this.handlesList.length);
    this.initConnects(this.connectsList.length);
  }

  drawSlider(orientation = this.orientation) {
    this.orientation = orientation;
    this.slider = _createElement("div", {
      class: `y-slider y-slider__${orientation}`
    });
    this.base = _createElement("div", { class: `y-slider__base` });
    this.connects = _createElement("div", { class: `y-slider__connects` });
    this.handles = _createElement("div", { class: `y-slider__handles` });

    this.root.innerHTML = "";
    this.base.appendChild(this.connects);
    this.base.appendChild(this.handles);
    this.slider.appendChild(this.base);
    this.root.appendChild(this.slider);
  }

  initHandles(count: number) {
    this.handles.innerHTML = "";
    this.handlesList = [];
    for (let i = 0; i < count; i++) {
      let handle = new Handle();
      handle.subscribe("handleDrag", this.onHandleDrag);
      this.handlesList.push(handle);
      this.handles.appendChild(handle.handle);
    }
    this.drawHandles();
    return this;
  }

  drawHandles() {
    this.handlesList.forEach(handle => {
      handle.draw();
    });
  }
  
  setHandlesBuble(state: boolean) {
    this.handlesList.forEach(handle => {
      handle.displayBubble = state;
    });
  }

  initConnects(count: number) {
    this.connects.innerHTML = "";
    this.connectsList = [];
    for (let i = 0; i < count; i++) {
      let connect = new Connect();
      this.connectsList.push(connect);
      this.connects.appendChild(connect.connect);
    }
    this.drawConnects();
    return this;
  }

  drawConnects() {
    this.connectsList.forEach(connect => {
      connect.draw();
    });
  }

  setConnectsVisibility(visibilityList: Array<boolean>) {
    this.connectsList.forEach((connect, index) => {
      if (visibilityList[index]) {
        connect.setVisible();
      }
      else {
        connect.setInvisible();
      }
    });
    this.drawConnects();
  }

  onHandleDrag = (event: MouseEvent) => {
    this.emit("handleDrag", event);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove = (event: MouseEvent) => {
    this.handlesList
      .filter(a => a.isActive)
      .forEach(handle => (handle.distance = event.clientX - handle.shift));
    this.emit("handleMove");
  };

  onMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    this.handlesList.forEach(handle => handle.setInactive());
  };

  onResize = (event: Event) => {
    this.emit("windowResized");
  };
}

export default Slider;
