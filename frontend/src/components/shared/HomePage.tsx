'use client';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {BadgeDollarSign, ChartAreaIcon, GraduationCap, Lightbulb, LockOpen} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {checkDistributorRole, checkAdminRole} from "@/lib/roles";


const HomePage = () => {
    const { address, isConnected } = useAccount()

    const [isDistributor, setIsDistributor] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkConnectedUserRoles = async () => {
            if (address && isConnected) {
                const isAdmin_ = await checkAdminRole(address)
                setIsAdmin(isAdmin_)

                const isDistributor_ = await checkDistributorRole(address)
                setIsDistributor(isDistributor_)
            } else {
                setIsAdmin(false)
                setIsDistributor(false)
            }
        }

        checkConnectedUserRoles()
    }, [isConnected, address])

	return (
        <div>
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
                        <p>Utilisez-les dès maintenant !</p>
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
            <div className="flex items-center justify-center mt-8 gap-4">
                <Link href="/strategies">
                    <Button size="lg" variant="outline" className="!px-8 !py-6 cursor-pointer"><ChartAreaIcon/> Voir les stratégies</Button>
                </Link>
                <Link href="/learn">
                    <Button size="lg" variant="outline" className="!px-8 !py-6 cursor-pointer"><GraduationCap/>Se former</Button>
                </Link>
                <Link href="/quiz">
                    <Button size="lg" variant="outline" className="!px-8 !py-6 cursor-pointer"><Lightbulb/>Tester ses connaissances</Button>
                </Link>
                {isDistributor ? (
                    <div>
                        <Link href="/distribute">
                            <Button size="lg" variant="outline" className="!px-8 !py-6 cursor-pointer"><BadgeDollarSign/> Envoyer des jetons</Button>
                        </Link>
                    </div>
                ) : ''}
                {isAdmin ? (
                    <div>
                        <Link href="/admin/settings/roles">
                            <Button size="lg" variant="outline" className="!px-8 !py-6 cursor-pointer"><LockOpen/> Gestion des rôles</Button>
                        </Link>
                    </div>
                ) : ''}
            </div>
        </div>
	)
}

export default HomePage
