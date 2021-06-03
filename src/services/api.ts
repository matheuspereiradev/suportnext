import axios from 'axios'
import {parseCookies} from 'nookies'

export function clientAPIRequest(context?:any){

    const {'suportewatoken':token} = parseCookies(context);

    const api = axios.create({
        baseURL:"http://localhost:3030/"
    })
    
    if(token){
        api.defaults.headers['authorization'] = `Bearer ${token}`
    }

    return api;
}

export const browserAPIRequest = clientAPIRequest()