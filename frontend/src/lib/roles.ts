import { publicClient } from "@/utils/client"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { createWalletClient, http, keccak256, toBytes } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import {hardhat, sepolia} from "viem/chains"

// Rôles
export const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const
export const DISTRIBUTOR_ROLE = keccak256(toBytes("DISTRIBUTOR_ROLE"))
export const CRITICAL_DISTRIBUTOR_ROLE = keccak256(
  toBytes("CRITICAL_DISTRIBUTOR_ROLE")
)

export async function checkAdminRole(
  userAddress: `0x${string}`
): Promise<boolean> {
  try {
    const hasRole = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "hasRole",
      args: [DEFAULT_ADMIN_ROLE, userAddress],
    })

    return hasRole as boolean
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la vérification du rôle admin:",
      error
    )
    return false
  }
}

export async function checkDistributorRole(
  userAddress: `0x${string}`
): Promise<boolean> {
  try {
    const hasRole = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "hasRole",
      args: [DISTRIBUTOR_ROLE, userAddress],
    })

    return hasRole as boolean
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la vérification du rôle distributor:",
      error
    )
    return false
  }
}

export async function checkCriticalDistributorRole(
  userAddress: `0x${string}`
): Promise<boolean> {
  try {
    const hasRole = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "hasRole",
      args: [CRITICAL_DISTRIBUTOR_ROLE, userAddress],
    })

    return hasRole as boolean
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la vérification du rôle critical distributor:",
      error
    )
    return false
  }
}

export async function getUserRoles(
  userAddress: `0x${string}`
): Promise<string[]> {
  const roles: string[] = []

  try {
    // Vérifier tous les rôles en parallèle pour optimiser les performances
    const [isAdmin, isDistributor, isCriticalDistributor] = await Promise.all([
      checkAdminRole(userAddress),
      checkDistributorRole(userAddress),
      checkCriticalDistributorRole(userAddress),
    ])

    if (isAdmin) roles.push("ADMIN")
    if (isDistributor) roles.push("DISTRIBUTOR")
    if (isCriticalDistributor) roles.push("CRITICAL_DISTRIBUTOR")

    return roles
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des rôles:",
      error
    )
    return []
  }
}

export interface AddRoleResult {
  success: boolean
  txHash?: string
  error?: string
}

// Fonction helper pour créer le wallet client (problème de build sur github)
function getWalletClientAdmin() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY

  if (!privateKey) {
    throw new Error(
      "ADMIN_PRIVATE_KEY n'existe pas dans les variables d'environnement"
    )
  }

  const adminAccount = privateKeyToAccount(privateKey as `0x${string}`)

  return createWalletClient({
    account: adminAccount,
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_API_KEY),
  })
}

export async function addDistributorRole(
  userAddress: `0x${string}`
): Promise<AddRoleResult> {
  try {
    const walletClientAdmin = getWalletClientAdmin()
    // Simuler la transaction d'abord pour vérifier qu'elle passera
    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "addDistributor",
      args: [userAddress],
      account: walletClientAdmin.account,
    })

    // Exécuter la transaction
    const hash = await walletClientAdmin.writeContract(request)

    // Attendre la confirmation
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
        error: "La transaction a échoué",
      }
    }
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du rôle distributor:", error)
    return {
      success: false,
      error: error.message || "Erreur inconnue",
    }
  }
}

export async function removeDistributorRole(
  userAddress: `0x${string}`
): Promise<AddRoleResult> {
  try {
    const walletClientAdmin = getWalletClientAdmin()
    // Simuler la transaction d'abord pour vérifier qu'elle passera
    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "removeDistributor",
      args: [userAddress],
      account: walletClientAdmin.account,
    })

    // Exécuter la transaction
    const hash = await walletClientAdmin.writeContract(request)

    // Attendre la confirmation
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
        error: "La transaction a échoué",
      }
    }
  } catch (error: any) {
    console.error("Erreur lors de la suppression du rôle distributor:", error)
    return {
      success: false,
      error: error.message || "Erreur inconnue",
    }
  }
}
