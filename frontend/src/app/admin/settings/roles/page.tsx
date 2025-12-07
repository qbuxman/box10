'use client'
import ClaimToken from "@/components/shared/ClaimToken";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircleIcon} from "lucide-react";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {checkAdminRole} from "@/lib/admin";
import Unauthorized from "@/components/shared/Unauthorized";
import RoleManagement from "@/components/shared/RoleManagement";

const SettingsRoles = () => {
    const { address, isConnected } = useAccount()

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkConnectedUserRole = async () => {
            if (address && isConnected) {
                const result = await checkAdminRole(address)
                setIsAdmin(result)
            } else {
                setIsAdmin(false)
            }
        }

        if (isConnected) checkConnectedUserRole()
    }, [isConnected, address])

    return (
        <>
            { !isAdmin ? <Unauthorized/> : <RoleManagement/> }
        </>

    )
}

export default SettingsRoles;