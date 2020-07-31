const crypto = require('crypto');
const mongoose = require('mongoose'); // standard module for  MongoDB
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // Auth via JWT
const config = require("../../config");

//---------  User Schema  ------------------//

const userSchema = new mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: "username is required"
    },
    email: {
        type: String,
        required: 'e-mail is required',
        unique: 'this e-mail already exist'
    },
    passwordHash: String,
    salt: String,
    secretQuestion: {
        type: String,
        required: "secret question is required"
    },
    secretAnswer: {
        type: String,
        required: "secret answer is required"
    },
    gameIds: {
        type: [String]
    },
    location: {
        latitude: Number,
        longitude: Number,
    }
}, {
    timestamps: true
});

// encryption parts
userSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })

    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function (password) {
    const _is = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
    if (!password) return false;
    if (!this.passwordHash) return false;
    return _is;
};

const User = mongoose.model('User', userSchema);

//----------Passport Local Strategy--------------//

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false
    },
    function (username, password, done) {
        User.findOne({username}, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user){
                return done(err);
            }
            const checked = user.checkPassword(password);

            if (!checked) {
                return done(null, false, {message: 'User does not exist or wrong password.'});
            }
            return done(null, user);
        });
    }
    )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.jwtsecret
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
        User.findById(payload.id, (err, user) => {

            if (err) {
                return done(err)
            }
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    })
);

module.exports = {User, passport};
