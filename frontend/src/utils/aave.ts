import { publicClient, walletClient } from "./client";
import { parseUnits, formatUnits } from "viem";
import PoolArtifact from "@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json";

// Adresses des contrats sur Sepolia
const USDT_ADDRESS = '';
const USDC_ADDRESS = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" as const;
const POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as const;
const POOL_DATA_PROVIDER_ADDRESS = "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31" as const;

// ABI du Pool Aave v3
const POOL_ABI = PoolArtifact.abi;

// ABI minimal pour ERC20 approve
const ERC20_ABI = [
    {
        constant: false,
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
] as const;

// ABI pour PoolDataProvider
const POOL_DATA_PROVIDER_ABI = [
    {
        inputs: [{ name: "asset", type: "address" }],
        name: "getReserveConfigurationData",
        outputs: [
            { name: "decimals", type: "uint256" },
            { name: "ltv", type: "uint256" },
            { name: "liquidationThreshold", type: "uint256" },
            { name: "liquidationBonus", type: "uint256" },
            { name: "reserveFactor", type: "uint256" },
            { name: "usageAsCollateralEnabled", type: "bool" },
            { name: "borrowingEnabled", type: "bool" },
            { name: "stableBorrowRateEnabled", type: "bool" },
            { name: "isActive", type: "bool" },
            { name: "isFrozen", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "asset", type: "address" }],
        name: "getReserveCaps",
        outputs: [
            { name: "borrowCap", type: "uint256" },
            { name: "supplyCap", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "asset", type: "address" }],
        name: "getReserveData",
        outputs: [
            { name: "unbacked", type: "uint256" },
            { name: "accruedToTreasuryScaled", type: "uint256" },
            { name: "totalAToken", type: "uint256" },
            { name: "totalStableDebt", type: "uint256" },
            { name: "totalVariableDebt", type: "uint256" },
            { name: "liquidityRate", type: "uint256" },
            { name: "variableBorrowRate", type: "uint256" },
            { name: "stableBorrowRate", type: "uint256" },
            { name: "averageStableBorrowRate", type: "uint256" },
            { name: "liquidityIndex", type: "uint256" },
            { name: "variableBorrowIndex", type: "uint256" },
            { name: "lastUpdateTimestamp", type: "uint40" },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

export const depositUSDC = async (amount: string) => {
    try {
        const [address] = await walletClient.requestAddresses();
        if (!address) throw new Error("Veuillez vous connecter à MetaMask.");

        // Vérifier le solde ETH pour les frais de gas
        const balance = await publicClient.getBalance({ address });
        if (balance === BigInt(0)) {
            throw new Error("Vous n'avez pas d'ETH pour payer les frais de gas.");
        }

        const amountInWei = parseUnits(amount, 6);

        // 1. Vérifier le supply cap
        console.log("Vérification du supply cap...");
        const [borrowCap, supplyCap] = await publicClient.readContract({
            address: POOL_DATA_PROVIDER_ADDRESS,
            abi: POOL_DATA_PROVIDER_ABI,
            functionName: "getReserveCaps",
            args: [USDC_ADDRESS],
        }) as [bigint, bigint];

        console.log("Supply cap:", formatUnits(supplyCap, 6), "USDC");

        // Récupérer les données actuelles de la réserve
        const reserveData = await publicClient.readContract({
            address: POOL_DATA_PROVIDER_ADDRESS,
            abi: POOL_DATA_PROVIDER_ABI,
            functionName: "getReserveData",
            args: [USDC_ADDRESS],
        }) as any;

        const totalSupplied = reserveData[2]; // totalAToken
        console.log("Total déjà déposé:", formatUnits(totalSupplied, 6), "USDC");

        // Vérifier si le dépôt dépasserait le cap
        if (supplyCap > BigInt(0)) {
            const afterSupply = totalSupplied + amountInWei;
            const availableCapacity = supplyCap - totalSupplied;

            console.log("Capacité disponible:", formatUnits(availableCapacity, 6), "USDC");

            if (afterSupply > supplyCap) {
                throw new Error(
                    `Le dépôt dépasserait le supply cap. ` +
                    `Capacité disponible: ${formatUnits(availableCapacity, 6)} USDC. ` +
                    `Vous tentez de déposer: ${amount} USDC.`
                );
            }
        }

        // 2. Approve
        console.log("Approval en cours...");
        const approveTx = await walletClient.writeContract({
            address: USDC_ADDRESS,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [POOL_ADDRESS, amountInWei],
            account: address,
            gas: BigInt(100000),
        });

        console.log("Approve tx:", approveTx);
        await publicClient.waitForTransactionReceipt({ hash: approveTx });

        // 3. Simuler la transaction supply avant de l'exécuter
        console.log("Simulation de la transaction supply...");
        try {
            await publicClient.simulateContract({
                address: POOL_ADDRESS,
                abi: POOL_ABI,
                functionName: "supply",
                args: [USDC_ADDRESS, amountInWei, address, 0],
                account: address,
            });
            console.log("Simulation réussie !");
        } catch (simError: any) {
            console.error("Erreur de simulation:", simError);
            throw new Error(
                `La transaction échouerait: ${simError.message || "Erreur inconnue"}`
            );
        }

        // 4. Exécuter le supply
        console.log("Exécution du supply...");
        const depositTx = await walletClient.writeContract({
            address: POOL_ADDRESS,
            abi: POOL_ABI,
            functionName: "supply",
            args: [USDC_ADDRESS, amountInWei, address, 0],
            account: address,
            gas: BigInt(1000000),
        });

        console.log("Deposit tx:", depositTx);
        await publicClient.waitForTransactionReceipt({ hash: depositTx });

        return { success: true, txHash: depositTx };
    } catch (error) {
        console.error("Erreur lors du dépôt :", error);
        return { success: false, error: (error as Error).message };
    }
};
