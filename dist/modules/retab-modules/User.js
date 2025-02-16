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
const DB_1 = __importDefault(require("../DB"));
class RetabUser {
    static getUser() {
        return __awaiter(this, arguments, void 0, function* (username = 'defaultUser') {
            const infoInDB = yield DB_1.default.getInstance().user.upsert({
                where: { username },
                create: { username, name: 'DefaultUser' },
                update: { username }
            });
            return new RetabUser().setInfo(infoInDB);
        });
    }
    setInfo(info) {
        this.name = info.name;
        this.email = info.email || undefined;
        this.username = info.username;
        this.id = info.id;
        return this;
    }
    getSavedDocsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.default.getInstance().retabDoc.findMany({
                where: { user: { id: this.id } },
                select: {
                    id: true,
                    title: true,
                    filename: true,
                    createdAt: true,
                    lastModifiedAt: true,
                }
            });
        });
    }
}
exports.default = RetabUser;
