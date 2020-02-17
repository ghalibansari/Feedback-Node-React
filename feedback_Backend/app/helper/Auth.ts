import {NextFunction, Request, Response} from "express";
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import * as jwt from "jsonwebtoken";
import {Constants} from '../constant'

/**
 * guard function stops unAuthorize user from access.
 * @param req   {jwt_encrypted_token,   data}
 * @param res
 * @param next
 */
function guard(req: Request, res: Response, next: NextFunction) {
    try {
        let jwt_token_header: any = req.headers['authorization'];   //get encrypted token_header from front_end.
        let jwt_token_decrypt = AES.decrypt(jwt_token_header, Constants.secret_key);  //decrypt token_header.
        let jwt_token = jwt_token_decrypt.toString(CryptoJS.enc.Utf8);  //covert to string.
        req.body.loggedInUser = jwt.verify(jwt_token, Constants.jwt_key);   //verify jwt.
        next();
    } catch (err) {
        res.status(401).json({status: 401, success: false, message: "Login please."})
    }
}

export {guard};