import { Router } from "express";
import * as passport from 'passport';
import { Authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/',(req,res,next)=>{

    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    }else{
        const data = req.user;
         res.render('admin',{data : req.user});
        
    }
    
})

export const AdminRoute: Router = router