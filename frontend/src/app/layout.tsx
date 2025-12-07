import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import RainbowKitAndWagmiProvider from "@/providers/RainbowKitAndWagmiProvider";
import Layout from "@/components/shared/Layout";
import { Toaster } from "@/components/ui/sonner"

const lato = Lato({
	weight: ['400', '700'],
	subsets: ["latin"],
	display: 'swap',
	variable: "--font-lato",
});


export const metadata: Metadata = {
	title: "BOX10",
	description: "La boîte à 10%",
};

export default function RootLayout({children,}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body
			className={`${lato.className} antialiased`}
		>
		<RainbowKitAndWagmiProvider>
			<Layout>
				{children}
				<Toaster />
			</Layout>
		</RainbowKitAndWagmiProvider>
		</body>
		</html>
	);
}
