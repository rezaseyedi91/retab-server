"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const test_1 = __importDefault(require("./routes/test"));
const cors_1 = __importDefault(require("cors"));
const VerovioToolkitInstance_1 = require("./rez-mei/VerovioToolkitInstance");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const body_parser_1 = __importDefault(require("body-parser"));
const https_1 = __importDefault(require("https"));
const fs_1 = require("fs");
dotenv.config();
const port = Number(process.env.PORT);
const app = (0, express_1.default)();
/**just to get rid of https crap */
const isDev = false; //process.env.MODE == 'development'
const localServer = 'http://localhost:' + port;
const swaggerDocs = (0, swagger_jsdoc_1.default)({
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
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            yield (0, VerovioToolkitInstance_1.initVerovio)();
        }
        catch (err) {
            console.log('err happened with verovio');
        }
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)({ credentials: true,
            //  origin: ['localhost:4000', process.env.TAB_CLIENT_URL!], allowedHeaders: [`Access-Control-Allow-Origin: '${process.env.TAB_CLIENT_URL!}'`] 
        }));
        app.use('/test', test_1.default);
        app.use('/', index_1.default);
        app.get('/', (req, res) => {
            res.send('hey');
        });
        if (isDev) {
            var key = (0, fs_1.readFileSync)(__dirname + '/cert/CA/selfsigned.key');
            var cert = (0, fs_1.readFileSync)(__dirname + '/cert/CA/selfsigned.crt');
            const server = https_1.default.createServer({
                key, cert,
            }, app);
            server.listen(Object.assign(Object.assign({}, process.env.MODE == 'development' ? { path: '192.168.43.69' } : {}), { port }), () => {
                console.log('we are listening on port ' + port + '...');
            });
        }
        else {
            app.listen(port, () => {
                console.log('we are listening on port ' + port + '...');
            });
        }
        // server.listen(port, '127.0.0.1' , () => {
        //         console.log('we are listening on port ' + port + '...')
        //     })
    }
    catch (mainErr) {
        console.log(mainErr);
    }
}))();
