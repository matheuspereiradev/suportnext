import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { browserAPIRequest } from '../services/api'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'
import ChildrenProvider from './ChidreanProvider';
import { useToast } from './ToastContext';
import { Status } from '../interfaces/Ticket';

interface StatusContextData {
    status: Status[],
}


export const StatusContext = createContext({} as StatusContextData)


export const StatusProvider = ({ children }: ChildrenProvider) => {

    const [status, setStatus] = useState<Status[]>([]);
    const {addToast} = useToast();

    useEffect(() => {
        
        if (status.length===0) {
            try{
                browserAPIRequest.get(`/ticket/status`).then(response => {
                        setStatus(response.data);                        
                })
            }catch{
                addToast({title:"Erro",description:"Erro ao carregar status",type:"error"})
            }
        }
    }, [])

    return (
        <StatusContext.Provider value={{ status }}>
            {children}
        </StatusContext.Provider>
    )

}

export const useStatus = () => useContext(StatusContext)