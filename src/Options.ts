export interface Options {
  values: number | Array<number> | string;
  range: Array<number> | Array<string>;
  connects?: boolean | Array<boolean>;
  step?: number;
  orientation?: "horizontal" | "vertical";
  displaySteps?: boolean;
  displayBubbles?: boolean;
}

export default Options;