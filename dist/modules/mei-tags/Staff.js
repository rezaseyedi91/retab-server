"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const Layer_1 = __importDefault(require("./Layer"));
class Staff extends _1.MeiTag {
    constructor(n = 1) {
        super();
        this.tagTitle = 'staff';
        this.attributes = [];
        this.n = n;
    }
    setAttributes() {
        super.setAttributes();
    }
    addLayer() {
        this.children.push(new Layer_1.default(this.children.filter(ch => ch instanceof Layer_1.default).length + 1));
        return this;
    }
}
exports.default = Staff;
