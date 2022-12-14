import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: number;
  BigInt: number;
  Bytes: Uint8Array;
};

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  token?: Maybe<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolderTransaction?: Maybe<TokenHolderTransaction>;
  tokenHolderTransactions: Array<TokenHolderTransaction>;
  tokenHolders: Array<TokenHolder>;
  tokens: Array<Token>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenHolderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenHolderTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenHolderTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenHolderTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderTransaction_Filter>;
};

export type QueryTokenHoldersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolder_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  token?: Maybe<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolderTransaction?: Maybe<TokenHolderTransaction>;
  tokenHolderTransactions: Array<TokenHolderTransaction>;
  tokenHolders: Array<TokenHolder>;
  tokens: Array<Token>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenHolderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenHolderTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenHolderTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenHolderTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderTransaction_Filter>;
};

export type SubscriptionTokenHoldersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolder_Filter>;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Token = {
  __typename?: "Token";
  address: Scalars["Bytes"];
  blockchain: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
};

export type TokenHolder = {
  __typename?: "TokenHolder";
  balance: Scalars["BigDecimal"];
  holder: Scalars["Bytes"];
  id: Scalars["ID"];
  token: Token;
};

export type TokenHolderTransaction = {
  __typename?: "TokenHolderTransaction";
  balance: Scalars["BigDecimal"];
  block: Scalars["BigInt"];
  date: Scalars["String"];
  holder: TokenHolder;
  id: Scalars["ID"];
  previousBalance: Scalars["BigDecimal"];
  timestamp: Scalars["String"];
  transaction: Scalars["Bytes"];
  transactionLogIndex: Scalars["BigInt"];
  type: TransactionType;
  value: Scalars["BigDecimal"];
};

export type TokenHolderTransaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  balance_lt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_lte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  block?: InputMaybe<Scalars["BigInt"]>;
  block_gt?: InputMaybe<Scalars["BigInt"]>;
  block_gte?: InputMaybe<Scalars["BigInt"]>;
  block_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  block_lt?: InputMaybe<Scalars["BigInt"]>;
  block_lte?: InputMaybe<Scalars["BigInt"]>;
  block_not?: InputMaybe<Scalars["BigInt"]>;
  block_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  date?: InputMaybe<Scalars["String"]>;
  date_contains?: InputMaybe<Scalars["String"]>;
  date_contains_nocase?: InputMaybe<Scalars["String"]>;
  date_ends_with?: InputMaybe<Scalars["String"]>;
  date_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  date_gt?: InputMaybe<Scalars["String"]>;
  date_gte?: InputMaybe<Scalars["String"]>;
  date_in?: InputMaybe<Array<Scalars["String"]>>;
  date_lt?: InputMaybe<Scalars["String"]>;
  date_lte?: InputMaybe<Scalars["String"]>;
  date_not?: InputMaybe<Scalars["String"]>;
  date_not_contains?: InputMaybe<Scalars["String"]>;
  date_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  date_not_ends_with?: InputMaybe<Scalars["String"]>;
  date_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  date_not_in?: InputMaybe<Array<Scalars["String"]>>;
  date_not_starts_with?: InputMaybe<Scalars["String"]>;
  date_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  date_starts_with?: InputMaybe<Scalars["String"]>;
  date_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  holder?: InputMaybe<Scalars["String"]>;
  holder_?: InputMaybe<TokenHolder_Filter>;
  holder_contains?: InputMaybe<Scalars["String"]>;
  holder_contains_nocase?: InputMaybe<Scalars["String"]>;
  holder_ends_with?: InputMaybe<Scalars["String"]>;
  holder_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  holder_gt?: InputMaybe<Scalars["String"]>;
  holder_gte?: InputMaybe<Scalars["String"]>;
  holder_in?: InputMaybe<Array<Scalars["String"]>>;
  holder_lt?: InputMaybe<Scalars["String"]>;
  holder_lte?: InputMaybe<Scalars["String"]>;
  holder_not?: InputMaybe<Scalars["String"]>;
  holder_not_contains?: InputMaybe<Scalars["String"]>;
  holder_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  holder_not_ends_with?: InputMaybe<Scalars["String"]>;
  holder_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  holder_not_in?: InputMaybe<Array<Scalars["String"]>>;
  holder_not_starts_with?: InputMaybe<Scalars["String"]>;
  holder_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  holder_starts_with?: InputMaybe<Scalars["String"]>;
  holder_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  previousBalance?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_gt?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_gte?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  previousBalance_lt?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_lte?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_not?: InputMaybe<Scalars["BigDecimal"]>;
  previousBalance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  timestamp?: InputMaybe<Scalars["String"]>;
  timestamp_contains?: InputMaybe<Scalars["String"]>;
  timestamp_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_ends_with?: InputMaybe<Scalars["String"]>;
  timestamp_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_gt?: InputMaybe<Scalars["String"]>;
  timestamp_gte?: InputMaybe<Scalars["String"]>;
  timestamp_in?: InputMaybe<Array<Scalars["String"]>>;
  timestamp_lt?: InputMaybe<Scalars["String"]>;
  timestamp_lte?: InputMaybe<Scalars["String"]>;
  timestamp_not?: InputMaybe<Scalars["String"]>;
  timestamp_not_contains?: InputMaybe<Scalars["String"]>;
  timestamp_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_not_ends_with?: InputMaybe<Scalars["String"]>;
  timestamp_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["String"]>>;
  timestamp_not_starts_with?: InputMaybe<Scalars["String"]>;
  timestamp_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_starts_with?: InputMaybe<Scalars["String"]>;
  timestamp_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  transaction?: InputMaybe<Scalars["Bytes"]>;
  transactionLogIndex?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_gt?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_gte?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transactionLogIndex_lt?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_lte?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_not?: InputMaybe<Scalars["BigInt"]>;
  transactionLogIndex_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transaction_contains?: InputMaybe<Scalars["Bytes"]>;
  transaction_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transaction_not?: InputMaybe<Scalars["Bytes"]>;
  transaction_not_contains?: InputMaybe<Scalars["Bytes"]>;
  transaction_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  type?: InputMaybe<TransactionType>;
  type_in?: InputMaybe<Array<TransactionType>>;
  type_not?: InputMaybe<TransactionType>;
  type_not_in?: InputMaybe<Array<TransactionType>>;
  value?: InputMaybe<Scalars["BigDecimal"]>;
  value_gt?: InputMaybe<Scalars["BigDecimal"]>;
  value_gte?: InputMaybe<Scalars["BigDecimal"]>;
  value_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  value_lt?: InputMaybe<Scalars["BigDecimal"]>;
  value_lte?: InputMaybe<Scalars["BigDecimal"]>;
  value_not?: InputMaybe<Scalars["BigDecimal"]>;
  value_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
};

export enum TokenHolderTransaction_OrderBy {
  Balance = "balance",
  Block = "block",
  Date = "date",
  Holder = "holder",
  Id = "id",
  PreviousBalance = "previousBalance",
  Timestamp = "timestamp",
  Transaction = "transaction",
  TransactionLogIndex = "transactionLogIndex",
  Type = "type",
  Value = "value",
}

export type TokenHolder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_gte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  balance_lt?: InputMaybe<Scalars["BigDecimal"]>;
  balance_lte?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not?: InputMaybe<Scalars["BigDecimal"]>;
  balance_not_in?: InputMaybe<Array<Scalars["BigDecimal"]>>;
  holder?: InputMaybe<Scalars["Bytes"]>;
  holder_contains?: InputMaybe<Scalars["Bytes"]>;
  holder_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  holder_not?: InputMaybe<Scalars["Bytes"]>;
  holder_not_contains?: InputMaybe<Scalars["Bytes"]>;
  holder_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  token?: InputMaybe<Scalars["String"]>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars["String"]>;
  token_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_ends_with?: InputMaybe<Scalars["String"]>;
  token_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_gt?: InputMaybe<Scalars["String"]>;
  token_gte?: InputMaybe<Scalars["String"]>;
  token_in?: InputMaybe<Array<Scalars["String"]>>;
  token_lt?: InputMaybe<Scalars["String"]>;
  token_lte?: InputMaybe<Scalars["String"]>;
  token_not?: InputMaybe<Scalars["String"]>;
  token_not_contains?: InputMaybe<Scalars["String"]>;
  token_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  token_not_ends_with?: InputMaybe<Scalars["String"]>;
  token_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  token_not_in?: InputMaybe<Array<Scalars["String"]>>;
  token_not_starts_with?: InputMaybe<Scalars["String"]>;
  token_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  token_starts_with?: InputMaybe<Scalars["String"]>;
  token_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum TokenHolder_OrderBy {
  Balance = "balance",
  Holder = "holder",
  Id = "id",
  Token = "token",
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  address_not?: InputMaybe<Scalars["Bytes"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  blockchain?: InputMaybe<Scalars["String"]>;
  blockchain_contains?: InputMaybe<Scalars["String"]>;
  blockchain_contains_nocase?: InputMaybe<Scalars["String"]>;
  blockchain_ends_with?: InputMaybe<Scalars["String"]>;
  blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  blockchain_gt?: InputMaybe<Scalars["String"]>;
  blockchain_gte?: InputMaybe<Scalars["String"]>;
  blockchain_in?: InputMaybe<Array<Scalars["String"]>>;
  blockchain_lt?: InputMaybe<Scalars["String"]>;
  blockchain_lte?: InputMaybe<Scalars["String"]>;
  blockchain_not?: InputMaybe<Scalars["String"]>;
  blockchain_not_contains?: InputMaybe<Scalars["String"]>;
  blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  blockchain_not_ends_with?: InputMaybe<Scalars["String"]>;
  blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  blockchain_not_in?: InputMaybe<Array<Scalars["String"]>>;
  blockchain_not_starts_with?: InputMaybe<Scalars["String"]>;
  blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  blockchain_starts_with?: InputMaybe<Scalars["String"]>;
  blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
};

export enum Token_OrderBy {
  Address = "address",
  Blockchain = "blockchain",
  Id = "id",
  Name = "name",
}

export enum TransactionType {
  Burn = "BURN",
  Mint = "MINT",
  Transfer = "TRANSFER",
}

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type EarliestTransactionQueryVariables = Exact<{ [key: string]: never }>;

export type EarliestTransactionQuery = {
  __typename?: "Query";
  tokenHolderTransactions: Array<{ __typename?: "TokenHolderTransaction"; date: string }>;
};

export type LatestTransactionQueryVariables = Exact<{ [key: string]: never }>;

export type LatestTransactionQuery = {
  __typename?: "Query";
  tokenHolderTransactions: Array<{ __typename?: "TokenHolderTransaction"; date: string }>;
};

export type TransactionsQueryVariables = Exact<{
  count?: InputMaybe<Scalars["Int"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  startDate?: InputMaybe<Scalars["String"]>;
  finishDate?: InputMaybe<Scalars["String"]>;
}>;

export type TransactionsQuery = {
  __typename?: "Query";
  tokenHolderTransactions: Array<{
    __typename?: "TokenHolderTransaction";
    id: string;
    balance: number;
    block: number;
    date: string;
    previousBalance: number;
    timestamp: string;
    transaction: Uint8Array;
    transactionLogIndex: number;
    type: TransactionType;
    value: number;
    holder: {
      __typename?: "TokenHolder";
      id: string;
      balance: number;
      holder: Uint8Array;
      token: { __typename?: "Token"; address: Uint8Array; blockchain: string; id: string; name: string };
    };
  }>;
};

export const EarliestTransactionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EarliestTransaction" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "tokenHolderTransactions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "timestamp" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "EnumValue", value: "asc" },
              },
              { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1" } },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "date" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EarliestTransactionQuery, EarliestTransactionQueryVariables>;
export const LatestTransactionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LatestTransaction" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "tokenHolderTransactions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "timestamp" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "EnumValue", value: "desc" },
              },
              { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1" } },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "Field", name: { kind: "Name", value: "date" } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LatestTransactionQuery, LatestTransactionQueryVariables>;
export const TransactionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Transactions" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "count" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "startDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "finishDate" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "tokenHolderTransactions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "timestamp" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "EnumValue", value: "asc" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "count" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: { kind: "Variable", name: { kind: "Name", value: "skip" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "date_gte" },
                      value: { kind: "Variable", name: { kind: "Name", value: "startDate" } },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "date_lt" },
                      value: { kind: "Variable", name: { kind: "Name", value: "finishDate" } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "balance" } },
                { kind: "Field", name: { kind: "Name", value: "block" } },
                { kind: "Field", name: { kind: "Name", value: "date" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "holder" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "balance" } },
                      { kind: "Field", name: { kind: "Name", value: "holder" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "token" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "address" } },
                            { kind: "Field", name: { kind: "Name", value: "blockchain" } },
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "previousBalance" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                { kind: "Field", name: { kind: "Name", value: "transaction" } },
                { kind: "Field", name: { kind: "Name", value: "transactionLogIndex" } },
                { kind: "Field", name: { kind: "Name", value: "type" } },
                { kind: "Field", name: { kind: "Name", value: "value" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransactionsQuery, TransactionsQueryVariables>;
