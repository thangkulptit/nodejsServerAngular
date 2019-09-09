import { Database } from '../database/connect';
import { Sequelize,DataTypes } from 'sequelize';

export class Users  {
    public User;
    public connectDB;
    constructor(){
        this.connectDB = new Database().connection;
        this.User = this.DefineUser();
        //Khoi tao bang Users
         //this.CreateTableUser();
    }

    private DefineUser():void  {
         const Users = this.connectDB.define('users',{
            
            id_google: {
                type:DataTypes.STRING(100)
            },
            fullname: {
                type:DataTypes.STRING(255)
            }
                   
        },{
            timestamps: false
        });
        return Users;
    }
    private CreateTableUser():void{
        this.User.sync({force:true}).then(()=>{
            return this.User.create({
                id_google: 123456,
                fullname: "Trần Văn Thắng",
                // c_username: "admin",
                // c_password: "admin"

            })
        })
    }


}




