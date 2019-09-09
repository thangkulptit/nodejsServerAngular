import { Database } from '../../database/connect';
import { Transaction } from 'sequelize/types';
import { UsersAngular } from '../../models/UserAngular';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const saltRounds = 10;

export class UserAngularController {
    public UserAngular;
    public connectDB;
    private sequelize;
    constructor() {
        this.connectDB = new Database().connection;
        const userAngular = new UsersAngular();
        this.UserAngular = userAngular.UserAngular;
        this.sequelize = userAngular.connectDB;
    }

    public async addUserAngular(req, res, next): Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const data: UserAngularInterface = req.body;
                //Check username exist !
                let checkUser = await this.UserAngular.findOne({
                    where: {
                        username: data.username
                    }
                })
                if (checkUser) {
                    return res.json({
                        message: 'user already exists',
                        status: '0'
                    })
                } else {
                    //Ma hoa password
                    var hash = bcrypt.hashSync(data.password, saltRounds);
                    //insert to database
                    if (hash) {
                        let newUser = await this.UserAngular.create({
                            username: data.username,
                            password: hash,
                            fullname: data.fullname,
                            email: data.email
                        }, tran);
                        if (newUser) {
                            let token = jwt.sign(newUser.toJSON(), process.env.SECRET_KEY, {
                                expiresIn: 604800 //1 week
                            });
                            return res.json({
                                message: 'register user success',
                                status: '1',
                                token: token
                            });
                        }
                    }
                }

            } catch (error) {
                if (error) tran.rollback();

                return res.status(500).json({
                    message: 'Something goes Wrong',
                    data: {}
                });

            }
        }).catch(function (err) {
            let edata = {
                rcode: 500,
            }
            return res.send(edata);
        })

    }

    public async loginUserAngular(req, res, next): Promise<Response> {
        try {
            const data: UserAngularInterface = req.body;
            //Kiểm tra xem username có tồn tại không
            let resultUser = await this.UserAngular.findOne({
                where: {
                    username: data.username
                }
            })
            if (resultUser) {
                const currentPassword = data.password;
                const hashPassword = resultUser.password;

                const payloadJSON = {
                    id: resultUser.id,
                    username: resultUser.username,
                    fullname: resultUser.fullname,
                    email: resultUser.email,
                }

                var comparePassword: boolean = bcrypt.compareSync(currentPassword, hashPassword);
                if (comparePassword) {

                    //Tạo token
                    let token = jwt.sign(payloadJSON, process.env.SECRET_KEY, {
                        expiresIn: 604800 //1 week
                    });
                    return res.json({
                        message: 'login success',
                        status: '1',
                        token: token
                    })
                } else {
                    return res.json({
                        message: 'password wrong',
                        status: '0'
                    })
                }
            } else {
                return res.json({
                    message: 'user not exist',
                    status: '0'
                })
            }

        } catch (error) {
            console.log(error);
            if (error) return res.status(500).json({
                message: 'Something goes Wrong',
                data: {}
            });
        }
    }

    public async getProfileUserAngular(req, res, next): Promise<Response> {
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
        let findUserById = await this.UserAngular.findOne({
            where: {
                id: decoded.id
            }
        })

        if (findUserById) {
            return res.json(findUserById);
        } else {
            return res.send('Json does not exist');
        }
    }

    public async findUserByIdAuth(jwtPayload, done): Promise<any> {
        try {
            let user = await this.UserAngular.findOne({
                where: {
                    id: jwtPayload.id
                }
            })
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            if(error) return done(error, false);
        }


    }
}