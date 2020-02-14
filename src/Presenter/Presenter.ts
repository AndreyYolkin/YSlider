import Model from "../Model/Model";
import { Slider as View } from "../View/Slider/Slider";
import { _asArray, _range } from "../tools";
import Options, { defaults } from "../Options";
import Observable from "../Observable/Observable";

export class Presenter extends Observable {
  model: Model;
  views: Array<View> = [];
  constructor(model: Model, view?: HTMLElement, options?: Options) {
    super();
    this.addView = this.addView.bind(this);
    this.updateView = this.updateView.bind(this);
    this.updateModel = this.updateModel.bind(this);
    this.model = model;
    this.model.subscribe("stateUpdated", this.updateView);
    if (typeof view !== "undefined") {
      if (typeof options !== "undefined") {
        this.addView(view, options);
      } else {
        this.addView(view, defaults);
      }
    }
  }

  updateModel(values: Array<number>) {
    this.model.setState({ values: values });
  }

  updateView() {
    this.views.forEach(view => view.update(this.model.getState()));
    this.views.forEach(view => view.draw());
  }

  addView(root: HTMLElement, options: Options) {
    let view = new View(root);
    const {values, range, step} = this.model.getState();
    view.init({...options, values, range, step});
    view.draw();
    view.subscribe("valuesChanged", this.updateModel);
    view.update(this.model.getState());
    view.draw();
    this.views.push(view);
  }

  removeView(root: HTMLElement) {
    let view = this.views.filter(view => view.compareRoot(root))[0];
    view.unsubscribe("valuesChanged");
    view.destroy();
    this.views = this.views.filter(view => !view.compareRoot(root));
  }

  get() {
    return _asArray(this.model.values);
  }
  set(options: Partial<Options>) {
    this.model.setState(options);
  }
}
