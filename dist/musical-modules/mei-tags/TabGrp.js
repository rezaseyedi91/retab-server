"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabDurSym = void 0;
const _1 = require(".");
class TabGrp extends _1.MeiTag {
    constructor() {
        super(...arguments);
        this.tagTitle = 'tabGrp';
    }
}
exports.default = TabGrp;
class TabDurSym extends _1.MeiTag {
    constructor() {
        super(...arguments);
        this.tagTitle = 'tabDurSym';
        this.selfClosing = true;
    }
}
exports.TabDurSym = TabDurSym;
