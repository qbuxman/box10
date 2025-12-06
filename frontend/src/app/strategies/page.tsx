'use client';
import {useEffect, useState} from "react";
import StrategyCard from "@/components/shared/StrategyCard";
import type {Strategy} from "@/types/Strategy";

const Strategies = () => {
    const fetchData = async () => {
        const response = await fetch('/api/strategies');
        const data = await response.json()
        setStrategies(data);
    }

    const [strategies, setStrategies] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <h1 className={'text-3xl font-bold text-center mb-6'}>📈 Les stratégies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {strategies.map((strategy: Strategy) => (
                    <StrategyCard key={crypto.randomUUID()} strategy={strategy} />
                ))}
            </div>
        </>

    )
}

export default Strategies;