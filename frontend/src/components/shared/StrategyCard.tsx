import type {Strategy} from "@/types/Strategy";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
    return (
        <Card className="hover:scale-105 transition duration-200 cursor-pointer">
            <CardHeader>
                <CardTitle>{ strategy.icon} { strategy.title }</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{strategy.description}</p>
                <p>{ strategy.apr }</p>
            </CardContent>
        </Card>
    )
}

export default StrategyCard;