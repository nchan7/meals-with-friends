import mongoose, {Schema, Document, Mongoose} from 'mongoose';

const reviewSchema = new Schema({
    restaurant_id: {type: Schema.Types.ObjectId, ref: 'Restaurant'},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    review: String
})

export interface IReview extends Document {
    _id: string;
    restaurant_id: String;
    review: String;
}

export default mongoose.model('Review', reviewSchema)