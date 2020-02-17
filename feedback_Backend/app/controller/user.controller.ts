import {Request, Response, Router} from "express";
import UserModel from '../model/user.model';
import Joi from 'joi';
import multer from 'multer';
import * as jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import {guard} from "../helper/Auth";
import AES from 'crypto-js/aes';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{2,}$/;    //password regex

const storage = multer.diskStorage({    //multer
    destination: (req, file, cb) => cb(null, 'app/uploads/'),
    filename: async (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)   //changing filename here.
});

const upload = multer({storage: storage});
const router: Router = Router();    //init router instance.

//basic crud operation not in use.
let ReadUser = async (req: Request, res: Response) => {
    try {
        const x: any = await UserModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

/**
 * Resgistartion api.
 * @param req {firstname,   lastname,   email,  dob,    gender,     profile_img}
 * @param res {success or fails message}
 */
let Registration = (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        firstName: Joi.string().required().regex(/^[A-Za-z]+$/),
        lastName: Joi.string().required().regex(/^[A-Za-z]+$/),
        email: Joi.string().required().email({minDomainAtoms: 2}).regex(/^[a-zA-Z]{1,}([.])?[a-zA-Z0-9]{1,}([!@#$%&_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/),
        dob: Joi.string().required(),
        gender: Joi.string().required(),
        profile_img: Joi.any().required(),
    });

    const newData: any = req.body;
    newData.profile_img = req?.file?.filename;

    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) { res.status(400).json({status: 400, success: false, message: err.details[0].message}) }
            else {
                let passwordarr = ["Aardvark", "AntDSa", "Anteater", "Wombat", "Apeght", "Armadillo", "Donkey",];   //random text used in password generation.
                let passwordarrRandom = passwordarr[Math.floor(Math.random() * passwordarr.length)];
                let rando = Math.floor(Math.random() * 1000);
                const saltRounds = 10;
                let salt = bcrypt.genSaltSync(saltRounds);
                const myPlaintextPassword = `${passwordarrRandom}${rando}`;
                let encrypt = bcrypt.hashSync(myPlaintextPassword, salt);
                newData.password = `${encrypt}`;
                let datax: any = await new UserModel(newData).save().catch((err) => {   //user saved in database
                    return res.status(400).json({status: 400, success: false, message: err.errmsg,})
                });
                let data: any = {...datax._doc};
                delete data.password;
                let transporter = nodemailer.createTransport({  //mailing the user new password.
                    host: "mail.neosofttech.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: `ghalib.ansari@neosofttech.com`, // generated ethereal user
                        pass: `m[TiDt%1vxv[` // generated ethereal password
                    },
                    tls: {rejectUnauthorized: false}
                });
                let info = await transporter.sendMail({
                    from: '"Feedback" <ghalib.ansari@neosofttech.com>', // sender address
                    to: newData.email, // list of receivers
                    bcc: 'ghalib.ansari@neosofttech.com',
                    subject: "Feedback Application", // Subject line
                    text: "Please log your feedback", // plain text body
                    html: `Thanks for Registration, your Email is ${newData.email} and your password is ${myPlaintextPassword}` // html body
                });
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Registration Sucessfull. Please Check email for password.",
                    data
                })
            }
        })
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.message,})
    }
};

//basic crud operation not in use.
let UpdateUser = async (req: Request, res: Response) => {
    try {
        const x: any = await UserModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

//basic crud operation not in use.
let DeleteUser = async (req: Request, res: Response) => {
    try {
        const x: any = await UserModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

/**
 * login api.
 * @param req   {email,     password}
 * @param res   {encrypted_jwt_token,   user_object}
 * @returns {encrypted_jwt_token,   user_object}
 */
let login = async (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({minDomainAtoms: 2}).regex(/^[a-zA-Z]{1,}([.])?[a-zA-Z0-9]{1,}([!@#$%&_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/).required(),
        password: Joi.string().required().regex(passwordRegex),
    });

    const newData = req.body;
    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) {
                res.status(400).json({status: 400, success: false, message: err.details[0].message,})
            } else {
                UserModel.findOne({email: newData.email})
                    .then((data: any) => {
                        let compared = bcrypt.compareSync(newData.password, data.password);
                        console.log(compared, "comapred", newData.password, " ", data.password, " ", newData.email);
                        if (data?.email == newData.email && compared) {
                            let user: any = {};     //making new object of user before sending to front_end.
                            user.firstName = data.firstName;
                            user.lastName = data.lastName;
                            user.email = data.email;
                            user.dob = data.dob;
                            user.profile_img = `http://localhost:3000/static/${data.profile_img}`;
                            user.gender = data.gender;
                            user.first_login = data.first_login;
                            let jwt_token_eccyrpt: any = jwt.sign({
                                email: data.email,
                                id: data._id
                            }, 'secrets', {expiresIn: daysInSeconds(600 / (24 * 60))});
                            let jwt_token = AES.encrypt(jwt_token_eccyrpt, 'secret_key_jwt_token').toString();
                            res.status(200).json({
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                data: {jwt_token, user, token: jwt_token_eccyrpt},
                            })
                        } else {
                            res.status(401).json({
                                status: 401,
                                success: false,
                                message: "Email or Password is Invalid."
                            })
                        }
                    })
                    .catch(() => {
                        res.status(401).json({status: 401, success: false, message: "Email or Password is Invalid.",})
                    })
            }
        });
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.message})
    }
};

/**
 * password reset api.
 * @param req   {oldpassword,   newpassword}
 * @param res   {success or fails message}
 */
let reset = async (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        password: Joi.string().required().regex(passwordRegex),
        newpassword: Joi.string().required().regex(passwordRegex),
        loggedInUser: Joi.any(),
    });

    const newData = req.body;
    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) {
                res.status(400).json({status: 400, success: false, message: err.details[0].message})
            } else {
                const data: any = await UserModel.findOne({email: newData.loggedInUser.email}).select('password');
                let compared = bcrypt.compareSync(newData.password, data.password);     //comparing oldpassword and newpassword.
                if (compared) {
                    const saltRounds = 10;
                    let salt = bcrypt.genSaltSync(saltRounds);
                    const myPlaintextPassword = newData.newpassword;
                    let newPassword = bcrypt.hashSync(myPlaintextPassword, salt);
                    UserModel.updateOne({email: newData.loggedInUser.email}, {      //password updating here.
                        $set: { password: newPassword, first_login: false }
                    })
                        .then(async () => {
                            let transporter = nodemailer.createTransport({      //sending info about password updated..
                                host: "mail.neosofttech.com",
                                port: 587,
                                secure: false, // true for 465, false for other ports
                                auth: {
                                    user: `ghalib.ansari@neosofttech.com`, // generated ethereal user
                                    pass: `m[TiDt%1vxv[` // generated ethereal password
                                },
                                tls: {rejectUnauthorized: false}
                            });
                            let info = await transporter.sendMail({
                                from: '"Feedback" <ghalib.ansari@neosofttech.com>', // sender address
                                to: newData.loggedInUser.email, // list of receivers
                                bcc: 'ghalib.ansari@neosofttech.com',
                                subject: "Feedback Application", // Subject line
                                text: "Your password Successfully updated...", // plain text body
                                html: `Your password Successfully updated...` // html body
                            });
                            console.log("Message sent: %s", info.messageId);
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                            return res.status(200).json({
                                status: 200,
                                success: true,
                                message: "Password update successfully."
                            })
                        })
                } else {
                    res.status(400).json({status: 400, success: false, message: "Password is Invalid."})
                }
            }
        })
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.message})
    }
};

//seconds in days calculation.
function daysInSeconds(days: number): number {
    // const oneMinute: number = 1000 * 60;
    const oneHour: number = 60 * 60;
    const oneDay: number = oneHour * 24;
    return oneDay * days;
}

//all sub-route's.
router.get('/', ReadUser);
router.post('/', upload.single('profile_img'), Registration);
router.put('/', UpdateUser);
router.delete('/', DeleteUser);
router.post('/login', login);
router.post('/reset', guard, reset);


export default router;