import axios from 'axios'


const baseURL = `http://localhost:3000/`
const token: any = localStorage.getItem('token');

export const withOutTokenPost = async(url: string, data: any, headers: object|null = null) => {
    const withToken = axios.create({ baseURL, headers })
    console.log(url," ",data," ",headers)
    try{ return await withToken.post(url, data) }
    catch(err) {
        console.log(err)
        throw err }
}

export const withTokenGet = async(url: string) => {
    const withToken = axios.create({ baseURL, headers: {Authorization: `${token}`} })
    try{ return await withToken.get(url) }
    catch(err) { throw err }
}

export const withTokenPost = async(url: string, data: any) => {
    const withToken = axios.create({ baseURL, headers: {Authorization: `${token}`} })
    try{ return await withToken.post(url, data) }
    catch(err) { throw err }
}