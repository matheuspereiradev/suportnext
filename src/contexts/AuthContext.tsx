import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {browserAPIRequest} from'../services/api'
import {setCookie,parseCookies} from 'nookies'
import Router from 'next/router'

interface User{
    id: string,
    name: string,
    surname:string,
    email:string,
    idCompany:number,
    isAdmin:boolean,
    gender:string
}

interface AuthContextData{
    user: User,
    isLogged:boolean,
    handleLogin:(email:string,password:string)=>Promise<void>
}

interface ChildrenProvider{
    children:ReactNode
}

export const AuthContext = createContext({} as AuthContextData)


export const AuthProvider = ({children}:ChildrenProvider) => {

    const [user, setUser] = useState<User|undefined>(undefined)
    const isLogged = !!user

    useEffect(()=>{
        const {'suportewatoken':token} = parseCookies();

        if(token){
            browserAPIRequest.get(`/session/${token}`).then(response=>{
                setUser(response.data.user)
                console.log(response)
            })
        }
    },[])

    const handleLogin = async (email:string,password:string) =>{

        const {data} = await browserAPIRequest.post('session',{email,password})

        setUser(data.user)

        browserAPIRequest.defaults.headers['authorization'] = `Bearer ${data.token}`

        setCookie(undefined,"suportewatoken",data.token,{
            maxAge: 60 * 60 * 2 //2 hours
        })

        Router.push('/ticket')
    }

    return (
        <AuthContext.Provider value={{user,isLogged,handleLogin}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext)