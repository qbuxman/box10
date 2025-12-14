"use client"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { checkAdminRole } from "@/lib/roles"
import Unauthorized from "@/components/shared/Unauthorized"
import AdminRoleManagement from "@/components/shared/AdminRoleManagement"

const SettingsAdminRole = () => {
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

  return <>{!isAdmin ? <Unauthorized /> : <AdminRoleManagement />}</>
}

export default SettingsAdminRole