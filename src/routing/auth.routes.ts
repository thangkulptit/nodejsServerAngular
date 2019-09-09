import { Router } from 'express';
import * as passport from 'passport';
import { keys } from '../lib/keys';
import { Authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/home',(req,res) => {
   // res.send('true');
     res.render('home');
})

router.post("/api/login", (req, res, next) => {
   
}) 

router.get('/login',(req,res) => {
    if (req.isAuthenticated()) {
     //  console.log("trang này đã authen e can render 1 trang nào do khac");
      res.redirect('/admin');  
    }else
    res.render('login');

})
router.get('/logout',(req,res,next)=>{
  req.logout();
  res.redirect('/auth/home');
})
//router oauth google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile'],
  }));

  //request Callback
 router.get('/google/callback', 
   passport.authenticate('google',{ failureRedirect:'/auth/login', successRedirect: '/admin'}
     
   )
)
  






export const AuthRoutes : Router = router;