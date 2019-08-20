import mongoose, {Document, Schema} from 'mongoose';
import {IReview} from './review';

const restaurantSchema = new Schema({
    api_id: Number,
    name: String,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

export interface IRestaurant extends Document {
    _id: String;
    api_id: Number; 
    name: String; 
    reviews: Array<string>;
}

export default mongoose.model('Restaurant', restaurantSchema)