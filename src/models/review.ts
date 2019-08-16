import mongoose, {Schema} from 'mongoose';

const reviewSchema = new Schema({
    review: String
})

export default mongoose.model('Review', reviewSchema)