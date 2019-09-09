import {Sequelize,DataType} from 'sequelize';

export class Database{
    public connection;
    public transaction;
    constructor(){
        this.connection =this.connect();
        
    }

    public connect(){
        const conn = new Sequelize('project_nodejs','root','',{
            host: 'localhost',
            dialect: 'mysql',

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            
        });
        return conn;
    }
}

