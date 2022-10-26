export const DATE_EARLIEST = new Date("2021-11-24T00:00:00.000Z");
export const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/28103/token-holders/0.0.40";

export interface IShouldTerminate {
    (): boolean;
  }
  