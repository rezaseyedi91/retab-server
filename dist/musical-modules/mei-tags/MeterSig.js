"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const interfaces_1 = require("../interfaces");
const Layer_1 = __importDefault(require("./Layer"));
const Staff_1 = __importDefault(require("./Staff"));
class MeterSig extends _1.MeiTag {
    initChildTags() {
        throw new Error("Method not implemented.");
    }
    getXML() {
        this.setAttributes();
        return `
        <meterSig count="${this.count}" unit="${this.unit}" >
            ${this.wrapChildTags()}
        </meterSig>
        
        `;
    }
    setAttributes() {
        this.attributes = [];
        this.setAttribute(new interfaces_1.MeiAttribute('xml:id', this.xmlId));
        this.setAttribute(new interfaces_1.MeiAttribute('count', this.count.toString()));
        this.setAttribute(new interfaces_1.MeiAttribute('unit', this.unit.toString()));
    }
    addStaff() {
        const n = this.children.filter(ch => ch instanceof Staff_1.default).length + 1;
        this.children.push(new Staff_1.default(n).addLayer());
        return this;
    }
    findChildLayer(staffIndex = 0, layerIndex = 0) {
        const staff = this.children.filter(i => i instanceof Staff_1.default)[staffIndex];
        const layer = staff.children.filter(i => i instanceof Layer_1.default)[layerIndex];
        return layer;
    }
    constructor(count, unit) {
        super();
        this.count = 4;
        this.unit = 4;
        this.attributes = [];
        this.tagTitle = 'meterSig';
        this.count = count;
        this.unit = unit;
    }
}
exports.default = MeterSig;
