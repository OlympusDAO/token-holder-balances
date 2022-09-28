import { ApolloClient, InMemoryCache } from "@apollo/client";
import gql from "graphql-tag";

const TransactionsDocument = gql`
  query Transactions($skip: Int, $startDate: String, $finishDate: String) {
    tokenHolderTransactions(
      orderBy: timestamp, 
      orderDirection: asc, 
      first: 1000, 
      skip: $skip, 
      where: {
        date_gte: $startDate,
        date_lt: $finishDate,
      }
    ) {
      id
      balance
      block
      date
      type
      holder {
        id
        holder
        token {
          address
          blockchain
          name
        }
      }
      previousBalance
      timestamp
      transaction
      value
    }
  }
`;

function main() {
  const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/28103/token-holders/0.0.23",
    cache: new InMemoryCache(),
  });

  
}

if (require.main === module) {
  main();
}
