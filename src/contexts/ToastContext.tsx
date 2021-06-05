import { createContext, useContext, useState } from "react"
import {v4 as uuid} from 'uuid';
import { Toast } from "../components/toast"
import ChildrenProvider from "./ChidreanProvider"

interface ToastContextData{
    addToast(message:Omit<Message,'id'>):void;
    removeToast(id:string):void;
}

export interface Message{
    id:string;
    type:'success'|'error'|'info'|'warning';
    description:string;
    title:string;
}

export const ToastContext = createContext({} as ToastContextData)


export const ToastProvider = ({children}:ChildrenProvider) => {

    const [message,setMessage] = useState<Message[]>([])    

    const addToast = ({description,title,type="info"}:Omit<Message,'id'>)=>{
        const id = uuid();

        const toast ={
            id,
            type,
            title,
            description
        }

        setMessage([...message,toast])
    }

    const removeToast = (id:string)=>{
        setMessage(state=>state.filter(msg => msg.id !== id))
    }

    return (
        <ToastContext.Provider value={{addToast,removeToast}}>
            {children}
            <Toast messages={message}></Toast>
        </ToastContext.Provider>
    )
    
}

export const useToast = () => useContext(ToastContext)