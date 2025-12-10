"use client"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { checkAdminRole } from "@/lib/roles"
import Unauthorized from "@/components/shared/Unauthorized"
import PauseContract from "@/components/shared/PauseContract"

const SettingsPauseContract = () => {
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

  return <>{!isAdmin ? <Unauthorized /> : <PauseContract />}</>
}

export default SettingsPauseContract
