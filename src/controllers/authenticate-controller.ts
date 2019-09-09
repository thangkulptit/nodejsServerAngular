import * as passport from 'passport'
import * as session from 'express-session';

export class AuthenticateController {
    constructor() {
    }    

    public async authenticate(req, res, next) {
        try {      
            passport.authenticate("local") 
            (
                req,
                res,
                function (err) {
                    if (err != null) {
                        let result = {
                            "rcode": 500,
                            "message": "some thing wrong!"
                        }

                        res.send(result)
                    }
                    const sed = {
                       
                        authorize:true
                    }
                    let result = {
                        "rcode": 200,
                        "message": "ok",
                        "sessionData": sed,
                    }

                    res.send(result);
                }
            );
            
        } catch (error) {
            res.send({
                "rcode": 500,
                "emsg": "Internal server error"
            })
        }
    }

    public async authenticateJWT(req, res, next) {
        try {      
            passport.authenticate('jwt', { session: false }) 
            (
                req,
                res,
                function (err) {
                    if (err != null) {
                        let result = {
                            "rcode": 500,
                            "message": "some thing wrong!"
                        }
                        res.send(result)
                    }
                    const sed = {
                        authorize:true
                    }
                    let result = {
                        "rcode": 200,
                        "message": "ok",
                        "sessionData": sed,
                    }

                    res.send(result)
                }
            );
            
        } catch (error) {
            res.send({
                "rcode": 500,
                "emsg": "Internal server error"
            })
        }
    }
}