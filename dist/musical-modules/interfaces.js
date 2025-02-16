"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeiAttribute = void 0;
class MeiAttribute {
    constructor(title, value) {
        this.title = title;
        this.value = value + "";
    }
    getConnectOrCreateQuery() {
        return {
            where: { id: this.id || 0 },
            create: { title: this.title, value: this.value }
        };
    }
    toString() {
        return ` ${this.title}="${this.value}" `;
    }
}
exports.MeiAttribute = MeiAttribute;
