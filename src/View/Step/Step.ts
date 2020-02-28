import { _createElement } from "../../tools";
import "./Step.scss"

export class Step {
  step: HTMLElement;

  constructor(isedge?: boolean) {
    this.step = _createElement("div", {class: "y-slider__step"})
    if (isedge) {
      this.step.classList.add("y-slider__step-edge")
    }
  }

  setVisible() {
    this.step.classList.add("y-slider__step-visible")
  }
  setInvisible() {
    this.step.classList.remove("y-slider__step-visible")
  }
}