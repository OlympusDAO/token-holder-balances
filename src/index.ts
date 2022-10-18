import { generateBalances } from "./balances";
import { validateEnvironment } from "./helpers/env";
import { getRecords } from "./records";

async function main() {
  validateEnvironment();

  await getRecords();

  await generateBalances();
}

if (require.main === module) {
  main();
}
