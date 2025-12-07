'use client';
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Loader} from "lucide-react";
import {Lesson} from "@/types/Lesson";

const LearnBlockchainCategory = () => {
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getLesson = async () => {
            setIsLoading(true)

            await fetch('/api/learn/categories/blockchain/lesson')
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
                </div>
            )}
        </div>
    )
}

export default LearnBlockchainCategory