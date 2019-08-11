const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');


// register page
router.get('/', (req, res) => res.render('register'));

//register post
router.post('/', (req, res) => {
    const { name, userName, password, password2 } = req.body;
    let errors = [];

    //check les champs requis
    if(!name || !userName || !password || !password2) {
        errors.push({ msg: 'please fill in all field'});
    }
    
    //check password
    if(password !== password2){
        errors.push({ msg: 'Password do not match' });
    }

    // check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0){
    res.render('register', {
        errors,
        name,
        userName,
        password,
        password2
    });
    }else{
        // Validation de l'enregistrement
        User.findOne({ userName: userName })
        .then(user => {
            if(user){
                //User exist
                errors.push({ msg: 'User is already register'});
                res.render('register', {
                errors,
                name,
                userName,
                password,
                password2
                });
            }else{
                const newUser = new User({
                    name,
                    userName,
                    password
                });
                
                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now register and can log in');
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
});


module.exports = router;