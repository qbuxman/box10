'use client';
import NotConnected from "@/components/shared/NotConnected";
import HomePage from "@/components/shared/HomePage";
import { useAccount } from "wagmi";
import {useEffect} from "react";
import {toast} from "sonner";

export default function Home() {
	const { isConnected } = useAccount();

    useEffect(() => {
        if (!isConnected) {
            toast.success("Vous êtes deconnecté")
        } else {
            toast.success("Vous êtes connecté !")
        }
    }, [isConnected])

  return (
	  <div>
		  {isConnected ? (
			  <HomePage />
		  ) : (
			  <NotConnected />
		  )}
	  </div>
  )
}
