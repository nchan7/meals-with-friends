import mongoose, {Schema, Document, Mongoose} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'You must enter a name'],
        minlength: [1, 'Name must be between 1 and 99 characters'],
        maxlength: [99, 'Name must be between 1 and 99 characters']
    }, 
    password: {
        type: String,
        required: [true, 'You must enter a password'],
        minlength: [8, 'Password must be between 8 and 128 characters'],
        maxlength: [128, 'Password must be between 8 and 128 characters']
    },
    email: {
        type: String,
        required: [true, 'You must enter an email'],
        minlength: [5, 'Email must be between 5 and 99 characters'],
        maxlength: [99, 'Password must be between 5 and 99 characters']
    },
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]

});

//* Strip out password
userSchema.set('toObject', {
    transform: function(doc, ret, options) {
        let returnJson = {
            _id: ret._id, 
            email: ret.email,
            name: ret.name
        }
        return returnJson
    }
    //? doc - which doc
    //? ret - return which one we'll modify to Objected and sent
    //? options 
}) //* Same as serialization with Passport = toJson function...

//* Hash password before passing to database
userSchema.pre('save', function(next) { //! Save operation is not the same every time...save even when update...so need to check if it's new! Otherwise we'll hash even with an update
    if (this.isNew) {        
        let hash = bcrypt.hashSync(this.get('password'), 12);
        this.set('password', hash)
    }
    next(); //! remember to call next otherwise it won't save your record
}) // before create hook in Mongoose

// userSchema.pre('save', function(next) {
//     console.log(this.get('password'));
//     if(!this.isModified('password')) {
//         return next();
//     }
//     let plaintext = this.get('password');
//     this.set('password', bcrypt.hashSync(plaintext, 12));
//     next();
//     });

//* Valid password? Check Authentication
userSchema.methods.authenticated = function(password: string) {
    return bcrypt.compareSync(password, this.get('password')) //password = user typed and //this.password = hashed password
}

//* code sourced from Kelsey Cox

interface IAuthenticated {
    (password: string): boolean
}
interface IModelToObject {
    (): IUser
}

export interface IReview {
    _id?: String;
    review: String;
}

interface IFriend {
}

export interface IUser extends mongoose.Document{
    _id: String;
    name: String;
    email: String;
    password: String;
    friends: IFriend;
    reviews: Array<string>;
    authenticated: IAuthenticated;
    toObject: IModelToObject;
}

export default mongoose.model('User', userSchema); 

