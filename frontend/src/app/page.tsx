'use client';
import NotConnected from "@/components/shared/NotConnected";
import HomePage from "@/components/shared/HomePage";
import { useAccount } from "wagmi";

export default function Home() {
	const { isConnected } = useAccount();

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
