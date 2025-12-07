import { publicClient } from "@/utils/client"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { keccak256, toBytes } from 'viem'

// Rôles
export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as const
export const DISTRIBUTOR_ROLE = keccak256(toBytes('DISTRIBUTOR_ROLE'))
export const CRITICAL_DISTRIBUTOR_ROLE = keccak256(toBytes('CRITICAL_DISTRIBUTOR_ROLE'))

export async function checkAdminRole(userAddress: `0x${string}`): Promise<boolean> {
    try {
        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [DEFAULT_ADMIN_ROLE, userAddress]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Une erreur est survenue lors de la vérification du rôle admin:', error)
        return false
    }
}

export async function checkDistributorRole(userAddress: `0x${string}`): Promise<boolean> {
    try {
        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [DISTRIBUTOR_ROLE, userAddress]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Une erreur est survenue lors de la vérification du rôle distributor:', error)
        return false
    }
}

export async function checkCriticalDistributorRole(userAddress: `0x${string}`): Promise<boolean> {
    try {
        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [CRITICAL_DISTRIBUTOR_ROLE, userAddress]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Une erreur est survenue lors de la vérification du rôle critical distributor:', error)
        return false
    }
}

export async function getUserRoles(userAddress: `0x${string}`): Promise<string[]> {
    const roles: string[] = []

    try {
        // Vérifier tous les rôles en parallèle pour optimiser les performances
        const [isAdmin, isDistributor, isCriticalDistributor] = await Promise.all([
            checkAdminRole(userAddress),
            checkDistributorRole(userAddress),
            checkCriticalDistributorRole(userAddress)
        ])

        if (isAdmin) roles.push('ADMIN')
        if (isDistributor) roles.push('DISTRIBUTOR')
        if (isCriticalDistributor) roles.push('CRITICAL_DISTRIBUTOR')

        return roles
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des rôles:', error)
        return []
    }
}