import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content?: string;
    owner: string;
    comments: mongoose.Types.ObjectId[]; 
}

const postSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: String,
    owner: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
