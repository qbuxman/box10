import type { LearnCategory } from "@/types/LearnCategory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const LearnCategoryCard = ({
  learnCategory,
}: {
  learnCategory: LearnCategory
}) => {
  return (
    <Card className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer h-full border-2 border-[#E3E3E3]">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-2 text-[#234C6A]">
          <span>{learnCategory.icon}</span>
          <span>{learnCategory.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        <p className="text-sm text-[#456882]">{learnCategory.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {learnCategory.families.map((family) => (
            <Badge
              key={crypto.randomUUID()}
              variant="secondary"
              className="bg-[#E3E3E3] text-[#234C6A] hover:bg-[#E3E3E3]"
            >
              {family.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default LearnCategoryCard
