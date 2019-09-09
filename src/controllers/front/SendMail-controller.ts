import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { UsersAngular } from '../../models/UserAngular';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export class SendEmailController {
    public User;
    private token: string;

    constructor() {
        this.User = new UsersAngular().UserAngular;
    }

    private async createToken(): Promise<any> {
        const token = crypto.randomBytes(20).toString('hex');
        return token;
    }

    private async addTokenAndGetUser(req, res, next): Promise<UserAngularInterface> {
        let findUser = await this.User.findOne({
            where: {
                username: req.body.username
            }
        })
        if (!findUser) {
            var data = {
                rcode: 500,
                message: 'user does not exists'
            }
            return res.json(data);
        }

        //neu email sai
        if (findUser.email !== req.body.email) {
            var data = {
                rcode: 500,
                message: 'email wrong'
            }
            return res.json(data);
        } 

        //create Token ;
       this.token = await this.createToken();
        //Save Token and Time Expires
        const resetPasswordToken = this.token;
        const resetPasswordExpires = Date.now() + 3600000; //1 hour
        //update
        let update = await this.User.update({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: resetPasswordExpires
        }, {
                where: {
                    username: req.body.username,
                    email: req.body.email
                }
            })

        if (update.length < 1) return res.send({ user: 'not exists' });

        let user = await this.User.findOne({
            where: {
                username: req.body.username,
                email: req.body.email
            }
        })

        return user;

    }
    
    public async doResetPassword(req, res, next): Promise<Response> {
        const token = req.params
        .token;
        let user = await this.User.findOne({
            where: {resetPasswordToken: token}
        })

        if ( !user ) {
            return res.json({status: 'user not exists!'});
        }
        
        if ( Date.now() > user.resetPasswordExpires ) {
            return res.json({status: 'expires'});
        }
        
        var hash = bcrypt.hashSync(req.body.password, saltRounds);
        if ( hash ) {
            let resultUpdate = await this.User.update(
                {
                    password: hash,
                }, 
                {
                    where: {resetPasswordToken: token}                
                }
            )

            if (resultUpdate) {
                return res.json({message: 'Doi Password Thanh Cong!'})
            }

        }
    }

    public async SendMail(req, res, next): Promise<Response> {
        try {
            const userResult = await this.addTokenAndGetUser(req, res, next);
            if ( userResult ) {
                let transporter = await nodemailer.createTransport({
                    service: 'gmail',
                    // host: process.env.MAIL_HOST,
                    // port: process.env.MAIL_PORT,
                    // secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.GMAIL_USER, // generated ethereal user
                        pass: process.env.GMAIL_PASS // generated ethereal password
                    }
                });
                let info = await transporter.sendMail({
                    to: req.body.email,
                    from: process.env.GMAIL_USER,
                    subject: 'Tìm lại mật khẩu!',
                    text: 'Yêu cầu lấy lại mật khẩu qua email\n\n' +
                        'Bạn vui lòng bấm đường link và làm theo hướng dẫn \n\n' +
                        // 'http://' + req.headers.host + '/reset/' + this.token + '\n\n' +
                        'http://' + 'localhost:4200' + '/reset/' + this.token + '\n\n' +
                        'Nếu bạn không click vào link và làm theo hướng dẫn thì password dữ nguyên.\n'
                });
                
                if ( info.messageId ) {
                    return res.json({message: 'send mail success'});
                }
            }
            } catch (error) {
                if ( error ) {
                    return res.send(error);
                }
            }
    }

   
}

