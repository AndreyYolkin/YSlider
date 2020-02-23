import { _createElement } from "../../tools";
import Observable from "../../Observable/Observable";
import "./Connect.scss";

interface ClickArea {
  none: boolean;
  top: boolean;
  left: boolean;
}

export class Connect extends Observable {
  readonly connect: HTMLElement;
  visible: boolean = true;
  flexGrow!: number;
  clickArea: ClickArea;

  constructor() {
    super();
    this.draw = this.draw.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.clickArea = {
      none: true,
      left: false,
      top: false
    };
    this.connect = _createElement("div", {
      class:
        "y-slider__connect" + (this.visible ? " y-slider__connect-visible" : "")
    });
    this.connect.addEventListener("click", this.onClicked);
  }

  onClicked(event: MouseEvent) {
    let clickArea: ClickArea;
    if (event.target !== null) {
      this.clickArea = {
        none: false,
        //@ts-ignore
        left: event.offsetX < event.target.offsetWidth / 2,
        //@ts-ignore
        top: event.offsetY < event.target.offsetHeight / 2
      };
    } else {
      this.clickArea = {
        none: true,
        left: false,
        top: false
      };
    }
    this.emit("connectClicked")
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
