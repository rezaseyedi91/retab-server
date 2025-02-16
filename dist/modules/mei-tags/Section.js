"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const interfaces_1 = require("../interfaces");
const Measure_1 = __importDefault(require("./Measure"));
class Section extends _1.MeiTag {
    constructor() {
        super(...arguments);
        this.tagTitle = 'section';
        this.attributes = [];
    }
    initChildTags() {
        throw new Error("Method not implemented.");
    }
    getXML() {
        this.setAttributes();
        return `
        <section ${this.attributes.map(att => att.toString()).join(' ')} >
            ${this.wrapChildTags()}
        </section>
        
        `;
    }
    setAttributes() {
        this.attributes = !this.attributes.length ? [] : this.attributes;
        this.setAttribute(new interfaces_1.MeiAttribute('xml:id', this.xmlId));
    }
    addMeasure() {
        const n = this.children.filter(ch => ch instanceof Measure_1.default).length + 1;
        const newMeasure = new Measure_1.default(n).addStaff();
        this.children.push(newMeasure);
        return newMeasure;
    }
    getMeasure(index = 0) {
        if (index == 0)
            return this.children.find(ch => ch instanceof Measure_1.default);
        else
            return this.children.filter(ch => ch instanceof Measure_1.default)[index];
    }
}
exports.default = Section;
