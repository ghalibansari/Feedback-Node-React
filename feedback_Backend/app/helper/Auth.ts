import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

//guard funtion stops unAuthorize user from access.
function guard(req: Request, res: Response, next: NextFunction) {
    try {
        let jwt_token: any = req.headers['authorization'];
        req.body.loggedInUser = jwt.verify(jwt_token, 'secrets');
        next();
    } catch (err) {
        res.status(403).json({status: 403, success: false, message: err.message})
    }
}

export {guard};