import express from 'express';
const router = express.Router(); 
import User, {IUser} from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()


router.get('/users', (req, res) => {
    User.find({}, function(err, users) {
        res.json(users)
    })
})

//* Route for signup
router.post('/signup', (req, res) => {
    //: see if email is already in database
    User.findOne({emai: req.body.email}, (err, user: IUser) => {
        if (user) {
            //: if yes, return an error 
            res.json({type: 'error', message: 'Email already exists'})
        } else {
            //: if no, create the user in the database
            User.create({
                name: req.body.name, 
                email: req.body.email, 
                password: req.body.password
            }, (err, user) => {
                if (err) {
                    res.json({type: 'error', message: 'Database error creating user'}) //* Don't be so specific with errors 
                } else {
                    //: sign a token (this is the login step)
                    var token = jwt.sign(user.toObject(), process.env.JWT_SECRET as string, {
                        expiresIn: '1d'
                    })
                    //* not controlling where the frontend goes to in the backend...no redirect
                    //: res.json the token (browser needs to store this token)
                    //* respond to a route or else the browser will hang
                    res.status(200).json({type: 'success', user: user.toObject(), token})
                }
            })
        }
    })
    //! Code needs to be in the callback function otherwise due to async, it would run the line without waiting to find User
})


//* Route for login
router.post('/login', (req, res) => {
    // Find User in db by email
    User.findOne({email: req.body.email}, (err, user: IUser) => {
        if (!user) {
            res.json({type: 'error', message: 'Account not found'})
            // if there is no user, return error
        } else {
            // if user, check authentication
            if(user.authenticated(req.body.password)) {
                // if autenticatd, sign a token (login)
                var token = jwt.sign(user.toObject(), process.env.JWT_SECRET as string, {
                    expiresIn: '1d'
                })
                // return the token to be saved by the browser
                res.json({type: 'success', user: user.toObject(), token})
            } else {
                res.json({type: 'error', message: 'Authentication failure'})
            }
        }
    })
})

router.post('/friends', (req, res) => {
    console.log(req.body.token)
    var token = req.body.token; 
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user: IUser) => {
        User.findById(user._id, function(err, user:IUser) {
            user.friends.push(req.body.friend_id)
            user.save()
            res.json(user)
        }) 
    })
})

// router.delete('/friends/:id', (req, res) => {
//     User.findById((<any>req).user._id, function(err, user:IUser) {
//         user.friends.pull(req.params.id)
//         user.save(function(err, user) {
//             if (err) res.json(err);
//             res.json({type: 'success', message: 'You deleted one trip', user})
//     })
// })



//* Route for validating tokens
router.post('/me/from/token', (req, res) => {
    // make sure they sent a token to check
    var token = req.body.token; 
    if (!token) {
        // if no token, return an error
        res.json({type: 'error', message: 'You must submit a valid token'})
    } else {
        // if token, verify it
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user: IUser) => {
            if (err) {
                // if token invalid, return error
                res.json({type: 'error', message: 'Invalid token. Please login again.'})
            } else {
                // if token is valid, look up user in the db
                User.findById(user._id).populate('reviews').exec ((err, user: IUser) => {
                    // if user doesn't exist, return error
                    if (err) {
                        res.json({type: 'error', message: 'Database error during validation'})
                    } else {
                        // if user does exist, send back user and token
                        //* We could sign a new token or we could just return the existing one
                        //* var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                        //*     expiresIn: '1d'
                        //* })
                        
                        res.json({type: 'success', user: user.toObject(), token})
                    }
                })
            }
        })
    }
}) 



export default router; 