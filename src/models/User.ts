import mongoose from "mongoose";
import {IPost} from "./Post";

export interface IUser {
    email: string;
    password: string;
    _id?: string;
    refreshToken?: string[];
    post?: IPost;
}

const userSchema = new mongoose.Schema<IUser>({
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
        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
    }
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
