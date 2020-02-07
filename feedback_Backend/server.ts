import express from 'express';
import mongoose from 'mongoose';
import mainRouter from './app/router/index';
import bodyParser from 'body-parser';
import {cronSchedule} from './app/controller/cron.controller'

const app = express();  //express instance.

//access methods here.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, credentials, withCredentials");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});
app.use(express.json());    //json parser.
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('app/uploads'));  //static image folder.
app.use('/', mainRouter);   //entry point for all routes.
cronSchedule.start();   //cron scheduler.

//app init here.
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
    mongoose.connect('mongodb://localhost:27017/feedback', {useNewUrlParser: true})
        .then(() => console.log("Database Connected"))
        .catch(err => console.log("Db error ", err))
});