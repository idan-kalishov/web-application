    import mongoose from "mongoose";

    export interface User {
        email: string;
        password: string;
        _id?: string;
        refreshToken?: string[];
        posts?: mongoose.Types.ObjectId[]; // Add posts field
    }

    const userSchema = new mongoose.Schema<User>({
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
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post", // Reference to the Post model
            },
        ]
    });

    const userModel = mongoose.model<User>("Users", userSchema);

    export default userModel;
