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
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  token?: Maybe<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolderSnapshot?: Maybe<TokenHolderSnapshot>;
  tokenHolderSnapshots: Array<TokenHolderSnapshot>;
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
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHolderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHolderSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHolderSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolderSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderSnapshot_Filter>;
};


export type QueryTokenHolderTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHolderTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolderTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderTransaction_Filter>;
};


export type QueryTokenHoldersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolder_Filter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  token?: Maybe<Token>;
  tokenHolder?: Maybe<TokenHolder>;
  tokenHolderSnapshot?: Maybe<TokenHolderSnapshot>;
  tokenHolderSnapshots: Array<TokenHolderSnapshot>;
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
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHolderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHolderSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHolderSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolderSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderSnapshot_Filter>;
};


export type SubscriptionTokenHolderTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHolderTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolderTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolderTransaction_Filter>;
};


export type SubscriptionTokenHoldersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenHolder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHolder_Filter>;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Token = {
  __typename?: 'Token';
  address: Scalars['Bytes'];
  blockchain: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type TokenHolder = {
  __typename?: 'TokenHolder';
  balance: Scalars['BigDecimal'];
  holder: Scalars['Bytes'];
  id: Scalars['ID'];
  latestSnapshot?: Maybe<Scalars['ID']>;
  token: Token;
};

export type TokenHolderSnapshot = {
  __typename?: 'TokenHolderSnapshot';
  balance: Scalars['BigDecimal'];
  date: Scalars['String'];
  holder: TokenHolder;
  id: Scalars['ID'];
};

export type TokenHolderSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigDecimal']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  date?: InputMaybe<Scalars['String']>;
  date_contains?: InputMaybe<Scalars['String']>;
  date_contains_nocase?: InputMaybe<Scalars['String']>;
  date_ends_with?: InputMaybe<Scalars['String']>;
  date_ends_with_nocase?: InputMaybe<Scalars['String']>;
  date_gt?: InputMaybe<Scalars['String']>;
  date_gte?: InputMaybe<Scalars['String']>;
  date_in?: InputMaybe<Array<Scalars['String']>>;
  date_lt?: InputMaybe<Scalars['String']>;
  date_lte?: InputMaybe<Scalars['String']>;
  date_not?: InputMaybe<Scalars['String']>;
  date_not_contains?: InputMaybe<Scalars['String']>;
  date_not_contains_nocase?: InputMaybe<Scalars['String']>;
  date_not_ends_with?: InputMaybe<Scalars['String']>;
  date_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  date_not_in?: InputMaybe<Array<Scalars['String']>>;
  date_not_starts_with?: InputMaybe<Scalars['String']>;
  date_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date_starts_with?: InputMaybe<Scalars['String']>;
  date_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder?: InputMaybe<Scalars['String']>;
  holder_?: InputMaybe<TokenHolder_Filter>;
  holder_contains?: InputMaybe<Scalars['String']>;
  holder_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_ends_with?: InputMaybe<Scalars['String']>;
  holder_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_gt?: InputMaybe<Scalars['String']>;
  holder_gte?: InputMaybe<Scalars['String']>;
  holder_in?: InputMaybe<Array<Scalars['String']>>;
  holder_lt?: InputMaybe<Scalars['String']>;
  holder_lte?: InputMaybe<Scalars['String']>;
  holder_not?: InputMaybe<Scalars['String']>;
  holder_not_contains?: InputMaybe<Scalars['String']>;
  holder_not_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_not_ends_with?: InputMaybe<Scalars['String']>;
  holder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_not_in?: InputMaybe<Array<Scalars['String']>>;
  holder_not_starts_with?: InputMaybe<Scalars['String']>;
  holder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder_starts_with?: InputMaybe<Scalars['String']>;
  holder_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum TokenHolderSnapshot_OrderBy {
  Balance = 'balance',
  Date = 'date',
  Holder = 'holder',
  Id = 'id'
}

export type TokenHolderTransaction = {
  __typename?: 'TokenHolderTransaction';
  balance: Scalars['BigDecimal'];
  block: Scalars['BigInt'];
  date: Scalars['String'];
  holder: TokenHolder;
  id: Scalars['ID'];
  previousBalance: Scalars['BigDecimal'];
  timestamp: Scalars['String'];
  transaction: Scalars['Bytes'];
  type: TransactionType;
  value: Scalars['BigDecimal'];
};

export type TokenHolderTransaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigDecimal']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  date?: InputMaybe<Scalars['String']>;
  date_contains?: InputMaybe<Scalars['String']>;
  date_contains_nocase?: InputMaybe<Scalars['String']>;
  date_ends_with?: InputMaybe<Scalars['String']>;
  date_ends_with_nocase?: InputMaybe<Scalars['String']>;
  date_gt?: InputMaybe<Scalars['String']>;
  date_gte?: InputMaybe<Scalars['String']>;
  date_in?: InputMaybe<Array<Scalars['String']>>;
  date_lt?: InputMaybe<Scalars['String']>;
  date_lte?: InputMaybe<Scalars['String']>;
  date_not?: InputMaybe<Scalars['String']>;
  date_not_contains?: InputMaybe<Scalars['String']>;
  date_not_contains_nocase?: InputMaybe<Scalars['String']>;
  date_not_ends_with?: InputMaybe<Scalars['String']>;
  date_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  date_not_in?: InputMaybe<Array<Scalars['String']>>;
  date_not_starts_with?: InputMaybe<Scalars['String']>;
  date_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date_starts_with?: InputMaybe<Scalars['String']>;
  date_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder?: InputMaybe<Scalars['String']>;
  holder_?: InputMaybe<TokenHolder_Filter>;
  holder_contains?: InputMaybe<Scalars['String']>;
  holder_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_ends_with?: InputMaybe<Scalars['String']>;
  holder_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_gt?: InputMaybe<Scalars['String']>;
  holder_gte?: InputMaybe<Scalars['String']>;
  holder_in?: InputMaybe<Array<Scalars['String']>>;
  holder_lt?: InputMaybe<Scalars['String']>;
  holder_lte?: InputMaybe<Scalars['String']>;
  holder_not?: InputMaybe<Scalars['String']>;
  holder_not_contains?: InputMaybe<Scalars['String']>;
  holder_not_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_not_ends_with?: InputMaybe<Scalars['String']>;
  holder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_not_in?: InputMaybe<Array<Scalars['String']>>;
  holder_not_starts_with?: InputMaybe<Scalars['String']>;
  holder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder_starts_with?: InputMaybe<Scalars['String']>;
  holder_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  previousBalance?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  previousBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  previousBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['String']>;
  timestamp_contains?: InputMaybe<Scalars['String']>;
  timestamp_contains_nocase?: InputMaybe<Scalars['String']>;
  timestamp_ends_with?: InputMaybe<Scalars['String']>;
  timestamp_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_gt?: InputMaybe<Scalars['String']>;
  timestamp_gte?: InputMaybe<Scalars['String']>;
  timestamp_in?: InputMaybe<Array<Scalars['String']>>;
  timestamp_lt?: InputMaybe<Scalars['String']>;
  timestamp_lte?: InputMaybe<Scalars['String']>;
  timestamp_not?: InputMaybe<Scalars['String']>;
  timestamp_not_contains?: InputMaybe<Scalars['String']>;
  timestamp_not_contains_nocase?: InputMaybe<Scalars['String']>;
  timestamp_not_ends_with?: InputMaybe<Scalars['String']>;
  timestamp_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['String']>>;
  timestamp_not_starts_with?: InputMaybe<Scalars['String']>;
  timestamp_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_starts_with?: InputMaybe<Scalars['String']>;
  timestamp_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['Bytes']>;
  transaction_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_not?: InputMaybe<Scalars['Bytes']>;
  transaction_not_contains?: InputMaybe<Scalars['Bytes']>;
  transaction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  type?: InputMaybe<TransactionType>;
  type_in?: InputMaybe<Array<TransactionType>>;
  type_not?: InputMaybe<TransactionType>;
  type_not_in?: InputMaybe<Array<TransactionType>>;
  value?: InputMaybe<Scalars['BigDecimal']>;
  value_gt?: InputMaybe<Scalars['BigDecimal']>;
  value_gte?: InputMaybe<Scalars['BigDecimal']>;
  value_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  value_lt?: InputMaybe<Scalars['BigDecimal']>;
  value_lte?: InputMaybe<Scalars['BigDecimal']>;
  value_not?: InputMaybe<Scalars['BigDecimal']>;
  value_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum TokenHolderTransaction_OrderBy {
  Balance = 'balance',
  Block = 'block',
  Date = 'date',
  Holder = 'holder',
  Id = 'id',
  PreviousBalance = 'previousBalance',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Type = 'type',
  Value = 'value'
}

export type TokenHolder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigDecimal']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  holder?: InputMaybe<Scalars['Bytes']>;
  holder_contains?: InputMaybe<Scalars['Bytes']>;
  holder_in?: InputMaybe<Array<Scalars['Bytes']>>;
  holder_not?: InputMaybe<Scalars['Bytes']>;
  holder_not_contains?: InputMaybe<Scalars['Bytes']>;
  holder_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  latestSnapshot?: InputMaybe<Scalars['ID']>;
  latestSnapshot_gt?: InputMaybe<Scalars['ID']>;
  latestSnapshot_gte?: InputMaybe<Scalars['ID']>;
  latestSnapshot_in?: InputMaybe<Array<Scalars['ID']>>;
  latestSnapshot_lt?: InputMaybe<Scalars['ID']>;
  latestSnapshot_lte?: InputMaybe<Scalars['ID']>;
  latestSnapshot_not?: InputMaybe<Scalars['ID']>;
  latestSnapshot_not_in?: InputMaybe<Array<Scalars['ID']>>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum TokenHolder_OrderBy {
  Balance = 'balance',
  Holder = 'holder',
  Id = 'id',
  LatestSnapshot = 'latestSnapshot',
  Token = 'token'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockchain?: InputMaybe<Scalars['String']>;
  blockchain_contains?: InputMaybe<Scalars['String']>;
  blockchain_contains_nocase?: InputMaybe<Scalars['String']>;
  blockchain_ends_with?: InputMaybe<Scalars['String']>;
  blockchain_ends_with_nocase?: InputMaybe<Scalars['String']>;
  blockchain_gt?: InputMaybe<Scalars['String']>;
  blockchain_gte?: InputMaybe<Scalars['String']>;
  blockchain_in?: InputMaybe<Array<Scalars['String']>>;
  blockchain_lt?: InputMaybe<Scalars['String']>;
  blockchain_lte?: InputMaybe<Scalars['String']>;
  blockchain_not?: InputMaybe<Scalars['String']>;
  blockchain_not_contains?: InputMaybe<Scalars['String']>;
  blockchain_not_contains_nocase?: InputMaybe<Scalars['String']>;
  blockchain_not_ends_with?: InputMaybe<Scalars['String']>;
  blockchain_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  blockchain_not_in?: InputMaybe<Array<Scalars['String']>>;
  blockchain_not_starts_with?: InputMaybe<Scalars['String']>;
  blockchain_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  blockchain_starts_with?: InputMaybe<Scalars['String']>;
  blockchain_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Address = 'address',
  Blockchain = 'blockchain',
  Id = 'id',
  Name = 'name'
}

export enum TransactionType {
  Burn = 'BURN',
  Mint = 'MINT',
  Transfer = 'TRANSFER'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', tokenHolderTransactions: Array<{ __typename?: 'TokenHolderTransaction', id: string, balance: number, block: number, date: string, type: TransactionType, previousBalance: number, timestamp: string, transaction: Uint8Array, value: number, holder: { __typename?: 'TokenHolder', id: string, holder: Uint8Array, token: { __typename?: 'Token', address: Uint8Array, blockchain: string, name: string } } }> };
