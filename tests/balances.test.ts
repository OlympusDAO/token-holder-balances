import { generateBalances } from "../src";
import { getISO8601DateString } from "../src/helpers/date";
import {
  TokenHolderTransaction,
  TransactionType,
} from "../src/graphql/generated";

const createTransaction = (
  value: number,
  date: string,
  holder: string,
  token: string
): TokenHolderTransaction => {
  return {
    balance: 0,
    block: 0,
    date: date,
    holder: {
      id: "",
      balance: 0,
      holder: Buffer.from(holder),
      token: {
        address: new Uint8Array(),
        blockchain: "Ethereum",
        id: "",
        name: token,
      },
    },
    previousBalance: 0,
    id: "",
    timestamp: "",
    transaction: new Uint8Array(),
    type: TransactionType.Transfer,
    value: value,
  };
};

const holderAddressOne = "0xf9704b03e94b8c19cfd8a8803d81c95e814d2a44";
const holderAddressTwo = "0x9a08aaf9d5e5db1f26ed5909cebf2ca2db894113";

describe("balances", () => {
  test("one holder", () => {
    const records: TokenHolderTransaction[] = [
      createTransaction(
        0.1,
        "2021-11-24T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
    ];

    const balances = generateBalances(records);

    // Balance calculated for the transaction day and subsequent days
    expect(balances.get("2021-11-23")).toBeUndefined();
    expect(
      balances.get("2021-11-24")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-25")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");

    // Calculated until the current date
    expect(
      balances
        .get(getISO8601DateString(new Date()))
        ?.get(`${holderAddressOne}/gOHM/Ethereum`)?.balance
    ).toEqual("0.1");
  });

  test("one holder, multiple transactions", () => {
    const records: TokenHolderTransaction[] = [
      createTransaction(
        0.1,
        "2021-11-24T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
      createTransaction(
        0.2,
        "2021-11-26T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
    ];

    const balances = generateBalances(records);

    // Balance calculated for the transaction day and subsequent days
    expect(
      balances.get("2021-11-24")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-25")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-26")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.3");
  });

  test("multiple holders", () => {
    const records: TokenHolderTransaction[] = [
      createTransaction(
        0.1,
        "2021-11-24T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
      createTransaction(
        0.2,
        "2021-11-25T08:18:17.000Z",
        holderAddressTwo,
        "gOHM"
      ),
    ];

    const balances = generateBalances(records);

    // Balance calculated for the transaction day and subsequent days
    expect(balances.get("2021-11-23")).toBeUndefined();
    expect(
      balances.get("2021-11-24")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-24")?.get(`${holderAddressTwo}/gOHM/Ethereum`)
        ?.balance
    ).toBeUndefined();

    expect(
      balances.get("2021-11-25")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-25")?.get(`${holderAddressTwo}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.2");
  });

  test("zero balance ignored", () => {
    const records: TokenHolderTransaction[] = [
      createTransaction(
        0.1,
        "2021-11-24T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
      createTransaction(
        -0.1,
        "2021-11-25T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
    ];

    const balances = generateBalances(records);

    expect(
      balances.get("2021-11-24")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.1");
    expect(
      balances.get("2021-11-25")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0");
    // No records on subsequent dates
    expect(
      balances.get("2021-11-26")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toBeUndefined();
  });

  test("handles small number", () => {
    const records: TokenHolderTransaction[] = [
      createTransaction(
        0.000000001,
        "2021-11-24T08:18:17.000Z",
        holderAddressOne,
        "gOHM"
      ),
    ];

    const balances = generateBalances(records);

    // Balance calculated for the transaction day and subsequent days
    expect(balances.get("2021-11-23")).toBeUndefined();
    expect(
      balances.get("2021-11-24")?.get(`${holderAddressOne}/gOHM/Ethereum`)
        ?.balance
    ).toEqual("0.000000001");
  });
});
