import Model from "../Model/Model";
import { Slider as View } from "../View/Slider/Slider";
import { Presenter } from "../Presenter/Presenter";
import Options from "../Options";

export class _YSlider {
  model: Model;
  presenter: Presenter;
  constructor(options: Options, root?: HTMLElement) {
    this.model = new Model(options);
    this.presenter = new Presenter(this.model);
    if (typeof root !== "undefined") {
      this.presenter.addView(root, options);
    }
    return this;
  }
  addView(root: HTMLElement, options: Options) {
    this.presenter.addView(root, options);
  }
  removeView(root: HTMLElement) {
    this.presenter.removeView(root)
  }
  draw() {
    this.presenter.updateView()
  }
  get() {
      return this.presenter.get()
  }
  set(options: Partial<Options>) {
      this.presenter.set(options);
  }
  on(event: string, callback: Function) {
      this.presenter.subscribe(event, callback);
  }
  off(event: string, callback?: Function){
    this.presenter.unsubscribe(event, callback)
  }
}
