'use client'

import ClaimToken from "@/components/shared/ClaimToken";
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const Distribute = () => {
    const [recipientForBoxToken, setRecipientForBoxToken] = useState('0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc')
    const [amountToSend, setAmountToSend] = useState<number>(0)
    const [activityId, setActivityId] = useState('')

    return (
        <>
            <div className="flex items-center justify-center mt-8 gap-4">
                <Select onValueChange={(e) => setActivityId(e)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choisir un motif" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Activité réalisée</SelectLabel>
                            <SelectItem value="read-article">Article lu</SelectItem>
                            <SelectItem value="quiz">Quiz effectué</SelectItem>
                            <SelectItem value="strategy-used">Utilisation d'une stratégie</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <input
                    type="number"
                    value={amountToSend}
                    className="border border-black-2 p-2 rounded-lg"
                    onChange={(e) => {setAmountToSend(Number(e.target.value))}}
                />
                <input
                    type="text"
                    value={recipientForBoxToken}
                    className="border border-black-2 p-2 rounded-lg"
                    placeholder="Renseigner l'adresse du destinataire"
                    onChange={(e) => { setRecipientForBoxToken(e.target.value) }}
                />

            </div>
            <ClaimToken recipient={recipientForBoxToken} amount={amountToSend} activityId={activityId}/>
        </>
    )
}

export default Distribute;