const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const login_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            jwt_token: {
                type: String,
                required: true
            }
        }
    ]

});

//password encrytion

login_schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//generation JWT Token

login_schema.methods.generateAuthToken= async function () {
    try {
        let token_jwt = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ jwt_token: token_jwt });
        await this.save();
        return token_jwt;
    }
    catch (err) {
        console.log(err);
    }
}


const User = mongoose.model('users', login_schema);

module.exports = User;