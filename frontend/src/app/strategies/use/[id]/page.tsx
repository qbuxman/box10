"use client"
import { Strategy } from "@/types/Strategy"
import { useEffect, useState } from "react"
import StrategyDetail from "@/components/shared/StrategyDetail"
import { useParams } from "next/navigation"

const StrategyUse = () => {
  const params = useParams()
  const id = params?.id as string

  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/strategies/use/${id}`)
      const data = await response.json()
      setStrategy(data)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de la stratégie :",
        error
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  return (
    <>
      {isLoading && !strategy ? (
        <p>Chargement en cours...</p>
      ) : (
        <StrategyDetail strategy={strategy as Strategy} />
      )}
    </>
  )
}

export default StrategyUse
