import mongoose, {Schema} from 'mongoose';
import UserModel from './user.model';

const FeedBackSchema: Schema = new Schema({
    user_id: {required: true, type: Schema.Types.ObjectId, ref: 'UserModel',},
    feedback: {type: String, required: true},
    date: {type: Date, required: true, default: new Date()},
});

export default mongoose.model('FeedBack', FeedBackSchema);