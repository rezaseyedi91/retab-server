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
const doc_1 = __importDefault(require("./doc"));
const DB_1 = __importDefault(require("../../modules/DB"));
const router = (0, express_1.Router)();
router.use('/doc', doc_1.default);
router.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('listen! see also /test/retab.');
    const meiMainTag = yield DB_1.default.getInstance().meiTag.findFirst({
        where: { id: { equals: 690 } },
        include: { children: true, parent: true },
    });
    res.json(meiMainTag);
}));
exports.default = router;
