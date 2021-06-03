import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {browserAPIRequest} from'../services/api'
import {setCookie,parseCookies,destroyCookie} from 'nookies'
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
    handleLogin:(email:string,password:string)=>Promise<void>,
    handleLogout:()=>void
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
            })
        }
    },[])

    const handleLogin = async (email:string,password:string) =>{

        const {data} = await browserAPIRequest.post('session',{email,password})
        setUser(data.user)
        browserAPIRequest.defaults.headers['authorization'] = `Bearer ${data.token}`;
        setCookie(undefined,"suportewatoken",data.token,{
            maxAge: 60 * 60 * 2 //2 hours
        })
        Router.push('/ticket')
    }

    const handleLogout = ()=>{
        destroyCookie(undefined,"suportewatoken")
        setUser(undefined)
        browserAPIRequest.defaults.headers['authorization'] = '';
        Router.push('/')
    }

    return (
        <AuthContext.Provider value={{user,isLogged,handleLogin,handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext)