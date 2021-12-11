/*
Name: Peyman Moshfegh
ID: 301151808
Date: 10/29/2021
*/

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//create user model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'Home', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('about', {title: 'About', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayProjectsPage = (req, res, next) => {
    res.render('projects', {title: 'Projects', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayServicesPage = (req, res, next) => {
    res.render('services', {title: 'Services', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayContactPage = (req, res, next) => {
    res.render('contact', {title: 'Contact', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayLoginPage = (req, res, next) => {
    // check if user is not already loged in
    if (!req.user) {
        res.render('auth/login', {
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        })
    }
    else {
        res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        //if server err?
        if (err) {
            return next(err);
        }

        //is there a user login error?
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        } 

        req.login(user, (err) => {
            // server error?
            if(err) {
                return next(err);
            }
            return res.redirect('survey-list');
        });
        
    })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
    // check if user is not already loged in
    if (!req.user) {
        res.render('auth/register', {
            title: "Register",
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password
        email: req.body.email,
        displayName: req.body.displayName
    })

    User.register(newUser, req.body.password, (err) => {
        if(err) {
            console.log("Error: Inserting new user");
            if(err.name == "UserExistsError") {
                req.flash('registerMessage', 'Registration Error: User Already Exists!');
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register', {
                title: "Register",
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        } else {
            // if no error exists, then  registration is successful

            // redirect the user and authenticate

            return passport.authenticate('local')(req, res, () => {
                res.redirect('/survey-list');
            })
        }

    })
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}


module.exports.displayUpdateProfilePage = (req, res, next) => {
    // check if user is not already loged in
    if (!req.user) {
        res.render('auth/register', {
            title: "Register",
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        res.render('auth/updateProfile', {
            title: "Update Your Profile",
            messages: req.flash('updateMessage'),
            displayName: req.user ? req.user.displayName : '',
            user: req.user});
    }
}

module.exports.processUpdateProfilePage = (req, res, next) => {
    let userId = req.user._id

    User.remove({_id: userId}, (err) => {
        if (err) {
            console.log(err);
            res.end(err);    
        } else {
            let updatedUser = User({
                "_id": userId,
                "username": req.body.username,
                "email": req.body.email,
                "displayName": req.body.displayName
            })

            User.register(updatedUser, req.body.password, (err) => {
                if(err) {
                    console.log("Error: Inserting new user");
                    if(err.name == "UserExistsError") {
                        req.flash('registerMessage', 'Registration Error: User Already Exists!');
                        console.log('Error: User Already Exists!')
                    }
                    return res.render('auth/register', {
                        title: "Register",
                        messages: req.flash('registerMessage'),
                        displayName: req.user ? req.user.displayName : ''
                    });
                } else {
                    // if no error exists, then  registration is successful
        
                    // redirect the user and authenticate
        
                    return passport.authenticate('local')(req, res, () => {
                        res.redirect('/survey-list');
                    })
                }
        
            })
        }
    })
}