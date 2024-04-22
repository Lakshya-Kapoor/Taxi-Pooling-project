const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByRollNo, getUserById){
    const authenticateUser = async (rollNo, password, done) => {
        const user = await getUserByRollNo(rollNo)
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
    passport.deserializeUser(async(id, done) => done(null, await getUserById(id)))
}

module.exports = initialize