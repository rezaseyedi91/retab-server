"use strict";
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
const express_1 = require("express");
const VerovioToolkitInstance_1 = require("./../../rez-mei/VerovioToolkitInstance");
const fs_1 = require("fs");
const retab_1 = __importDefault(require("./retab"));
const DB_1 = __importDefault(require("../../modules/DB"));
const router = (0, express_1.Router)();
router.get('/dbman', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = DB_1.default.getInstance();
    const result = yield prisma.tabCourseTuningInfo.upsert({
        where: {
            n_pname_oct: {
                n: 1,
                pname: 'g',
                oct: 4
            }
        },
        create: {
            n: 1,
            pname: 'g',
            oct: 4
        },
        update: {
            n: 1,
            pname: 'g',
            oct: 4
        }
    });
    return res.json(result);
}));
router.use('/retab', retab_1.default);
router.get('/render', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const filename = query.filename;
        if (!filename)
            return res.json({ msg: 'filename query must be provided' });
        const fileType = '.' + query.fileType || 'mei';
        const filepath = './mei-docs/' + filename + fileType;
        const str = (yield fs_1.promises.readFile(filepath, { encoding: 'utf-8' })).toString();
        if (!str)
            return res.json({ msg: filepath + ' not found.' });
        const verovioToolkit = yield (0, VerovioToolkitInstance_1.getInstance)();
        if (!verovioToolkit)
            return res.json({ msg: 'err.' });
        verovioToolkit.loadData(str);
        verovioToolkit.setOptions({
            adjustPageHeight: true
        });
        // return res.send(verovioToolkit.edit(
        //     {action: "keyDown", param: {elementId: 'n1ijob6t', key: 5, shiftKey: false, ctrlKey: true }}
        // ))
        const inf = verovioToolkit.edit({
            action: 'delete',
            param: {
                elementId: 'r.0.1.0.0_1'
            }
        });
        return res.send(verovioToolkit.renderToSVG(1));
        // const midi = verovioToolkit.renderToMIDI();
        // return res.send(midi)
    }
    catch (err) {
        res.send(err);
    }
}));
router.get('/verovio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verovioToolkit = yield (0, VerovioToolkitInstance_1.getInstance)();
    if (!verovioToolkit)
        return 'no';
    const str = (yield fs_1.promises.readFile('./mei-docs/sample.mei', { encoding: 'utf-8' })).toString();
    verovioToolkit.loadData(str);
    verovioToolkit.setOptions({
        adjustPageHeight: true
    });
    // verovioToolkit.setOptions({
    //     pageHeight: 500
    // })
    const outputData = verovioToolkit.renderToSVG(1);
    return res.send(outputData);
}));
exports.default = router;
