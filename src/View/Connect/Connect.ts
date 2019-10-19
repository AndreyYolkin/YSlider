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

  draw() {
     // alert(this.flexGrow);
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
