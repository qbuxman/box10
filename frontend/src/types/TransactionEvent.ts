import { Hex } from "viem"

export type TransactionEvent = {
  type: string
  amount: bigint
  account: Hex
  blockNumber: bigint
  transactionHash: Hex
}
