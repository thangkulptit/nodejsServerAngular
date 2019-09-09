import * as jwt from 'jsonwebtoken';

import { Users } from '../../models/User';
import { DataTypes } from 'sequelize';
import { Database } from '../../database/connect';
import { Transaction } from 'sequelize/types';
export class UserController{
    public User;
    public connectDB;
    private sequelize;
    constructor(){
        this.connectDB = new Database().connection;
        const user = new Users();
        this.User = user.User;
        this.sequelize = user.connectDB;
    }

    public async addUser(req,res,next):Promise<Response>{
        return res.json({mess: 'ok'});
    }

    public async registerUser(req, res, next): Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const data:ProductInterface = req.body;
                let newProduct = await this.User.create({
                    id_category: data.id_category,
                    name: data.name,
                    description: data.description,
                    price: data.price
                }, tran);
                if (newProduct) {
                    return res.json({
                        message: 'Product created Success',
                        data: newProduct
                    });
                }
                } catch (error) {
                    if(error) tran.rollback();
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

    public async loginJsonWebToken(req, res, next):Promise<Response>{
        const user = {
            username : 'admin',
            password : 'admin',
        }
        return jwt.sign({user: user}, 'secretKey', (err, token) => {
            return res.json({
                token: token
            })
        });
    }

    public async findUserById():Promise<any> {
        
    } 





     
}