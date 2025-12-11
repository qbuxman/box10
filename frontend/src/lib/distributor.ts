import { publicClient } from "@/utils/client"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import {createWalletClient, http, isHex} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { sepolia } from "viem/chains"

export interface DistributeResult {
  success: boolean
  txHash?: string
  error?: string
}

// Fonction helper pour créer le wallet client (problème de build sur github)
function getWalletClientDistributor() {
  const privateKey = process.env.DISTRIBUTOR_PRIVATE_KEY

  if (!privateKey) {
    throw new Error("DISTRIBUTOR_PRIVATE_KEY n'existe pas")
  }

  const distributorAccount = privateKeyToAccount(privateKey as `0x${string}`)

  return createWalletClient({
    account: distributorAccount,
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_API_KEY),
  })
}

function getWalletClientCriticalDistributor() {
  const privateKey = process.env.CRITICAL_DISTRIBUTOR_PRIVATE_KEY

  if (!privateKey) {
    throw new Error("CRITICAL_DISTRIBUTOR_PRIVATE_KEY n'existe pas")
  }

  const criticalDistributorAccount = privateKeyToAccount(
    privateKey as `0x${string}`
  )

  return createWalletClient({
    account: criticalDistributorAccount,
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_API_KEY),
  })
}

export async function distributeRewards(
  userAddress: `0x${string}`,
  amount: number,
  activityId: string
): Promise<DistributeResult> {
  try {
    const LARGE_DISTRIBUTION_THRESHOLD = 1000
    const useCriticalDistributor = amount > LARGE_DISTRIBUTION_THRESHOLD

    const walletClient = useCriticalDistributor
      ? getWalletClientCriticalDistributor()
      : getWalletClientDistributor()

    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "distribute",
      args: [userAddress, amount, activityId],
      account: walletClient.account,
    })

    const hash = await walletClient.writeContract(request)

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    })

    if (receipt.status === "success") {
      return {
        success: true,
        txHash: hash,
      }
    } else {
      return {
        success: false,
        error: "Echec de la transaction",
      }
    }
  } catch (error: any) {
    console.error("Une erreur est survenue :", error)
    return {
      success: false,
      error: error.message || "Erreur inconnue",
    }
  }
}
