import { Product } from '../../models/Product';
import { Transaction } from 'sequelize/types';

export class ProductController {
    private Prod;
    private sequelize;

    constructor() {
        // new CreateProduct();
        const product = new Product();
        this.Prod = product.Prod;
        this.sequelize = product.connectDB;
    }

    private validatorInputProduct(inputJson: JSON, ArrValidate: string[]): boolean {
        for (const keyJson in inputJson) {
            if (ArrValidate.indexOf(keyJson) === -1) {
                return false;
            }
        }
        return true;
    }

    public async addProduct(req, res, next): Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const data:ProductInterface = req.body;
                let newProduct = await this.Prod.create({
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
    public async getAllProducts(req, res, next): Promise<Response> {
        if(req.isAuthenticated()){
            console.log(req.user);
        }
        try {
            let getAllProduct = await this.Prod.findAll({});
            if (getAllProduct) {
                return res.json({
                    message: ' Get All Products Success',
                    data: getAllProduct
                });
            } else {
                return res.json({
                    message: 'total product null',
                    data: {}
                })
            }
        } catch (error) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Something goes Wrong',
                    data: {}
                });
            }
        }

    }
    public async getProductById(req, res, next): Promise<Response> {
        try {
            const id = req.params.id;
            let getProduct = await this.Prod.findOne({
                where: { id },
            });
            if (getProduct) {
                return res.json({
                    message: 'Get a Product Success',
                    data: getProduct
                });
            } else {
               return res.json({
                   message: 'faild product null',
                   data: {}
               }) 
            }

        } catch (error) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Something goes Wrong',
                    data: {}
                });
            }
        }

    }
    public async deleteProductById(req, res, next): Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            const id = req.params.id;
            try {
                let deleteProduct = await this.Prod.destroy({
                    where: { id }
                }, tran)

                if (deleteProduct > 0) {
                    return res.json({
                            message: 'Product Delete Success',
                            total: deleteProduct,
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
    public async updateProductById(req, res, next): Promise<Response> {
        return this.sequelize.transaction(async (tran: Transaction) => {
            try {
                const id = req.params.id;
                const data:ProductInterface = req.body;
                
                const products = await this.Prod.findAll({
                    attributes: ['id', 'id_category', 'name', 'description', 'price'],
                    where: {
                        id
                    }
                })
                if (products.length > 0) {
                    products.forEach(async product => {
                        await product.update({
                            id_category: data.id_category,
                            name: data.name,
                            description: data.description,
                            price: data.price
                        }, tran)
                    });
                    return res.json({
                        message: 'product update success',
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

    public async getListProductByCategory(req, res, next): Promise<Response> {
        try {
            const id = req.body.id;
            const getProductByCate = await this.Prod.findAll({
                where: {
                    id_category: id
                },
            })

            if (getProductByCate.length > 0) {
                return res.json({
                    message: 'success',
                    data: getProductByCate
                })
            } else {
                return res.json({
                    message: "faild",
                    data: {}
                })
            }
        } catch (error) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Something goes Wrong',
                    data: {}
                });
            }
        }
    }
}