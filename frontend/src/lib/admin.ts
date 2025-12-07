import {publicClient} from "@/utils/client";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/utils/constants";
import {privateKeyToAccount} from "viem/accounts";
import {createWalletClient, http} from "viem";
import {hardhat} from "viem/chains";

// Fonction helper pour créer le wallet client (problème de build sur github)
function getWalletClientAdmin() {
    const privateKey = process.env.ADMIN_PRIVATE_KEY

    if (!privateKey) {
        throw new Error('ADMIN_PRIVATE_KEY n\'existe pas')
    }

    const adminAccount = privateKeyToAccount(privateKey as `0x${string}`)

    return createWalletClient({
        account: adminAccount,
        chain: hardhat,
        transport: http()
    })
}

export async function checkAdminRole(userAddress?: `0x${string}`): Promise<boolean> {
    try {
        const ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as const

        let addressToCheck: `0x${string}`

        if (userAddress) {
            // Si une adresse est fournie, on vérifie cette adresse (frontend)
            addressToCheck = userAddress
        } else {
            // Sinon, on utilise le compte distributeur (backend)
            const walletClientDistributor = getWalletClientAdmin()
            addressToCheck = walletClientDistributor.account.address
        }

        const hasRole = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'hasRole',
            args: [ADMIN_ROLE, addressToCheck]
        })

        return hasRole as boolean
    } catch (error) {
        console.error('Une erreur est survenue :', error)
        return false
    }
}