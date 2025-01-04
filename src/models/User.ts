import mongoose, {Schema} from "mongoose";
import {IPost} from "./Post";

export interface IUser {
    email: string;
    password: string;
    _id?: string;
    refreshToken?: string[];
    post?: IPost;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: [String],
        default: [],
    },
    post: {
        required: false,
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
    }

});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
