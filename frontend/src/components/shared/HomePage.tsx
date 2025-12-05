'use client';
import { useReadContract, useAccount } from 'wagmi'
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/utils/constants";
import {useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChartAreaIcon} from "lucide-react";
import Link from "next/link";

const HomePage = () => {

	const { address, isConnected } = useAccount();
	const { data: balance, error, isPending, refetch } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: 'availableSupply',
	})

	useEffect(() => {
		console.log(balance)
	}, [balance])

	return (
        <div className={'py-6 px-50'}>
            <h1 className={'text-3xl font-bold text-center mb-6'}>👋 Bienvenue dans La Boîte à 10%</h1>
            <Card className={'mb-6'}>
                <CardHeader>
                    <CardTitle className={'align-middle'}>🎯 Objectif : proposer des stratégies accessibles, diversifiées et capables d’atteindre 10 % ou plus selon votre profil.</CardTitle>
                </CardHeader>
            </Card>
            <p className={'mb-2'}>Vous pouvez commencer votre investissement simplement :</p>
            <div className="grid grid-cols-2 gap-6">
                <Card className="hover:scale-105 transition duration-500 cursor-pointer">
                    <CardHeader>
                        <CardTitle>👉 Vous avez des USDC ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Utilisez-les directement dans la dApp.</p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 transition duration-500 cursor-pointer">
                    <CardHeader>
                        <CardTitle>👉 Vous avez des euros ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Grâce à <strong>Transak</strong>, vous achetez des USDC en 2 minutes, puis vous les investissez dans nos stratégies.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center justify-center mt-8">
                <Link href="/strategies">
                    <Button size="lg" variant="outline" className="!px-12 !py-8 cursor-pointer"><ChartAreaIcon/> Voir les stratégies</Button>
                </Link>
            </div>
        </div>
	)
}

export default HomePage
