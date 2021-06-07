import { createContext, useContext, useState } from "react"
import { Interaction } from "../interfaces/Ticket";
import { browserAPIRequest } from "../services/api";
import ChildrenProvider from "./ChidreanProvider";
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";

interface InteractionContextData{
    refreshInteractions(id:number):Promise<void>;
    setInteractions(Interactions:Array<Interaction>):void;
    removeInteraction(id:string):void;
    interactions:Interaction[];
}

export const InteractionContext = createContext({} as InteractionContextData)


export const InteractionProvider = ({children}:ChildrenProvider) => {

    const [interactions,setInteractions] = useState<Array<Interaction>>([]) 
    
    const removeInteraction = (id:string)=>{
        setInteractions(state=>state.filter(msg => msg.id !== id))
    }

    const refreshInteractions = async(id:number)=>{
        const { data } = await browserAPIRequest.get(`ticket/find/${id}`);

        const interactionArray = data.interactions.map(msg => {
            return {
                id: msg.id,
                text: msg.text,
                file: msg.file,
                idTicket: msg.idTicket,
                isPrivate: msg.isPrivate,
                created_at: format(parseISO(msg.created_at), 'dd MMM yyyy HH:mm', { locale: ptBR }),
                sender: msg.sender
            }
        })
        setInteractions(interactionArray)
       
    }

    return (
        <InteractionContext.Provider value={{refreshInteractions,interactions,setInteractions,removeInteraction}}>
            {children}
        </InteractionContext.Provider>
    )
    
}

export const useInteraction = () => useContext(InteractionContext)