
import { generateBalances } from "./balances";

// TODO PubSub topic with date

async function run() {
  await generateBalances(new Date("2021-11-24"));
}
