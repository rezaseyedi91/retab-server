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
const DB_1 = __importDefault(require("../../modules/DB"));
const router = (0, express_1.Router)();
const prisma = DB_1.default.getInstance();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.retabDoc.findFirst({
        where: { id: 1 },
        include: {
            mainChild: {
                include: {
                    children: includeChildrenRecursively(),
                    attributes: true
                }
            }
        }
    });
    res.json(result);
    // res.json(await prisma.retabDoc.deleteMany({
    //     where: {
    //         id: {in: [1,2,3,4,5,6,7,8]}
    //     }
    // }))
}));
function includeChildrenRecursively(n = 1) {
    if (n >= 20)
        return {
            include: { children: { orderBy: { indexAmongSiblings: 'asc' } }, attributes: true }
        };
    else
        return {
            include: { children: Object.assign(Object.assign({}, includeChildrenRecursively(n + 1)), { orderBy: { indexAmongSiblings: 'asc' } }), attributes: true }
        };
}
exports.default = router;
