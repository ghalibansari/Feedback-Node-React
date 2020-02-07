import mongoose, {Schema} from 'mongoose';

const CronSchema: Schema = new Schema({
    sender: {required: true, type: Schema.Types.ObjectId, ref: 'UserModel',},
    receiver: {required: true, type: Schema.Types.ObjectId, ref: 'UserModel'},
    receiverName: {required: true, type: String},
    receiverImage: {type: String, required: true},
    status: {type: Boolean, default: false},
});

export default mongoose.model('Cron', CronSchema);