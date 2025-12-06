import { publicClient } from "@/utils/client"
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/constants"
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { hardhat } from 'viem/chains'

export interface DistributeResult {
    success: boolean
    txHash?: string
    error?: string
}

// Fonction helper pour créer le wallet client (problème de build sur github)
function getWalletClientDistributor() {
    const privateKey = process.env.DISTRIBUTOR_PRIVATE_KEY

    if (!privateKey) {
        throw new Error('DISTRIBUTOR_PRIVATE_KEY is not defined')
    }

    const distributorAccount = privateKeyToAccount(privateKey as `0x${string}`)

    return createWalletClient({
        account: distributorAccount,
        chain: hardhat,
        transport: http()
    })
}

export async function distributeRewards(
    userAddress: `0x${string}`,
    amount: number,
    activityId: string,
): Promise<DistributeResult> {
    try {
        const walletClientDistributor = getWalletClientDistributor()

        console.log('distributeRewards', userAddress, amount, activityId)

        const { request } = await publicClient.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'distribute',
            args: [userAddress, amount, activityId],
            account: walletClientDistributor.account
        })

        const hash = await walletClientDistributor.writeContract(request)

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

export async function checkDistributorRole(userAddress?: `0x${string}`): Promise<boolean> {
    try {
        const DISTRIBUTOR_ROLE = '0xfbd454f36a7e1a388bd6fc3ab10d434aa4578f811acbbcf33afb1c697486313c'

        let addressToCheck: `0x${string}`

        if (userAddress) {
            // Si une adresse est fournie, on vérifie cette adresse (frontend)
            addressToCheck = userAddress
        } else {
            // Sinon, on utilise le compte distributeur (backend)
            const walletClientDistributor = getWalletClientDistributor()
            addressToCheck = walletClientDistributor.account.address
        }

        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [DISTRIBUTOR_ROLE, addressToCheck]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Error checking role:', error)
        return false
    }
}