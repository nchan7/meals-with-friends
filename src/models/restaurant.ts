import mongoose, {Schema} from 'mongoose';

const restaurantSchema = new Schema({
    api_id: Number,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]


})

export default mongoose.model('Restaurant', restaurantSchema)