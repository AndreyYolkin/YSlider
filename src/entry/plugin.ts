import $ from "jquery";
import { Options, defaults } from "../Options";
import { _YSlider } from "./Service";

declare global {
  interface YSlider {
    (options: Options): JQuery;
  }

  interface JQuery {
    YSlider: YSlider;
    yslider: YSlider;
  }

  interface SupportedFunctions {
    get: Function;
    set: Function;
    draw: Function;
    on: Function;
    off: Function;
    addView: Function;
    removeView: Function;
    [key: string]: any;
  }
}

$.fn.yslider = $.fn.YSlider = function(
  this: JQuery,
  options: Partial<Options> | string,
  ...content: any
) {
  let yslider: _YSlider;
  if (!!this.data("yslider")) {
    yslider = this.data("yslider");
  }
  const functions: SupportedFunctions = {
    get: () => {
      return yslider.get();
    },
    set: (options: Partial<Options>) => {
      yslider.set(options);
      return this;
    },
    draw: () => {
      yslider.draw();
      return this;
    },
    on: (event: string, action: Function) => {
      yslider.on(event, action);
      return this;
    },
    off: (event: string, action?: Function) => {
      yslider.off(event, action);
      return this;
    },
    addView: (
      target: HTMLElement | JQuery<HTMLElement>,
      options: Partial<Options>
    ) => {
      $(target).each((_, a) => {
        yslider.addView(a, { ...defaults, ...options });
        $(a).data("yslider", yslider);
      });
    },
    removeView: (target: HTMLElement | JQuery<HTMLElement>) => {
      $(target).each((_, a) => yslider.removeView(a));
    }
  };
  if (!!this.data("yslider")) {
    if (typeof options === "undefined") {
      return functions;
    }
    if (typeof options === "string") {
      if (functions.hasOwnProperty(options)) {
        return functions[options].apply(this.data("yslider"), content);
      }
    }
  }
  if (typeof options === "object" && options !== null) {
    options = { ...defaults, ...options };
    let values: Options = $.extend({}, defaults, options);
    yslider = new _YSlider(values);
    this.data("yslider", yslider);
    this.map(el => yslider.addView(this[el], values));
    return functions;
  }
};
