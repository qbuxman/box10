'use client';
import ClaimToken from "@/components/shared/ClaimToken";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {checkDistributorRole} from "@/lib/distributor";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircleIcon} from "lucide-react";

const Distribute = () => {
    const { address, isConnected } = useAccount()

    const [isDistributor, setIsDistributor] = useState(false)

    useEffect(() => {
        const checkIfUserConnectedRole = async () => {
            if (address && isConnected) {
                const result = await checkDistributorRole(address)
                setIsDistributor(result)
            } else {
                setIsDistributor(false)
            }
        }

        checkIfUserConnectedRole()
    }, [isConnected, address])

    return (
        <>
            { isDistributor ? (<ClaimToken/>) :
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Accès non autorisé</AlertTitle>
                    <AlertDescription>
                        <p>Vous n'avez pas les droits nécessaires pour accéder à cette page</p>
                    </AlertDescription>
                </Alert>
            }
        </>
    )
}

export default Distribute;