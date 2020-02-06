import { _createElement } from "../../tools";
import Observable from "../../Observable/Observable";
import "./Handle.scss";

interface XY {
  x: number;
  y: number;
}
export class Handle extends Observable {
  readonly handle: HTMLElement;
  private point: HTMLElement;
  private bubble: HTMLElement;

  value!: number;
  shift!: XY;
  displayBubble!: boolean;
  private active: boolean;
  constructor() {
    super();
    this.shift = { x: 0, y: 0 };
    this.handle = _createElement("div", { class: "y-slider__handle" });
    this.point = _createElement("div", { class: "y-slider__point" });
    this.bubble = _createElement("div", { class: "y-slider__bubble" });
    this.handle.appendChild(this.point);
    this.handle.appendChild(this.bubble);

    this.onHandleDrag = this.onHandleDrag.bind(this);
    this.handle.addEventListener("mousedown", this.onHandleDrag);
    this.active = false;
  }

  draw() {
    this.bubble.innerText =
      this.value !== undefined ? this.value.toString() : "";
  }

  onHandleDrag (event: MouseEvent) {
    this.shift.x = event.clientX - this.handle.getBoundingClientRect().left;
    this.shift.y = event.clientY - this.handle.getBoundingClientRect().top;
    event.preventDefault();
    this.emit("handleDrag", event);
    this.setActive();
  };

  get isActive() {
    return this.active;
  }

  setActive() {
    this.active = true;
    this.point.classList.add("y-slider__point-active");
    if (this.displayBubble) {
      this.bubble.classList.add("y-slider__bubble-active");
    }
  }

  setInactive() {
    this.active = false;
    this.point.classList.remove("y-slider__point-active");
    this.bubble.classList.remove("y-slider__bubble-active");
  }
}

export default Handle;
