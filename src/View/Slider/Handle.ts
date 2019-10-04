import Options from "../../Options";
import createElement from "../createElement";

export class Handle {
    handle: HTMLElement;
    bubble: HTMLElement;
    constructor() {
        this.handle = createElement("div", {class: "y-slider__handle"});
        this.bubble = createElement("div");
    }
    
    draw() {
        
    }

    onDrag(e: MouseEvent) {
        
    }
}

export default Handle