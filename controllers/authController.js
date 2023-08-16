const User = require('../models/User');
const jwt = require('jsonwebtoken');


//  handle error
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // duplicate error code
    if(err.code === 11000) {
        errors.email = `THat's Email is already registered`;
        return errors
    }

    // incorrect email
    if(err.message === 'incorrect email'){
       errors.email = 'that email is not registered ' 
    }

    // incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is not registered ' 
     }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors
};

// create token
const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET ,{expiresIn: process.env.JWT_LIFETIME})
}

// GET
const signup_get = (req, res) => {
    res.render('signup')
};

// GET
const login_get = (req, res) => {
    res.render('login')
};

// POST
const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id)
        // Set the JWT token as a cookie
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3600000})
        res.status(201).json({user: user._id})
    } catch (error) {
        const errors =  handleErrors(error)
        res.status(400).json({ errors })
    }
}

// POST
const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        // Set the JWT token as a cookie
        res.cookie('jwt', token, {httpOnly: true, maxAge: 360000});

        res.status(200).json({user: user._id})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }

}

const logout_get =  (req,res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}



module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get,
}