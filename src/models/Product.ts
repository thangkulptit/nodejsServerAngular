import { Database } from '../database/connect';
import { Sequelize,DataTypes } from 'sequelize';
import {CategoryProduct} from './Categories';

export class Product{
    public Prod;
    public connectDB;
    constructor(){
        //khoi tao database
        this.connectDB = new Database().connection;
        this.Prod = this.DefineProduct();
        //this.Add();
        //tao TableProduct
        // this.CreateTableProduct();
    }

    public DefineProduct():void{
        
        const returnProduct = this.connectDB.define('products',{
            // pk_product_id: {
            //     type:DataTypes.INTEGER,
            //     primaryKey:true
            // },
            id_category:{
                type:DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type:DataTypes.STRING,
                allowNull: false
            },
            description: {
                type:DataTypes.STRING,
                allowNull: false
            },
            price: {
                type:DataTypes.FLOAT,
                allowNull: false
            },
            
        
        },{
            timestamps: false
        });
        //  this.Prod.hasMany(Cate.Category,{foreingKey: 'product_id',sourceKey:'pk_product_id'});
        //  Cate.Category.belongsTo(this.Prod,{foreingKey:'product_id',sourceKey:'pk_category_product_id'});

       return returnProduct;
        
        
    }
    private CreateTableProduct():void{
        this.Prod.sync({force:true}).then(()=>{
            return this.Prod.create({
                id_category: 1,
                name: "Vay",
                description: "Chiec vay  Mau Xanh",
                price: "150000"
            })
        })
    }
    
}





  


