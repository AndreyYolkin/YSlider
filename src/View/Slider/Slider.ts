import Observable from "../../Observable/Observable";
import Options from "../../Options";
import createElement from "../createElement";
import Handle from "./Handle";
import { Connect } from "./Connect";
import Model from "../../Model/Model";

export class Slider extends Observable {
    root: HTMLElement;
    handle!: Handle;
    connect!: Connect;
    options: Options;

    constructor(model: Model, root: HTMLElement) {
        super();
        this.root = root;
        this.options = model.getState();
        this.redraw = this.redraw.bind(this);
        this.redraw();
    }

    redraw() {
        this.drawSlider();
        this.drawConnects();
        this.drawHandlers();
    }
    
    drawSlider() {
        this.root.innerHTML = "";
        const slider = createElement("div", {class: `y-slider y-slider_${this.options.orientation}`})
        this.root.appendChild(slider);
    }
    
    drawHandlers() {
        this.handle = new Handle();
    }

    drawConnects() {
        const slider = createElement("div", {class: `y-slider y-slider_${this.options.orientation}`})
        this.root.appendChild(slider);
    }
}

export default Slider