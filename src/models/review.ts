import mongoose, {Schema} from 'mongoose';

const reviewSchema = new Schema({
    api_id: Number,
    user_id: String,
    review: String
})

export default mongoose.model('Review', reviewSchema)