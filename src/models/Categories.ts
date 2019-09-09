import { Database } from '../database/connect';
import { Sequelize,DataTypes } from 'sequelize';


export class CategoryProduct{
    public Category;
    public connectDB;
    constructor(){
        
        this.connectDB = new Database().connection;
        this.Category = this.DefineCategory();
        
        //Khoi tao bang CategoryProduct
         //this.CreateTableCategory();
    }

    private DefineCategory():void{
         const Category = this.connectDB.define('category_products',{
            // pk_category_product_id: {
            //     type:DataTypes.INTEGER,
            //     primaryKey:true
            // },
            name: {
                type:DataTypes.STRING
            },
            
            
        },{
            timestamps: false
        });
        return Category;
    }
    private CreateTableCategory():void{
        this.Category.sync({force:true}).then(()=>{
            return this.Category.create({
                name: "Quan",
               
            })
        })
    }


}




