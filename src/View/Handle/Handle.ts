import { _createElement } from "../../tools";
import Observable from "../../Observable/Observable";
import "./Handle.scss";

export class Handle extends Observable {
  readonly handle: HTMLElement;
  private point: HTMLElement;
  private bubble: HTMLElement;

  value!: string | number;
  position!: number;
  distance!: number;
  shift!: number;
  displayBubble!: boolean;
  private active: boolean;
  constructor() {
    super();
    this.handle = _createElement("div", { class: "y-slider__handle" });
    this.point = _createElement("div", { class: "y-slider__point" });
    this.bubble = _createElement("div", { class: "y-slider__bubble" });
    this.handle.appendChild(this.point);
    this.handle.appendChild(this.bubble);
    this.handle.addEventListener("mousedown", this.onHandleDrag);
    this.active = false;
  }

  draw() {
    this.handle.style.transform = `translateX(${this.position}px)`;
    this.bubble.innerText =
      this.value !== undefined ? this.value.toString() : "";
  }

  onHandleDrag = (event: MouseEvent) => {
    this.shift = event.clientX - this.handle.getBoundingClientRect().left;
    event.preventDefault();
    this.emit("handleDrag", event);
    this.setActive();
  };

  get isActive() {
    return this.active;
  }

  setActive() {
    this.active = true;
    if (this.displayBubble) {
      this.bubble.classList.add("y-slider__bubble-active");
    }
  }

  setInactive() {
    this.active = false;
    this.bubble.classList.remove("y-slider__bubble-active");
  }
}

export default Handle;
