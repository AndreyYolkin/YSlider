/**
 * Options for the example plugin.
 */
interface ExamplePluginOptions {
  values: number | Array<number> | string;
  range: Array<number> | Array<string>;
  connects?: boolean | Array<boolean>;
  step?: number;
  orientation?: "horizontal" | "vertical";
  displaySteps?: boolean;
  displayBubbles?: boolean;
}

/**
 * Global options of the example plugin available as properties on $.fn object.
 */
interface ExamplePluginGlobalOptions {
  /**
   * Global options of the example plugin.
   */
  options: ExamplePluginOptions;
}

/**
 * Function to apply the example plugin to the selected elements of a jQuery result.
 */
interface ExamplePluginFunction {
  /**
   * Apply the example plugin to the elements selected in the jQuery result.
   *
   * @param options Options to use for this application of the example plugin.
   * @returns jQuery result.
   */
  (options: ExamplePluginOptions): JQuery;
}

/**
 * Declaration of the example plugin.
 */
interface ExamplePlugin extends ExamplePluginGlobalOptions, ExamplePluginFunction { }

/**
 * Extend the jQuery result declaration with the example plugin.
 */
interface JQuery {
  /**
   * Extension of the example plugin.
   */
  examplePlugin: ExamplePlugin;
}
