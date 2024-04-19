const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./models/user.js')

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/realTaxi");
}

function initialize(passport){
    const authenticateUser = async (rollNo, password, done) => {
        const user = await User.findOne({rollNo: rollNo}) // Returns a user by rollNo or null if no such user exists
        if (user == null) // User not found
            return done(null, false, { message: 'No user with that rollNo' }) // done(errors, userFound, message)
        try { // Because we're using await, we use try catch
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch(err) {
            return done(err)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'rollNo'}, authenticateUser)) // The username field in our login form is rollNo basically
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async(id, done) => done(null, await User.findById(id)))
}

module.exports = initialize