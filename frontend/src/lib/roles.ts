import { publicClient } from "@/utils/client"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { createWalletClient, http, keccak256, toBytes } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { hardhat } from "viem/chains"

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
  console.log(
    "🔍 Debug - Toutes les variables env:",
    Object.keys(process.env).filter((k) => k.includes("ADMIN"))
  )
  console.log(
    "🔍 Debug - ADMIN_PRIVATE_KEY présente:",
    !!process.env.ADMIN_PRIVATE_KEY
  )

  const privateKey = process.env.ADMIN_PRIVATE_KEY

  if (!privateKey) {
    console.error("❌ ADMIN_PRIVATE_KEY est undefined")
    throw new Error(
      "ADMIN_PRIVATE_KEY n'existe pas dans les variables d'environnement"
    )
  }

  console.log("✅ ADMIN_PRIVATE_KEY trouvée")

  const adminAccount = privateKeyToAccount(privateKey as `0x${string}`)

  return createWalletClient({
    account: adminAccount,
    chain: hardhat,
    transport: http(),
  })
}

/**
 * Ajoute le rôle DISTRIBUTOR à une adresse
 * IMPORTANT: Cette fonction doit être appelée UNIQUEMENT côté serveur (API route)
 * car elle utilise la clé privée de l'admin
 * @param userAddress - Adresse à qui ajouter le rôle
 * @returns Résultat de l'opération avec le hash de la transaction si succès
 */
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
