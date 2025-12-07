import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  La boîte à 10%
                </h1>
              </div>
            </div>
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header
