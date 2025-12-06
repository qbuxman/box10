import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-1 mt-6 px-4 md:px-8 lg:px-12 xl:px-16">
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default Layout
