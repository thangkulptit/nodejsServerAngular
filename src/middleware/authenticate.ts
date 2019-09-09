import * as express from 'express';
import * as passport from 'passport'
import { keys } from '../lib/keys';
import { UserController } from '../controllers/front/User-controller';
import * as session from 'express-session';
import * as cookieSession from 'cookie-session';
import { UsersAngular } from '../models/UserAngular';
import { UserAngularController } from '../controllers/front/UserAngular-controller';


export class Authenticate {
    constructor() {
    }

    JwtStrategy = require('passport-jwt').Strategy;
    ExtractJwt = require('passport-jwt').ExtractJwt;
    public initialize(express: express.Application) {

        express.use(passport.initialize());
        express.use(passport.session());
        const that = this;

        passport.use(new that.JwtStrategy({

            jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY

        }, function (jwtPayload, done) {
            process.nextTick(function () {
                that.authenticateLogic(jwtPayload, done)
            })
        }))

        passport.serializeUser(function (dret: any, done) {
            var sed: any
            const authorize = !!dret.authorize;
            sed = {
                authorize: authorize
            }
            done(null, sed)
        })

        passport.deserializeUser(function (user, done) {
            done(null, user)
        })
        

    }

    private async authenticateLogic(jwtPayload, done) {

        // let controller = new UserAngularController();
        // controller.findUserByIdAuth(jwtPayload.id, done);

        try {
            const User = new UsersAngular().UserAngular;
            let findUser = await User.findOne({
                where: {
                    id: jwtPayload.id
                }
            })
            const expirationDate = new Date(jwtPayload.exp * 1000);

            if ( findUser && expirationDate > new Date() ) {
                return done(null, findUser);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        } catch (error) {
            if(error) return done(error, false);
        }
        //    const expirationDate = new Date(jwtPayload.exp * 1000);
        //    if ( expirationDate < new Date() ) {
        //      return done(null, false);
        //    }
        // return done(null, jwtPayload);
    }

}