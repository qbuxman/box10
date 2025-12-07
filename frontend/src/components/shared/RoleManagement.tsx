import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Button} from "@/components/ui/button";

const RoleManagement = () => {
    const [addressToAddRole, setAddressToAddRole] = useState('')
    const [addressToRemoveRole, setAddressToRemoveRole] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const addRoleToAddress = async (address: string) => {}

    return (
        <>
            <h1 className={'text-3xl font-bold text-center mb-6'}>👮‍♂️ Gestion des rôles</h1>

            <h2>Rôle "Distributeur"</h2>
            <div>
                <h3>Ajouter le rôle</h3>
                <div>
                    <Input value={addressToAddRole} onChange={(e) => setAddressToAddRole(e.target.value)}/>
                    <Button
                        variant="outline"
                        disabled={!addressToAddRole || isLoading }
                    >Ajouter le rôle à cette adresse</Button>
                </div>
            </div>
        </>
    )
}

export default RoleManagement