'use client'

import {useEffect, useState} from "react";
import {toast} from "sonner";
import {LearnCategory} from "@/types/LearnCategory";
import LearnCategoryCard from "@/components/shared/LearnCategoryCard";
import Link from "next/link";

const LearnPage = () => {
    const [learnCategories, setLearnCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const getLearnCategories = async () => {
            setIsLoading(true)

            await fetch('/api/learn/categories')
                .then(async (response) => {
                    setLearnCategories(await response.json())
                })
                .catch(() => {
                    toast.error('Une erreur est survenue lors de la récupération des catégories d\'apprentissage.')
                })
                .finally(() => setIsLoading(false))
        }

        getLearnCategories()
    }, [])

    return (
        <>
            <h1 className={'text-3xl font-bold text-center mb-6'}>🎓 Les formations</h1>
            {isLoading ? (
                <div>Chargement en cours...</div>
            ) : (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {learnCategories.map((category: LearnCategory) => (
                        <div key={crypto.randomUUID()}>
                            <Link href={`/learn/category/${category.path}`}>
                                <LearnCategoryCard learnCategory={category}/>
                            </Link>
                        </div>
                    ))}
                </div>
            )
            }
        </>
    )
}

export default LearnPage;