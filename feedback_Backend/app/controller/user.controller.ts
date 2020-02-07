import {Request, Response, Router} from "express";
import UserModel from '../model/user.model';
import Joi from 'joi';
import multer from 'multer';
import * as jwt from "jsonwebtoken";
import fileExt from 'file-extension';
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt'
import {guard} from "../helper/Auth";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z-\d]{2,}$/;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'app/uploads/'),
    filename: async (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + '.' + fileExt(file.originalname))
});

const upload = multer({storage: storage});
const router: Router = Router();

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

//Resgistartion api.
let Registration = (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        firstName: Joi.string().required().regex(/^[A-Za-z]+$/),
        lastName: Joi.string().required().regex(/^[A-Za-z]+$/),
        email: Joi.string().required().email({minDomainAtoms: 2}).regex(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i),
        dob: Joi.string().required(),
        gender: Joi.string().required(),
        profile_img: Joi.any().required(),
    });

    const newData: any = req.body;
    newData.profile_img = req?.file?.filename;

    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) {
                res.status(403).json({
                    status: 403,
                    success: false,
                    message: err.details[0].message,
                })
            } else {
                let passwordarr = ["Aardvark", "Ant", "Anteater", "Wombat", "Ape", "Armadillo", "Donkey",];
                let passwordarrRandom = passwordarr[Math.floor(Math.random() * passwordarr.length)];
                let rando = Math.floor(Math.random() * 1000);
                const saltRounds = 10;
                let salt = bcrypt.genSaltSync(saltRounds);
                const myPlaintextPassword = `${passwordarrRandom}${rando}`;
                console.log(myPlaintextPassword, "myPlaintextPassword");
                let encrypt = bcrypt.hashSync(myPlaintextPassword, salt);
                newData.password = `${encrypt}`;
                //user saved in database
                let datax: any = await new UserModel(newData).save().catch(() => {
                    return res.status(400).json({status: 400, success: false, message: "Sonething went wrong...",})
                });
                //mailing the user.
                let data: any = {...datax._doc};
                delete data.password;
                let transporter = nodemailer.createTransport({
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
                res.status(200).json({status: 200, success: true, message: "User Registered successfully.", data,})
            }
        })
    } catch (err) {
        res.status(403).json({status: 406, success: false, message: err.message,})
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

//login api.
let login = async (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({minDomainAtoms: 2}).required(),
        password: Joi.string().required().regex(passwordRegex),
    });

    const newData = req.body;
    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) {
                res.status(403).json({status: 403, success: false, message: err.details[0].message,})
            } else {
                UserModel.findOne({email: newData.email})
                    .then((data: any) => {
                        let compared = bcrypt.compareSync(newData.password, data.password);
                        if (data?.email == newData.email && compared) {
                            let user: any = {};
                            user.firstName = data.firstName;
                            user.lastName = data.lastName;
                            user.email = data.email;
                            user.dob = data.dob;
                            user.profile_img = `http://localhost:3000/static/${data.profile_img}`;
                            user.gender = data.gender;
                            user.first_login = data.first_login;
                            let jwt_token: any = jwt.sign({
                                email: data.email,
                                id: data._id
                            }, 'secrets', {expiresIn: daysInSeconds(600 / (24 * 60))});
                            res.status(200).json({
                                status: 200,
                                success: true,
                                message: "Login Successfully",
                                data: {jwt_token, user},
                            })
                        } else {
                            res.status(403).json({
                                status: 403,
                                success: false,
                                message: "Email or Password is Invalid.",
                            })
                        }
                    })
                    .catch(() => {
                        res.status(403).json({status: 403, success: false, message: "Email or Password is Invalid.",})
                })
            }
        });
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.message})
    }
};

//password reset api.
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
                res.status(403).json({status: 403, success: false, message: err.details[0].message})
            } else {
                const data: any = await UserModel.findOne({email: newData.loggedInUser.email}).select('password');
                let compared = bcrypt.compareSync(newData.password, data.password);
                if (compared) {
                    const saltRounds = 10;
                    let salt = bcrypt.genSaltSync(saltRounds);
                    const myPlaintextPassword = newData.newpassword;
                    let newPassword = bcrypt.hashSync(myPlaintextPassword, salt);
                    //password updating here.
                    UserModel.updateOne({email: newData.loggedInUser.email}, {$set: {password: newPassword, first_login: false}})
                        .then(async () => {
                            //sending updated password to user.
                            let transporter = nodemailer.createTransport({
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
                                message: "Password update successfully.",
                            })
                        })
                } else {
                    res.status(403).json({status: 403, success: false, message: "Password is Invalid."})
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


router.get('/', ReadUser);
router.post('/', upload.single('profile_img'), Registration);
router.put('/', UpdateUser);
router.delete('/', DeleteUser);
router.post('/login', login);
router.post('/reset', guard, reset);


export default router;