import { createContext, ReactNode, useContext, useState } from 'react';

interface User{
    id: string,
    name: string,
    surname:string,
    email:string,
    idCompany:number,
    gender:string
}

interface AuthContextData{
    user: User,
    token: string,
    isLogged:boolean
}

interface ChildrenProvider{
    children:ReactNode
}

export const AuthContext = createContext({} as AuthContextData)


export const AuthProvider = ({children}:ChildrenProvider) => {

    const [user, setUser] = useState<User>()
    const [token,setToken] = useState('')
    const [isLogged, setIsLogged] = useState(false)

    const handleLogin = (email:string,password:string) =>{
        
    }

    return (
        <AuthContext.Provider value={{user,token,isLogged}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext)