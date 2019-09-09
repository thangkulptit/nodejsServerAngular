import * as express from 'express'
import { FrontRoute } from './routing/front.routes'
import { AdminRoute } from './routing/admin.routes'
import { PortalRoute } from './routing/portal.routes'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { Authenticate } from './middleware/authenticate'
import { AuthRoutes }  from './routing/auth.routes'

var logger = require('morgan');
class App {
  public express
  public oauth: Authenticate

  constructor () {
    this.oauth = new Authenticate();
    this.express = express()
    this.middleware()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    
    const router = express.Router()    
    this.express.use('/', router);    
    // front router    
    this.express.use("/front", FrontRoute)
    // admin router
    this.express.use("/admin", AdminRoute)
    // portal router
    this.express.use("/portal", PortalRoute)

    this.express.use('/auth',AuthRoutes)
 
    // for test
    
    router.get('/', (req, res) => {
      
      res.json({
        message: '....Hello World!'
      })
    });
    router.post('/test', (req, res) => {
      res.json({
        message: 'what the heckkkkk',
        body: req.body
      })
    });
    
  }
  private middleware(): void { 
    this.express.set('view engine','ejs')
    this.express.use(express.static('public'));
    this.express.use(cookieParser());
    this.express.use(session({ secret: 'keyboard cat' }));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
        limit: '30mb',
        extended: true
    }));
    this.oauth.initialize(this.express);

    this.express.use(logger('dev'));
  }
}

export default new App().express
