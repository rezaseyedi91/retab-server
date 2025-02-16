"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const interfaces_1 = require("../interfaces");
const Staff_1 = __importDefault(require("./Staff"));
class Measure extends _1.MeiTag {
    initChildTags() {
        throw new Error("Method not implemented.");
    }
    setAttributes() {
        this.attributes = [];
        this.setAttribute(new interfaces_1.MeiAttribute('xml:id', this.xmlId));
        this.setAttribute(new interfaces_1.MeiAttribute('n', this.n.toString()));
    }
    addStaff() {
        const n = this.children.filter(ch => ch instanceof Staff_1.default).length + 1;
        this.children.push(new Staff_1.default(n).addLayer());
        return this;
    }
    constructor(n) {
        super();
        this.tagTitle = 'measure';
        this.attributes = [];
        this.n = n;
    }
}
exports.default = Measure;
