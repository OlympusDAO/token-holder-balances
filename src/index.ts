import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { existsSync, readFileSync } from "fs";
import gql from "graphql-tag";
import { TokenHolderTransaction } from "./graphql/generated";
import * as CSV from "csv-string";

const TransactionsDocument = gql`
  query Transactions($skip: Int, $startDate: String, $finishDate: String) {
    tokenHolderTransactions(
      orderBy: timestamp
      orderDirection: asc
      first: 1000
      skip: $skip
      where: { date_gte: $startDate, date_lt: $finishDate }
    ) {
      id
      balance
      block
      date
      holder {
        id
        balance
        holder
        id
        latestSnapshot
        token {
          address
          blockchain
          id
          name
        }
      }
      id
      previousBalance
      timestamp
      transaction
      type
      value
    }
  }
`;

const getRecords = (): TokenHolderTransaction[] => {
  const recordsPath = "output/results.csv";
  // If the file exists, read and return
  if (existsSync(recordsPath)) {
    const content = readFileSync(recordsPath);
    return CSV.parse(content.toString(), {
      output: "objects",
    }) as unknown as TokenHolderTransaction[];
  }

  // TODO Otherwise fetch
  const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/28103/token-holders/0.0.23",
    cache: new InMemoryCache(),
  });

  return [];
};

function main() {
  const records = getRecords();
  console.log(JSON.stringify(records[0]));
}

if (require.main === module) {
  main();
}
