export interface ModelOptions {
  values: number | Array<number>;
  range: Array<number>;
  step: number;
  margin: number;
  [key: string]: any;
}

export interface Options extends ModelOptions{
  connects: boolean | Array<boolean>;
  orientation: "horizontal" | "vertical";
  displaySteps: boolean;
  displayBubbles: boolean;
  [key: string]: any;
}

export const defaults: Options = {
  values: 0,
  range: [0, 100],
  connects: true,
  margin: 0,
  step: 1,
  orientation: "horizontal",
  displayBubbles: false,
  displaySteps: false
}

export default Options;