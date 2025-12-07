"use client"
import { useEffect, useState } from "react"
import StrategyCard from "@/components/shared/StrategyCard"
import type { Strategy } from "@/types/Strategy"

const Strategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/strategies")
      const data = await response.json()
      setStrategies(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des stratégies :", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <span className="text-white text-2xl">📈</span>
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "#234C6A" }}>
          Les stratégies
        </h1>
        <p className="text-lg" style={{ color: "#456882" }}>
          Découvrez nos stratégies disponibles
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <StrategyCard key={crypto.randomUUID()} strategy={strategy} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Strategies
