import gql from "graphql-tag";

const TransactionsDocument = gql`
  query {
    tokenHolderTransactions(orderBy: timestamp, orderDirection: asc) {
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
  //
}

if (require.main === module) {
  main();
}
