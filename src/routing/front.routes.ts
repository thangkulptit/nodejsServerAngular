import { Router } from "express";
import { ProductController } from "../controllers/front/Product-controller";
import { loggerWinston } from "../lib/logger";
import { AuthenticateController } from "../controllers/authenticate-controller";
import * as bodyParser from 'body-parser';
import { CategoryProduct } from '../models/Categories';
import { CategoryProductController } from '../controllers/front/CategoryProduct-controller';
import { UserController } from '../controllers/front/User-controller';
import { IgnoreUnauthorizedRegex } from '../util/function.util';
import { UserAngularController } from '../controllers/front/UserAngular-controller';
import * as passport from 'passport';
import { SendEmailController } from '../controllers/front/SendMail-controller';

const router = Router();

//middleware API Angular To Nodejs
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
    next();
});
// need to authorize every request 
router.use((req, res, next) => {
    const ignoreUnauthorizedRegex: string[] = ['^\/products\/[0-9]+$', '^\/categoryproducts\/[0-9]+$', '^\/reset\/[0-9a-z]{40}$'];
    const ignore: IgnoreUnauthorizedRegex = new IgnoreUnauthorizedRegex();
    //Xac thuc voi Regex Sau co' Authorize rồi phải thêm điểu kiện vào if req.isAuthentication()=true
    if (ignore.ignoreUnthorizedPathRequestManyId(req.path, ignoreUnauthorizedRegex)) {
       return next();
    }

    const ignoreUnauthorizedPath = ['/reset/1a9c84d89bfd057ef61143deb74b49e0c49ea4bb','/forgot','/products','/categoryproducts','/auth','/products/category','/users', '/register', '/login','/login/jwt','/profile'];
    if ((ignoreUnauthorizedPath.indexOf(req.path) === -1) && !req.isAuthenticated()) {
        loggerWinston.info("Authorize check first");
        var edata = {
            rcode: 401,
            msg: "Unauthorized",
            req: req.path
        };
        loggerWinston.error("Request is Unauthorized!");
        return res.send(edata);
    }
    next();
   
});

//Product
router.route('/products')
    .post( (req, res, next) => { //Thêm product
        let controller = new ProductController();
        controller.addProduct(req, res, next);
    })
    .get(passport.authenticate('jwt', {session: false}), (req, res, next) => { //get tất cả bản Product
        // let ctl = new AuthenticateController();
        // ctl.authenticateJWT(req, res, next); //authorization passport-jwt
         
        let controller = new ProductController();
        controller.getAllProducts(req, res, next);
    })

router.route('/forgot')
    .post((req, res, next) => {
        let controller = new  SendEmailController();
        controller.SendMail(req, res, next);
    })
router.route('/reset/:token')
    .post((req, res, next) => {
        let controller = new SendEmailController();
        controller.doResetPassword(req, res, next);
    })
router.route('/products/:id') 
    .get((req,res,next) => { //get 1 product dựa theo ID
        let controller = new ProductController();
        controller.getProductById(req, res, next);
    })
    .delete((req,res,next) => { //Xóa 1 product dựa theo Id
        let controller = new ProductController();
        controller.deleteProductById(req,res,next);
    })
    .put((req,res,next) => { //Update product dựa theo ID
        let controller = new ProductController();
        controller.updateProductById(req, res, next);
    })


//Catelory_product 
router.route("/categoryproducts")
    .post((req,res,next)=>{
        let controller = new CategoryProductController(); // Thêm danh mục
        controller.addCategoryProduct(req,res,next);
    })
    .get((req,res,next) => {
        let controller = new CategoryProductController(); // Get All danh mục
        controller.getAllCategoryProducts(req,res,next);
    })
router.route("/categoryproducts/:id")
    .delete((req,res,next) => {
        let controller = new CategoryProductController(); // Xóa danh mục dựa theo id
        controller.deleteCategoryById(req,res,next);
    })
    .put((req,res,next) => {
        let controller = new CategoryProductController(); //update danh mục dựa theo id
        controller.updateCategoryById(req,res,next);
    })
    .get((req,res,next) => {
        let controller = new CategoryProductController(); //Get danh mục dựa trên id
        controller.getCategoryById(req,res,next);
    })
router.get('/products/category', (req,res,next)=>{ //get Products dựa theo category
    let controller = new ProductController();
    controller.getListProductByCategory(req,res,next);
})


//Auth
router.post("/auth", (req, res, next) => {
    let controller = new AuthenticateController();
    controller.authenticate(req, res, next);
    
})


// router.get("/auth", (req, res, next) => {
//     // let controller = new AuthenticateController();
//     // controller.authenticate(req, res, next);
//     // res.render('/views/home')
//     res.send('Success');
// })
//User
router.get("/users", (req,res,next) => {
    let controller = new UserController();
    controller.addUser(req,res,next);
    
})

router.post("/register", (req, res, next) => {
    let controller = new UserAngularController();
    controller.addUserAngular(req, res, next);
})

router.post("/login", (req, res, next) => {
    let controller = new UserAngularController();
    controller.loginUserAngular(req, res, next);
})

router.get("/profile", (req, res, next) => {
    let controller = new UserAngularController();
    controller.getProfileUserAngular(req, res, next);
})

router.post("/login/jwt", (req, res, next) => {
    let controller = new UserController();
    controller.loginJsonWebToken(req, res, next);
})


export const FrontRoute: Router = router