import { CategoryProduct } from "../../models/Categories"
import { Transaction } from "sequelize/types";

export class CategoryProductController{
    public Category;
    private sequelize;
    
    constructor(){
        const category = new CategoryProduct();
        this.Category = category.Category;
        this.sequelize = category.connectDB;
    }
    public async addCategoryProduct(req, res, next) : Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const data:CategoryInterface = req.body;
                if (data.name != null) {
                    let newCateProduct = await this.Category.create({
                        name: data.name,
                    }, tran);
                    if (newCateProduct) {
                        return res.json({
                            message: 'Category created Success',
                            data: newCateProduct
                        });
                    }
                } else {
                    return res.json({
                        message: 'add faild data null',
                        data: {}
                    })
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
    public async getAllCategoryProducts(req, res, next) : Promise<Response> {
        
        try {
        let getAllCategory = await this.Category.findAll({
        });

        if (getAllCategory) {
          return res.json({
                message: ' Get All CategoryProduct Success',
                data: getAllCategory
            });
        } else {
            return res.json({
                message: 'CategoryProduct Null'
            })
        }
           
       } catch (error) {
           if(error){
            console.log(error);
             res.status(500).json({
                message: 'Something goes Wrong',
                data: {}
            });
           }
           
       }

    }
    public async getCategoryById(req, res, next) : Promise<Response> {
        
        const id = req.params.id;
        try {
            let getCategory = await  this.Category.findOne({
                where: {id} 
            });

            if (getCategory) {
            return res.json({
                    message: 'Get a Category Success',
                    data: getCategory
                });
            } else {
                return res.json({
                    message: 'Get data faild',
                    data: {}
                })
            }
           
       } catch (error) {
            if(error){
                
                console.log(error);
                res.status(500).json({
                    message: 'Something goes Wrong',
                    data: {}
                });
            }
       }

    }
    public async deleteCategoryById(req, res, next) : Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const id = req.params.id;
                let deleteCategory = await this.Category.destroy({
                    where: { id }
                }, tran)

                if (deleteCategory > 0) {
                    return res.json({
                            message: 'Category Delete Success',
                            total: deleteCategory,
                            id: id
                        });
                } else {
                    return res.status(404).json({
                        message: 'delete failed'
                    })
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
    public async updateCategoryById(req, res, next) : Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const id = req.params.id;
                const data:CategoryInterface = req.body;
                const products = await this.Category.findAll({
                    attributes: ['id', 'name'],
                    where: {
                        id
                    }
                })
                if (products.length > 0) {
                    products.forEach(async product => {
                        await product.update({
                            name: data.name,
                        }, tran)
                    });
                    return res.json({
                        message: 'Category update success',
                        data: products
                    })
                } else {
                    return res.json({
                        message: 'data null'
                    })
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
}