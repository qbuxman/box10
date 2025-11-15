'use client';
import { useReadContract, useAccount } from 'wagmi'
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "@/utils/constants";
import { publicClient } from "@/utils/client";
import {useEffect} from "react";
import {formatEther} from "viem";

const HomePage = () => {

	const { address } = useAccount();
	const { data: balance, error, isPending, refetch } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: CONTRACT_ABI,
		functionName: 'getContractBalance',
	})

	useEffect(() => {
		console.log(balance)
	}, [balance])

	return (
		<p>Home : { balance ? Number(formatEther(balance as bigint)).toFixed(4) : 0 }</p>
	)
}

export default HomePage
