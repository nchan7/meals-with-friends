const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    }
    
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
        let hash = bcrypt.hashSync(this.password, 12);
        this.password = hash;
    }
    next(); //! remember to call next otherwise it won't save your record
}) // before create hook in Mongoose

//* Valid password? Check Authentication
userSchema.methods.authenticated = function(password) {
    return bcrypt.compareSync(password, this.password) //password = user typed and //this.password = hashed password
}

module.exports = mongoose.model('User', userSchema);


