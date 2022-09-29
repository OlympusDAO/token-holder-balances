import { generateBalances } from "./balances";
import { getRecords } from "./records";

async function main() {
  await getRecords();

  await generateBalances();
}

if (require.main === module) {
  main();
}
