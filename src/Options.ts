export interface Options {
  values: number | Array<number> //| string;
  range: Array<number> //| Array<string>;
  connects?: boolean | Array<boolean>;
  step?: number;
  orientation?: "horizontal" | "vertical";
  displaySteps?: boolean;
  displayBubbles?: boolean;
  [key: string]: any;
}

export const defaults: Options = {
  values: [0, 30, 100],
  range: [0, 100],
  connects: false,
  step: 1,
  orientation: "horizontal",
  displayBubbles: false,
  displaySteps: false
}

export default Options;