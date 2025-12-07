import {AlertCircleIcon} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

const Unauthorized = () => {
    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Accès non autorisé</AlertTitle>
            <AlertDescription>
                <p>Vous n'avez pas les droits nécessaires pour accéder à cette page</p>
            </AlertDescription>
        </Alert>
    )
}

export default Unauthorized