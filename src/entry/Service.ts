import Model from "../Model/Model";
import Slider from "../View/Slider/Slider";
import { Presenter } from "../Presenter/Presenter";
import Options from "../Options";

export class YSlider {
    model: Model;
    view: Slider;
    presenter: Presenter;
    constructor(options: Options, root: JQuery<HTMLElement>) {
        this.model = new Model(options);
        this.view = new Slider(root);
        this.presenter = new Presenter(this.model, this.view);
    }
}