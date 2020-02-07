import {Router} from 'express';
import userRouter from '../controller/user.controller';
import feedbackRouter from '../controller/feedback.controller';
import cronRouter from '../controller/cron.controller'

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', userRouter);    //user routers here.
router.use('/feedback', feedbackRouter);    //feedback roouters here.
router.use('/cron', cronRouter);    //cron routers here.
router.use('*', function (req, res) {
    res.status(404).json({status: 404, success: false, message: "Page not found."})
});

// Export the base-router
export default router;