"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const interfaces_1 = require("../interfaces");
class Layer extends _1.MeiTag {
    // getXML(): string {
    //     this.setAttributes();
    //     return `<layer ${this.attributes.map(att => att.toString()).join(' ')} >
    //         ${this.wrapChildTags()}
    //     </layer>`
    // }
    setAttributes() {
        this.setAttribute(new interfaces_1.MeiAttribute('xml:id', this.xmlId));
        const nAtt = new interfaces_1.MeiAttribute('n', this.n.toString());
        if (!this.hasSameAttributeKeyValue(nAtt))
            this.setAttribute(nAtt);
    }
    initChildTags(someTags) {
        if (someTags)
            this.children.push(...someTags);
    }
    wrapChildTags() {
        return this.children.map(ch => ch.getXML()).join('\n');
    }
    constructor(n = 1) {
        super();
        this.tagTitle = 'layer';
        this.attributes = [];
        this.n = n;
    }
}
exports.default = Layer;
