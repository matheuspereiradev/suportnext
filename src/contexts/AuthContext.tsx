import { createContext, useContext, useEffect, useState } from 'react';
import { browserAPIRequest } from '../services/api'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'
import ChildrenProvider from './ChidreanProvider';
import { useToast } from './ToastContext';

interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    idCompany: number,
    admin: boolean,
    gender: string
}

interface AuthContextData {
    user: User,
    isLogged: boolean,
    handleLogin: (email: string, password: string) => Promise<void>,
    handleLogout: () => void
}


export const AuthContext = createContext({} as AuthContextData)


export const AuthProvider = ({ children }: ChildrenProvider) => {

    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLogged,setIsLogged] = useState<boolean>(false);
    const {addToast} = useToast();

    useEffect(() => {
        const { 'suportewatoken': token } = parseCookies();

        if (token) {
            browserAPIRequest.get(`/session/${token}`).then(response => {
                    const usr=response.data.user;
                    setUser(usr)
                    setIsLogged(true)
                    
            })
        }
    }, [])

    const handleLogin = async (email: string, password: string) => {
        try {
            const { data } = await browserAPIRequest.post('session', { email, password })
            setUser(data.user)
            setIsLogged(true)
            browserAPIRequest.defaults.headers['authorization'] = `Bearer ${data.token}`;
            setCookie(undefined, "suportewatoken", data.token, {
                maxAge: 60 * 60 * 2 //2 hours
            })
            Router.push('/ticket')
        } catch (e) {
            addToast({description:"Email ou senha incorretos, verifique suas credenciais e tente novamente",title:"Erro na autenticação", type:"error"})
        }

    }

    const handleLogout = () => {
        destroyCookie(undefined, "suportewatoken")
        setUser(undefined)
        setIsLogged(false)
        browserAPIRequest.defaults.headers['authorization'] = '';
        Router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, isLogged, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)