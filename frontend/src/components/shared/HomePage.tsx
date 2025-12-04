'use client';
import { useReadContract, useAccount } from 'wagmi'
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/utils/constants";
import {useEffect} from "react";
import {toast} from "sonner";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const HomePage = () => {

	const { address } = useAccount();
	const { data: balance, error, isPending, refetch } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: 'availableSupply',
	})

	useEffect(() => {
		console.log(balance)
	}, [balance])

	return (
        <>
            <h1 className={'text-2xl text-orange-400'}>👋 Bienvenue dans La Boîte à 10%</h1>
            <p>Vous pouvez commencer votre investissement simplement :</p>
            <div className="flex flex-col ">
                <Card>
                    <CardHeader>
                        <CardTitle>👉Vous avez des USDC ?</CardTitle>
                        <CardDescription>Utilisez-les directement dans la dApp.</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>👉Vous avez des euros ?</CardTitle>
                        <CardDescription>Grâce à <strong>Transak</strong>, vous achetez des USDC en 2 minutes, puis vous les investissez dans nos stratégies.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <p>Total supply : { balance ? Number(balance) : 0 }</p>
            <p>Balance : { balance ? Number(balance) : 0 }</p>
        </>
	)
}

export default HomePage
