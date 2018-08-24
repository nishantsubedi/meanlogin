const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// register route
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Failed to register user', err:err});
        } else {
            res.json({success: true, msg: 'User Registered'});
        }
    });

});

// authenticate route
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({successs: false, msg: 'User not found'});
        }
        
        User.comparePassword(password, user.password, (err, isMatch ) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // one week
                });
               
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    })
});

// profile route
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({
        user: {
            id: req.user.id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email
        }
    });
});



module.exports = router;