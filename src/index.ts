import { createClient } from "@urql/core";
import fetch from "cross-fetch";

import { generateBalances, getLatestBalancesDate } from "./balances";
import { SUBGRAPH_URL } from "./constants";
import { getEnvFinalDate, validateEnvironment } from "./helpers/env";
import { getFinalDate, getLatestFetchedRecordsDate, getRecords } from "./records";
import { getEarliestTransactionDateStart } from "./subgraph";

async function main() {
  validateEnvironment();

  const client = createClient({
    url: SUBGRAPH_URL,
    fetch,
  });

  const earliestDate: Date = await getEarliestTransactionDateStart(client);
  const finalDate: Date = getEnvFinalDate() || (await getFinalDate(client));
  const transactionsDate: Date = await getLatestFetchedRecordsDate(earliestDate, finalDate);
  console.log(`Earliest date is ${earliestDate.toISOString()}`);
  console.log(`Final date is ${finalDate.toISOString()}`);
  console.log(`Transactions date is ${transactionsDate.toISOString()}`);

  await getRecords(client, transactionsDate, finalDate);

  // Generate balances from the start date of records fetching, not the earliest
  // Otherwise we would need to re-generate ALL balances, every time
  const balancesDate: Date = await getLatestBalancesDate(earliestDate, transactionsDate);
  console.log(`Starting balance calculations from ${balancesDate.toISOString()}`);
  await generateBalances(balancesDate);
}

if (require.main === module) {
  main();
}
