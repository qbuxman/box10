"use client"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { publicClient } from "@/utils/client"
import {
  POOL_ADDRESS_MAINNET,
  USDC_ADDRESS_MAINNET,
} from "@/utils/aave-constants"
import { parseAbiItem } from "viem"
import { TransactionEvent } from "@/types/TransactionEvent"
import UserInfo from "@/components/shared/UserInfo"

const AccountPage = () => {
  const { address, isConnected } = useAccount()

  const [isLoading, setIsLoading] = useState(true)
  const [transactionEvents, setTransactionEvents] = useState<
    TransactionEvent[]
  >([])

  const getUserInfo = async () => {
    if (address && isConnected) {
      setIsLoading(true)
      const depositEvents = await publicClient.getLogs({
        address: POOL_ADDRESS_MAINNET,
        event: parseAbiItem(
          "event Supply(address indexed reserve, address user, address indexed onBehalfOf, uint256 amount, uint16 indexed referralCode)"
        ),
        args: {
          reserve: USDC_ADDRESS_MAINNET,
          onBehalfOf: address,
        },
        fromBlock: BigInt(18000000),
        toBlock: "latest",
      })

      const withdrawEvents = await publicClient.getLogs({
        address: POOL_ADDRESS_MAINNET,
        event: parseAbiItem(
          "event Withdraw(address indexed reserve, address indexed user, address indexed to, uint256 amount)"
        ),
        args: {
          reserve: USDC_ADDRESS_MAINNET,
          user: address,
        },
        fromBlock: BigInt(18000000),
        toBlock: "latest",
      })

      const combinedEvents: TransactionEvent[] = [
        ...depositEvents.map((event) => ({
          type: "Deposit",
          account: event.args.user!,
          amount: event.args.amount || BigInt(0),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        })),
        ...withdrawEvents.map((event) => ({
          type: "Withdraw",
          account: event.args.user!,
          amount: event.args.amount || BigInt(0),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        })),
      ]
      const sortedEvents = combinedEvents.sort((a, b) =>
        Number(b.blockNumber - a.blockNumber)
      )
      setTransactionEvents(sortedEvents)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [address, isConnected])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Chargement de vos transactions...</p>
        </div>
      </div>
    )
  }

  return <UserInfo transactionEvents={transactionEvents} balances={null} />
}

export default AccountPage
