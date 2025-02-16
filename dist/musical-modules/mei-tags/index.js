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
exports.MeiTagInstance = exports.MeiTag = void 0;
const DB_1 = __importDefault(require("../../modules/DB"));
const interfaces_1 = require("../interfaces");
class MeiTag {
    constructor(payload) {
        var _a, _b, _c, _d, _e, _f;
        this.tagTitle = "";
        this.selfClosing = false;
        this.indent = 0;
        this.attributes = [];
        this.children = [];
        const payloadXmlId = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.attributes) === null || _a === void 0 ? void 0 : _a.find(at => at.title == 'xml:id')) === null || _b === void 0 ? void 0 : _b.value;
        this.xmlId = payloadXmlId || this.generateId();
        this.tagTitle = (payload === null || payload === void 0 ? void 0 : payload.tagTitle) || this.tagTitle;
        if (payload && ((_c = Object.keys(payload)) === null || _c === void 0 ? void 0 : _c[0])) {
            // cleanup payload attributes:
            payload.attributes = (_d = payload.attributes) === null || _d === void 0 ? void 0 : _d.filter(a => a.value);
            for (const k in payload) {
                if (k == 'attributes') {
                    this.attributes = ((_e = payload.attributes) === null || _e === void 0 ? void 0 : _e.map(a => new interfaces_1.MeiAttribute(a.title || 'TITLE', a.value || 'VALUE'))) || [];
                }
                else {
                    Object.assign(this, ({ [k]: payload[k] }));
                }
            }
            if ((_f = payload.children) === null || _f === void 0 ? void 0 : _f.length) {
                this.children = payload.children.map(ch => ch instanceof MeiTag ? ch : new MeiTag(ch));
            }
        }
    }
    getChildrenTagTitlesTree() {
        return { [this.tagTitle]: this.children.map(ch => ch.getChildrenTagTitlesTree()) };
    }
    addChildIfNotExists(child, index) {
        const found = this.children.find(ch => ch.tagTitle == child.tagTitle);
        return found ? found instanceof MeiTag ? found : new MeiTag(found) : this.addChild(child, index);
    }
    addOrReplaceChild(...children) {
        for (const child of children) {
            const idx = this.children.indexOf(this.children.find(ch => ch.tagTitle == child.tagTitle));
            if (idx > -1) {
                this.children.splice(idx, 1);
            }
            this.addChild(child);
        }
    }
    addChildren(...children) {
        for (const ch of children)
            this.addChild(ch);
    }
    addChild(ch, index) {
        if (index != undefined)
            this.children.splice(index, 0, ch);
        else
            this.children.push(ch);
        ch.setIndent(this.getIndent() + 1);
        return ch;
    }
    setChildrenAsSelfClosing(tagTitle) {
        if (this.tagTitle == tagTitle)
            this.selfClosing = true;
        this.children.forEach(ch => ch.setChildrenAsSelfClosing(tagTitle));
        return this;
    }
    setAttribute(att) {
        const alreadySameTitleAtt = this.attributes.find(a => a.title == att.title);
        if (alreadySameTitleAtt)
            alreadySameTitleAtt.value = att.value;
        else
            this.attributes.push(att);
    }
    setIndent(i) {
        this.indent = i;
    }
    getIndent() { return this.indent; }
    generateId() {
        const lettersCount = 6;
        const characters = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ];
        let str = '';
        for (let i = 0; i < lettersCount; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomNumber = String(Math.floor(Math.random() * 10));
            str = str.concat(characters[randomIndex], randomNumber);
        }
        return str;
    }
    getAttributesTitles() {
        return this.attributes.map(a => a.title);
    }
    updatePrevSavedAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = DB_1.default.getInstance();
            const extrasIds = []; //alreadyHasThem.filter(a => !this.attributes.find(at => at.title == a.title)).map(({id})=> id);
            const tobeUpdated = [];
            const alreadyHasThem = yield prisma.meiAttribute.findMany({
                where: {
                    containerTag: {
                        id: this.id || 0
                    }
                }
            });
            alreadyHasThem.forEach(alreadyHasAtt => {
                const foundByTitle = this.attributes.find(at => at.title == alreadyHasAtt.title);
                if (!foundByTitle)
                    extrasIds.push(alreadyHasAtt.id);
                else {
                    if (foundByTitle.value != alreadyHasAtt.value) {
                        tobeUpdated.push(Object.assign(Object.assign({}, alreadyHasAtt), { value: foundByTitle.value }));
                    }
                    this.attributes.splice(this.attributes.indexOf(foundByTitle), 1);
                }
            });
            const result = yield prisma.$transaction([
                ...tobeUpdated.map(upAt => prisma.meiAttribute.update({
                    where: { id: upAt.id }, data: { value: upAt.value }
                })),
                ...!extrasIds.length ? [] : [prisma.meiAttribute.deleteMany({ where: { id: { in: extrasIds } } })],
                prisma.meiAttribute.createMany({
                    data: this.attributes.map(at => ({
                        containerTagId: this.id || 0,
                        title: at.title,
                        value: at.value
                    }))
                })
            ]);
            this.attributes = yield this.getSavedAttributes();
        });
    }
    getSavedAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield DB_1.default.getInstance().meiAttribute.findMany({
                where: { containerTagId: this.id || 0 },
            })).map(a => new interfaces_1.MeiAttribute(a.title, a.value || ''));
        });
    }
    getParentId() { var _a; return this.parentId || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.id); }
    save(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.setAttributes();
            const prisma = DB_1.default.getInstance();
            const saved = yield prisma.meiTag.upsert({
                where: {
                    id: this.id || 0
                },
                create: Object.assign(Object.assign(Object.assign(Object.assign({ xmlId: this.xmlId, selfClosing: this.selfClosing }, this.tagTitle == 'mei' ? { doc: { connect: { id: doc.id } } } : {}), { tagTitle: this.tagTitle, indexAmongSiblings: this.indexAmongSiblings || 0 }), this.getParentId() ? { parent: { connect: { id: ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.id) || this.parentId || 0 } } } : {}), this.textContent ? { textContent: this.textContent } : {}),
                update: Object.assign(Object.assign(Object.assign({ xmlId: this.xmlId, selfClosing: this.selfClosing }, this.tagTitle == 'mei' ? { doc: { connect: { id: doc.id } } } : {}), { tagTitle: this.tagTitle, indexAmongSiblings: this.indexAmongSiblings || 0 }), this.textContent ? { textContent: this.textContent } : {}),
                include: {
                    children: true
                }
            });
            this.id = saved.id;
            yield this.updatePrevSavedAttributes();
            //removing extra children
            yield prisma.meiTag.deleteMany({
                where: {
                    AND: [
                        { parentId: this.id },
                        { id: { notIn: this.children.map(ch => ch.id).filter(id => id) } }
                    ]
                }
            });
            this.setChildrenParentId();
            yield Promise.all(this.children.map(ch => ch.save(doc)));
        });
    }
    // abstract getXML(): string 
    setAttributes() {
        return;
    }
    setChildrenParentId() {
        if (!this.id)
            throw new Error('WE HAVE NO ID HERE!');
        this.children.forEach((ch, index) => {
            ch.parentId = this.id;
            ch.indexAmongSiblings = ch.indexAmongSiblings || index;
            ch.parent = this;
        });
    }
    hasSameAttributeKeyValue(att) {
        return this.attributes.find(a => a.title == att.title && a.value == att.value);
    }
    // hasAttributeWithValue(cb:  (value: IMeiAttribute, index: number, obj: IMeiAttribute[]) => unknown) {
    //     return this.attributes.find(cb)
    // }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.default.getInstance().meiTag.delete({ where: { id: this.id } });
        });
    }
    getChildrenByTagName(tagname) {
        return this.children.filter(ch => ch.tagTitle == tagname)
            .map(ch => ch instanceof MeiTag ? ch : new MeiTag(ch));
    }
    getChildByTagName(tagname) {
        const ch = this.children.find(ch => ch.tagTitle == tagname);
        return !ch ? undefined : (ch instanceof MeiTag) ? ch : new MeiTag(ch);
    }
    /**getChildByTagName */
    __(tagname) {
        return this.getChildByTagName(tagname);
    }
    toJsonElem() {
        return Object.assign({ attributes: this.attributes, children: this.children.map(ch => ch.toJsonElem()), tagTitle: this.tagTitle, selfClosing: this.selfClosing }, this.textContent ? { textContent: this.textContent } : {});
    }
    setTextContent(str) {
        this.textContent = str;
    }
    initChildTags() {
        this.setChildrenParentId();
        throw new Error("Method not implemented.");
    }
    wrapChildTags() {
        return this.children.map(ch => ch.getXML()).join('\n');
    }
    pushChildren(...children) {
        children.forEach(ch => this.children.push(ch));
        [...children].forEach(i => i.setIndent(this.getIndent() + 1));
    }
    getXML() {
        this.setAttributes();
        return '<' + this.tagTitle + ` ${this.getAttributesJoint()} ` +
            (this.selfClosing ? "/>" : ('>' + '\n' + (this.textContent || '') + this.wrapChildTags() + '\n' + '</' + this.tagTitle + '>'));
    }
    static makeTagsTree(args) {
        // const constructor = args.tagTitle == 'note' ? Note : MeiTagInstance;
        const newTag = new MeiTagInstance(args);
        newTag.selfClosing = args.selfClosing || false;
        if (args.textContent)
            newTag.textContent = args.textContent;
        return newTag;
    }
    getAttributesJoint() {
        return this.attributes.map(att => att.toString()).join(' ');
    }
    pushAttribute(att) {
        if (!this.hasSameAttributeKeyValue(att)) {
            this.attributes.push(new interfaces_1.MeiAttribute(att.title, att.value || ""));
        }
    }
}
exports.MeiTag = MeiTag;
class MeiTagInstance extends MeiTag {
    // tagTitle: string;
    constructor(args) {
        var _a, _b;
        super(args);
        // this.tagTitle = args.tagTitle
        this.textContent = args.textContent;
        this.selfClosing = args.selfClosing || false;
        (_a = args.attributes) === null || _a === void 0 ? void 0 : _a.forEach(att => this.setAttribute(new interfaces_1.MeiAttribute(att.title, att.value || "")));
        this.children = ((_b = args.children) === null || _b === void 0 ? void 0 : _b.map(ch => ch instanceof MeiTag ? ch : new MeiTagInstance(ch))) || [];
    }
    setAttributes() { return; }
    updateChildren() {
        return this;
    }
}
exports.MeiTagInstance = MeiTagInstance;
