import 'dotenv/config'

import passport from "passport"
import passportJWt from "passport-jwt"
import { db } from './db.js';

const {SECRET} = process.env;

passport.use(
    new passportJWt.Strategy({
        secretOrKey:SECRET,
        jwtFromRequest: passportJWt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
        async (payload, done) => {
            const user = db.one(`SELECT * FROM users WHERE id=$1`, payload.id)
            console.log(user);

            try {
                return user ? done(null, user) : done(new Error("User not found"))
            } catch (error) {
                done(error)
            }
        }    
    )
)