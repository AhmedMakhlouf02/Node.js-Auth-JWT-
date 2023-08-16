const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, `Please enter an email`],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please , Enter a valid email']
    },
    password: {
        type: String,
        required: [true, `Please enter an password`],
        minlength: [6, `Minimum password length is 6 characters`]
    },
})

// fire a function after doc saved to db
// UserSchema.post('save',function(doc, next){
//     console.log(`New user was created & saved ${doc}`);
//     next()
// })

// fire a function before doc saved to db
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
});

// static method to login user
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if(user) {
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}


const User = mongoose.model('user', UserSchema);

module.exports = User;
