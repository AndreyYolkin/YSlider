import { _createElement } from "../../tools";
import Observable from "../../Observable/Observable";
import "./Connect.scss";

export class Connect extends Observable {
  readonly connect: HTMLElement;
  visible: boolean = true;
  flexGrow!: number;

  constructor() {
    super();
    this.draw = this.draw.bind(this);
    this.connect = _createElement("div", {
      class:
        "y-slider__connect" + (this.visible ? " y-slider__connect-visible" : "")
    });
  }

  static getArrayOfVisibiliteies(
    truthy: boolean | Array<boolean>,
    count: number
  ): Array<boolean> {
    let result: Array<boolean>;
    if (Array.isArray(truthy)) {
      result = truthy;
    } else {
      result = [false, ...Array(count - 2).fill(truthy), false];
    }
    return result;
  }

  draw() {
    this.connect.style.flexGrow = `${this.flexGrow}`;
  }

  setVisible() {
    this.visible = true;
    this.connect.classList.add("y-slider__connect-visible");
  }

  setInvisible() {
    this.visible = false;
    this.connect.classList.remove("y-slider__connect-visible");
  }
}
