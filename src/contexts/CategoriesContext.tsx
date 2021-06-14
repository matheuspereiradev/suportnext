import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { browserAPIRequest } from '@services/api'
import ChildrenProvider from './ChidreanProvider';
import { useToast } from './ToastContext';
import { Category } from '@interfaces/Ticket';

interface CategoryContextData {
    categories: Category[],
}


export const CategoryContext = createContext({} as CategoryContextData)


export const CategoryProvider = ({ children }: ChildrenProvider) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const {addToast} = useToast();

    useEffect(() => {
        
        if (categories.length===0) {
            try{
                browserAPIRequest.get(`/ticket/category`).then(response => {
                        setCategories(response.data);                        
                })
            }catch{
                addToast({title:"Erro",description:"Erro ao carregar categorias",type:"error"})
            }
        }
    }, [])

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    )

}

export const useCategory = () => useContext(CategoryContext)