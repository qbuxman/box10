'use client';
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Gift, Loader} from "lucide-react";
import {Lesson} from "@/types/Lesson";
import {Button} from "@/components/ui/button";

const LearnTradfiCategory = () => {
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isClaim, setIsClaim] = useState(false)

    useEffect(() => {
        const getLesson = async () => {
            setIsLoading(true)

            await fetch('/api/learn/categories/tradfi/lesson')
                .then(async (response) => {
                    setLesson(await response.json())
                })
                .catch(() => {
                    toast.error('Une erreur est survenue lors de la récupération du cours.')
                })
                .finally(() => setIsLoading(false))
        }

        getLesson()
    }, [])

    const claimToken = async () => {
        setIsClaim(true)
        setTimeout(() => {
            toast.success("Leçon terminée !")
            setIsClaim(false)
        }, 3000)
    }

    return (
        <div>
            <h1 className={'text-3xl font-bold text-center mb-6'}>{ lesson?.title }</h1>
            {isLoading ? (
                <div>
                    <Loader /> Chargement en cours
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">{ lesson?.subtitle }</h2>
                    <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: lesson?.content as string }}
                    />

                    {lesson ? (
                        <div className="flex justify-center py-8">
                            <Button
                                onClick={claimToken}
                                variant="outline"
                                disabled={isClaim}
                                className="mb-4 bg-sky-500 hover:bg-sky-400 cursor-pointer text-white hover:text-white "
                            >
                                {isClaim ?
                                    (<><Loader className="animate-spin"/> Récupération de la récompense...</>) :
                                    (<><Gift /> J'ai terminé ce cours</>)
                                }
                            </Button>
                        </div>
                    ) : ''}
                </div>
            )}
        </div>
    )
}

export default LearnTradfiCategory