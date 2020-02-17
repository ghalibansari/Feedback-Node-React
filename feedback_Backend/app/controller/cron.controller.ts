import {Request, Response, Router} from "express";
import * as Cron from 'cron';
import CronModel from '../model/cron.model'
import UserModel from '../model/user.model';
import {guard} from "../helper/Auth";
import {Constants} from '../constant'

const router: Router = Router();

//Cron Job init.
let cronSchedule = new Cron.CronJob('0 0 * * FRI', function () { // testing line. please remove this line before production
    cronScheduleCreater();
    console.log("from cron")
}, '0', true);

/**
 * function for craeting random feedback using cron every friday.
 */
let cronScheduleCreater = async () => {
    try {
        await CronModel.deleteMany({});
        let cronData: any = [];
        let data: any = await UserModel.find();
        data.forEach(elm => {
            let cronJson: any = [];
            let cronFisrtName: any = [];
            let cronLastName: any = [];
            let cronImage: any = [];
            for (let i = 0; cronJson.length < Constants.numberOfFeedback; i++) {
                let rando: any = data[Math.floor(Math.random() * data.length)];
                let finder = cronJson.find(e => e == rando._id);
                if (elm._id !== rando._id && finder == undefined) {
                    cronJson.push(rando._id);
                    cronFisrtName.push(rando.firstName);
                    cronLastName.push(rando.lastName);
                    cronImage.push(rando.profile_img)
                }
            }
            for (let i = 0; i < Constants.numberOfFeedback; i++) {
                cronData.push({
                    sender: elm._id,
                    receiver: cronJson[i],
                    receiverName: `${cronFisrtName[i]} ${cronLastName[i]}`,
                    receiverImage: cronImage[i]
                })
            }
        });
        await CronModel.insertMany(cronData)
    } catch (err) {
        console.log("err", err.message);
    }
};

/**
 * inserting feedback here.
 * @param req 
 * @param res {feedback list}
 * @returns feedback list.
 */
let addFeedback = async (req: Request, res: Response) => {
    try {
        CronModel.find({
            sender: req.body.loggedInUser.id,
            status: false
        }).select('sender receiver receiverName receiverImage')
            .then((data) => {
                if (data.length) {
                    data.forEach(elm => elm['receiverImage'] = `http://localhost:3000/static/${elm['receiverImage']}`);
                    res.status(200).json({status: 200, success: true, message: "feedback list.", data})
                } else {
                    res.status(200).json({status: 200, success: false, message: "No feedback found"})
                }
            }).catch((err) => {
            res.status(400).json({status: 400, success: false, message: err.details[0].message})
        })
    } catch (err) {
        res.status(400).json({status: 400, success: false, message: err.details[0].message})
    }
};

//sub route.
router.get('/', cronScheduleCreater);
router.get('/addfeedback', guard, addFeedback);


export default router;
export {cronSchedule};