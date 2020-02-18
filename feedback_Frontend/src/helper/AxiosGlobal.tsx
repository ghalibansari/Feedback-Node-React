import axios from 'axios'
import {Constants} from '../helper/constant'


/**
 * @global Global Post request without token.
 * @param {url,    data,   headers: Defined content type in registration page.}
 */
export const withOutTokenPost = async (url: string, data: any, headers: object | null = null) => {
    const withToken = axios.create({baseURL: Constants.baseURL, headers});
    try { return await withToken.post(url, data) }
    catch (err) { throw err }
};


/**
 * @global Global Get request with token.
 * @param {url}
 */
export const withTokenGet = async (url: string) => {
    const token: any = localStorage.getItem('token');
    const withToken = axios.create({baseURL: Constants.baseURL, headers: {Authorization: `${token}`}});
    try { return await withToken.get(url) }
    catch (err) { throw err }
};


/**
 * @global Global Post request with token.
 * @param {url,    data}
 */
export const withTokenPost = async (url: string, data: any) => {
    const token: any = localStorage.getItem('token');
    const withToken = axios.create({baseURL: Constants.baseURL, headers: {Authorization: `${token}`}});
    try { return await withToken.post(url, data) }
    catch (err) { throw err }
};