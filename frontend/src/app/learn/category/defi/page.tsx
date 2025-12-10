"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CheckSquare, GraduationCap, Loader } from "lucide-react"
import { Lesson } from "@/types/Lesson"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { claimToken } from "@/utils/claimToken"

const LearnDefiCategory = () => {
  const { isConnected, address } = useAccount()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaim, setIsClaim] = useState(false)

  useEffect(() => {
    const getLesson = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/learn/categories/defi/lesson")
        setLesson(await response.json())
      } catch {
        toast.error("Une erreur est survenue lors de la récupération du cours.")
      } finally {
        setIsLoading(false)
      }
    }
    getLesson()
  }, [])

  const claimTokenForLesson = async () => {
    if (!address) {
      toast.error("Veuillez vous connecter pour recevoir votre récompense.")
      return
    }
    setIsClaim(true)
    await claimToken(address, 10, "defi-lesson")
      .then((response) => {
        if (response.success) {
          toast.success("Leçon terminée ! Vous avez gagné 10 BOX10 !")
        } else {
          toast.error(
            "Une erreur est survenue lors de la récupération des récompenses."
          )
        }
      })
      .catch((error) => {
        toast.error(
          "Une erreur est survenue lors de la récupération de la récompense."
        )
        console.error(error)
      })
      .finally(() => setIsClaim(false))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ backgroundColor: "#234C6A" }}
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold" style={{ color: "#234C6A" }}>
          {lesson?.title}
        </h1>
        <p className="text-lg" style={{ color: "#456882" }}>
          {lesson?.subtitle}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader className="w-8 h-8 animate-spin text-[#234C6A]" />
          <p className="text-lg" style={{ color: "#456882" }}>
            Chargement en cours...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className="prose max-w-none whitespace-pre-wrap text-lg"
            style={{ color: "#456882" }}
            dangerouslySetInnerHTML={{ __html: lesson?.content as string }}
          />
          {isConnected && lesson && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={claimTokenForLesson}
                disabled={isClaim}
                className="px-8 py-6 text-white font-medium transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "#456882" }}
              >
                {isClaim ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Récupération de la récompense...
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    J'ai terminé ce cours
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LearnDefiCategory
