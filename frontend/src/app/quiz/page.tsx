import { Construction } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const QuizPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#234C6A]">
          <Construction className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#234C6A]">
          Quiz non disponible
        </h1>
        <p className="text-lg text-[#456882]">
          Cette partie de l'application n'est pas encore disponible.
        </p>
      </div>
      <Card className="border-2 border-[#E3E3E3]">
        <CardContent className="py-12 text-center">
          <p className="text-lg text-[#456882]">
            Nous travaillons encore sur cette fonctionnalité 😊
          </p>
          <p className="text-sm mt-2 text-[#456882]">
            En attendant, vous pouvez déjà consulter nos{" "}
            <Link href="/learn" className="font-bold text-md underline">
              fiches explicatives
            </Link>{" "}
            🤓
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizPage
