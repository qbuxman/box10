import type {LearnCategory} from "@/types/LearnCategory";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

const LearnCategoryCard = ({ learnCategory }: { learnCategory: LearnCategory }) => {
    return (
        <Card className="hover:scale-105 transition duration-200 cursor-pointer h-full">
            <CardHeader>
                <CardTitle>{ learnCategory.icon} { learnCategory.title }</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{learnCategory.description}</p>
                <div className="flex items-center gap-2">
                    { learnCategory.families.map(family => (
                        <Badge key={crypto.randomUUID()} variant="secondary">{family.label}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default LearnCategoryCard;