// lib/distributor.ts
import {walletClientDistributor} from './viem-server'
import {publicClient} from "@/utils/client";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/utils/constants";

export interface DistributeResult {
    success: boolean
    txHash?: string
    error?: string
}

export async function distributeRewards(
    userAddress: `0x${string}`,
    amount: number,
    activityId: string,
): Promise<DistributeResult> {
    try {
        console.log('distributeRewards', userAddress, amount, activityId)
        // 1. Simuler la transaction pour vérifier qu'elle va passer
        const { request } = await publicClient.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'distribute',
            args: [userAddress, amount, activityId],
            account: walletClientDistributor.account
        })

        // 2. Envoyer la transaction
        const hash = await walletClientDistributor.writeContract(request)

        // 3. Attendre la confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: 1
        })

        if (receipt.status === 'success') {
            return {
                success: true,
                txHash: hash
            }
        } else {
            return {
                success: false,
                error: 'Transaction failed'
            }
        }
    } catch (error: any) {
        console.error('Distribution error:', error)
        return {
            success: false,
            error: error.message || 'Unknown error'
        }
    }
}

// Helper pour vérifier si le distributeur a le bon rôle
export async function checkDistributorRole(): Promise<boolean> {
    try {
        const DISTRIBUTOR_ROLE = '0xfbd454f36a7e1a388bd6fc3ab10d434aa4578f811acbbcf33afb1c697486313c' // Ton role hash

        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [DISTRIBUTOR_ROLE, walletClientDistributor.account.address]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Error checking role:', error)
        return false
    }
}