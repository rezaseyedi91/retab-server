
import express from 'express';
import * as dotenv from 'dotenv'
import indexRouter from './routes/index'
import testRouter from './routes/test'
import cors from 'cors'
import { initVerovio } from './rez-mei/VerovioToolkitInstance';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser'

import https from 'https'
import { readFileSync } from 'fs';
dotenv.config();
const port = Number(process.env.PORT) as number
const app = express();
/**just to get rid of https crap */
const isDev = false//process.env.MODE == 'development'
const localServer = 'http://localhost:' + port
const swaggerDocs = swaggerJSDoc({
    definition: {
        info: {
            title: 'Solfege Back', version: '1.0'
        },
        servers: [{
            url: localServer,
        }]


    },
    apis: [
        './routes/*.js'
    ]
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


(async () => {
    try {

    
    try {
        await initVerovio();
    } catch (err) {
        console.log('err happened with verovio')
    }
    app.use(bodyParser.json())
    app.use(cors({ credentials: true,
        //  origin: ['localhost:4000', process.env.TAB_CLIENT_URL!], allowedHeaders: [`Access-Control-Allow-Origin: '${process.env.TAB_CLIENT_URL!}'`] 
        }))
    app.use('/test', testRouter)
    app.use('/', indexRouter)
    app.get('/', (req, res) => {
        res.send('hey')
    })

    if (isDev) {
        var key = readFileSync(__dirname + '/cert/CA/selfsigned.key');
        var cert = readFileSync(__dirname + '/cert/CA/selfsigned.crt');
        const server = https.createServer({
            key, cert,
    
        }, app);
        server.listen(
            {
                ... process.env.MODE == 'development' ? {path: '192.168.43.69'} : {},
                
                port
            }, () => {
                console.log('we are listening on port ' + port + '...')
            })
    } else {
        app.listen(port, () => {
            console.log('we are listening on port ' + port + '...')
        }) 

    }

  
    // server.listen(port, '127.0.0.1' , () => {
    //         console.log('we are listening on port ' + port + '...')
    //     })

    } catch(mainErr) {
        console.log(mainErr)
    }
})();