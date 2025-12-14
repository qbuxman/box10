"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { LearnCategory } from "@/types/LearnCategory"
import LearnCategoryCard from "@/components/shared/LearnCategoryCard"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

const LearnPage = () => {
  const [learnCategories, setLearnCategories] = useState<LearnCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getLearnCategories = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/learn/categories")
        const data = await response.json()
        setLearnCategories(data)
      } catch (error) {
        console.error(error)
        toast.error(
          "Une erreur est survenue lors de la récupération des catégories d'apprentissage."
        )
      } finally {
        setIsLoading(false)
      }
    }
    getLearnCategories()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#234C6A]">
          <span className="text-white text-2xl">
            <GraduationCap />
          </span>
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">Les formations</h1>
        <p className="text-lg text-[#456882]">
          Découvrez nos catégories d'apprentissage
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-[#234C6A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {learnCategories.map((category) => (
            <Link
              key={crypto.randomUUID()}
              href={`/learn/category/${category.path}`}
            >
              <LearnCategoryCard learnCategory={category} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default LearnPage
