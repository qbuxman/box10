import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { Package } from "lucide-react"

const Header = () => {
  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{
        borderColor: "#E3E3E3",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-full"
                style={{ backgroundColor: "#234C6A" }}
              >
                <span className="text-white font-bold">
                  <Package />
                </span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#234C6A" }}>
                La boîte à 10%
              </h1>
            </div>
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export default Header
