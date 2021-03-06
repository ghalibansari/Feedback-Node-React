import mongoose, {Schema} from 'mongoose';

//user schema.
const UserSchema: Schema = new Schema({
    firstName: {type: String},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dob: {type: Date, required: true},
    profile_img: {type: String, required: false},
    gender: {type: Number, required: true, enum: [0, 1, 2]},
    first_login: {type: Boolean, default: true},
});

export default mongoose.model('User', UserSchema);