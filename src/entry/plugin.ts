import $ from "jquery";
import { Options, defaults } from "../Options";
import { YSlider } from "./Service";

// Define the plugin function on the jQuery extension point.
// Note: Function and global default options must be combined as long as the options are mandatory.
$.fn.YSlider = Object.assign<YSliderFunction, YSliderGlobalOptions>(
  function(this: JQuery, options: Options): JQuery {
    // Merge the global options with the options given as argument.
    options = $.extend({}, $.fn.YSlider.options, options);

    // Do what the plugin should do. Here we create an instance of the separate service which is then used when the
    // user clicks the element that the plugin is attached to. It produces a greeting message and appends it to the output.
    let yslider = new YSlider(options, this);

    return this;
  },
  {
    options: {
      ...defaults
    }
  }
);
