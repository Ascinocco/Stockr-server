var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    firstName:  { type: String, required: true },
    lastName:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    token: {
        value: { type: String, default: "null" },
        valid: { type: Boolean, required: true, default: true }
    }, 
    stocks: { type: Array, default: [], required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// model middleware
// updates the password hash if the password has been modified
userSchema.pre('save', function(next) {
    var user = this;

    // check for updated user
    if (!user.isModified('password')) return next();

    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        //hash the pw with out new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // set hash
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.hashPassword = function (passwordToHash) {
    var user = this;

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) { 
            console.error("ERROR HASHING PASSWORD, COULD NOT GENERATE SALT");
            return false;
         }

        //hash the pw with out new salt
        bcrypt.hash(passwordToHash, salt, function(err, hash) {
            if (err) { 
                console.error("ERROR HASHING PASSWORD, COULD NOT HASH IT");
                return false;
            }
        
            return hash;
        });
    })
}

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.revokeToken = function() {
    var user = this;
    user.token.value = "null";
    user.token.valid = false;
}

userSchema.methods.addToken = function (token) {
    var user = this;
    user.token.value = token;
    user.token.valid = true;
}

userSchema.methods.deleteAccount = function(callback) {
    var user = this;
    User.findOneAndRemove({ _id: user._id }, callback)

}

// removes password field
// any time user data is sent to the client
// it should be sent as JSON
userSchema.methods.toJSON = function() {
    var user = this.toObject();
    delete user.password;
    delete user.token;
    delete user.created_at;
    delete user.updated_at;
    delete user._id;
    return user;
}

var User = mongoose.model('User', userSchema);

module.exports = User;