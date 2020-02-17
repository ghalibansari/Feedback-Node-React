import {Request, Response, Router} from "express";
import FeedBackModel from '../model/feedback.model';
import CronModel from '../model/cron.model'
import Joi from 'joi';
import {guard} from '../helper/Auth';

const router: Router = Router();

//basic crud operation not in use.
let ReadFeedBack = async (req: Request, res: Response) => {
    try {
        const x: any = await FeedBackModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

/**
 * new feedback inserts here.
 * @param req   {user_id,   feedback}
 * @param res   {success}
 */
let CreateFeedBack = async (req: Request, res: Response) => {
    const newData: any = req.body;
    const schema = Joi.object().keys({
        user_id: Joi.string().required(),
        feedback: Joi.string().required(),
        loggedInUser: Joi.any()
    });

    try {
        Joi.validate(newData, schema, async (err: any, value: String) => {
            if (err) {
                res.status(400).json({status: 400, success: false, message: err.details[0].message,})
            } else {
                CronModel.updateOne({
                    sender: req.body.loggedInUser.id,
                    receiver: newData.user_id,
                    status: false
                }, {status: true})
                    .then(data => {
                        if (data.nModified) {
                            new FeedBackModel(newData).save()
                                .then(() => {
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        message: "Feedback successfully added",
                                    });
                                })
                        } else {
                            res.status(400).json({status: 400, success: false, message: "failed to insert",});
                        }
                    })
            }
        })
    } catch (err) {
        console.log("err", err.message);
        res.status(400).json({status: 400, success: false, message: err.message,});
    }
};

//basic crud operation not in use.
let UpdateFeedBack = async (req: Request, res: Response) => {
    try {
        const x: any = await FeedBackModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

//basic crud operation not in use.
let DeleteFeedBack = async (req: Request, res: Response) => {
    try {
        const x: any = await FeedBackModel.find();
        res.status(200).json({x});
    } catch (err) {
        console.log("err", err.message);
        res.send(err.message);
    }
};

/**
 * dashbaord api.
 * @param req 
 * @param res {all feedback of that particular user}
 */
let DashBoard = async (req: Request, res: Response) => {
    try {
        const data: any = await FeedBackModel.find({user_id: req.body.loggedInUser.id,}).select('date feedback');
        res.status(200).json({status: 200, success: true, message: "dashboard list.", data,})
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.message,})
    }
};

//all sub route's.
router.get('/', guard, ReadFeedBack);
router.post('/', guard, CreateFeedBack);
router.put('/', UpdateFeedBack);
router.delete('/', DeleteFeedBack);
router.get('/dashboard', guard, DashBoard);


export default router;