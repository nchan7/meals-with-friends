import mongoose, {Schema, Document, Mongoose} from 'mongoose';

const reviewSchema = new Schema({
    restaurant_id: {type: Schema.Types.ObjectId, ref: 'Restaurant'},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    user_name: String,
    review: String
})

export interface IReview extends Document {
    _id: string;
    restaurant_id: string;
    user_id: string; 
    user_name: string;
    review: string;
}

export default mongoose.model('Review', reviewSchema)