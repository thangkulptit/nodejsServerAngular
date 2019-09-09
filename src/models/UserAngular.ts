import { Database } from '../database/connect';
import { Sequelize, DataTypes, DataType } from 'sequelize';

export class UsersAngular  {
    public UserAngular;
    public connectDB;
    constructor(){
        this.connectDB = new Database().connection;
        this.UserAngular = this.defineUserAngular();
        //Khoi tao bang Users
        //this.CreateTableUserAngular();
    }

    private defineUserAngular(): void  {
         const usersAngular = this.connectDB.define('users_angular',{
            
            username: {
                type:DataTypes.STRING(100),
                allowNull: false
            },
            password: {
                type:DataTypes.STRING(255),
                allowNull: false
            },
            fullname: {
                type:DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type:DataTypes.STRING(255),
                allowNull: false
            },
            resetPasswordToken: {
                type:DataTypes.STRING(30),
                allowNull: true
            },
            resetPasswordExpires: {
                type:DataTypes.DATE(),
                allowNull: true
            }
                   
        },{
            timestamps: true
        });
        return usersAngular;
    }
    private CreateTableUserAngular():void{
        this.UserAngular.sync({force:true}).then(()=>{
            return this.UserAngular.create({
                username: "admin",
                password: "admin",
                fullname: "Trần Văn Thắng",
                email: "thang2261997@gmail.com"
                // c_username: "admin",
                // c_password: "admin"

            })
        })
    }


}




