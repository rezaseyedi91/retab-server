"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const interfaces_1 = require("../interfaces");
class MeiMainTag extends _1.MeiTag {
    constructor(payload) {
        super(Object.assign(Object.assign({}, payload), { tagTitle: MeiMainTag.TAG_TITLE }));
    }
    setAttributes() {
        this.attributes.push(new interfaces_1.MeiAttribute('xmlns', MeiMainTag.XMLNS), new interfaces_1.MeiAttribute('meiversion', MeiMainTag.MEI_VERSION), new interfaces_1.MeiAttribute('xml:id', this.xmlId));
    }
    appendHead(head) {
        if (this.__('head')) {
            throw new Error('already has the head');
        }
        this.addChild(head, 0);
    }
    appendSection(section) {
        this.getScoreMeiTag().addOrReplaceChild(section);
    }
    getSection() {
        return this.getScoreMeiTag().__('section');
    }
    getHead() {
        return this.__('meiHead');
    }
    getScoreMeiTag() {
        var _a, _b, _c;
        if ((_c = (_b = (_a = this.__('music')) === null || _a === void 0 ? void 0 : _a.__('body')) === null || _b === void 0 ? void 0 : _b.__('mdiv')) === null || _c === void 0 ? void 0 : _c.__('score'))
            return this.__('music').__('body').__('mdiv').__('score');
        this.addChildIfNotExists(new _1.MeiTag({ tagTitle: 'music' }));
        this.__('music').addChildIfNotExists(new _1.MeiTag({ tagTitle: 'body' }));
        this.__('music').__('body').addChildIfNotExists(new _1.MeiTag({ tagTitle: 'mdiv' }));
        return this.__('music').__('body').__('mdiv').addChildIfNotExists(new _1.MeiTag({ tagTitle: 'score' }));
    }
    getStaffDefMeiTag(staffN = 1) {
        const scoreDef = this.getScoreMeiTag().addChildIfNotExists(new _1.MeiTag({ tagTitle: 'scoreDef' }), 0);
        const staffGrp = scoreDef.addChildIfNotExists(new _1.MeiTag({ tagTitle: 'staffGrp' }));
        const alreadyThere = staffGrp.children.find((ch) => ch.tagTitle == 'staffDef' && ch.hasSameAttributeKeyValue({ title: 'n', value: staffN + '' }));
        return alreadyThere || staffGrp.addChild(new _1.MeiTag({
            tagTitle: 'staffDef'
        }));
    }
}
MeiMainTag.XMLNS = 'http://www.music-encoding.org/ns/mei';
// static MEI_VERSION = '5.1-dev'
MeiMainTag.MEI_VERSION = '5.1';
MeiMainTag.TAG_TITLE = 'mei';
exports.default = MeiMainTag;
