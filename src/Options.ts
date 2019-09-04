export interface Options {
  values: number | Array<number> | string;
  range: Array<number> | Array<string>;
  step?: number;
  orientation?: orientation;
  displaySteps?: boolean;
  displayBubbles?: boolean;
}

export const enum orientation {
  vertical,
  horizontal
}

export default Options;