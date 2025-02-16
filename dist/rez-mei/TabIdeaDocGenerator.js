"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../modules/interfaces");
const mei_tags_1 = require("../modules/mei-tags");
const Layer_1 = __importDefault(require("../modules/mei-tags/Layer"));
const Measure_1 = __importDefault(require("../modules/mei-tags/Measure"));
const Section_1 = __importDefault(require("../modules/mei-tags/Section"));
const Staff_1 = __importDefault(require("../modules/mei-tags/Staff"));
const TabGrp_1 = __importStar(require("../modules/mei-tags/TabGrp"));
const NoteTablature_1 = __importDefault(require("../modules/NoteTablature"));
const MeiDocGenerator_1 = require("./MeiDocGenerator");
class TabIdeaDocGenerator extends MeiDocGenerator_1.MeiDocGenerator {
    /**OLD WAY:*/
    // async generateXml(docId: number | undefined, jsonElem: TMeiJsonElemInput, options: TabIdeaDocGeneratorOptions, customHead?: TMeiJsonElemInput) {
    //     // const section = TabIdeaDocGenerator.jsonElemToSection(jsonElem);
    //     // const head = customHead ? MeiTag.makeTagsTree(customHead) : undefined;
    //     // if (options.tuning) this.setTuning(options.tuning);
    //     // NEW WAY:
    //     const retabDoc = (await RetabDoc.makeInstance(docId))!;
    //     retabDoc.initializeMeiMainTag()
    //     const section = TabIdeaDocGenerator.jsonElemToSection(jsonElem);
    //     retabDoc?.appendSection(section)
    //     const head = customHead ? MeiTag.makeTagsTree(customHead) : undefined;
    //     if (head) retabDoc?.appendHead(head)
    //     retabDoc?.setTuning(options.tuning);
    //     await retabDoc.save()
    //     const xml = this.setDoc(retabDoc);
    //     return xml
    // }
    static jsonElemToSection(jsonElem) {
        var _a;
        const childrenToMeiTags = ((_a = jsonElem.children) === null || _a === void 0 ? void 0 : _a.map(ch => this.meiTagInstanceFromJsonElem(ch))) || [];
        const section = new mei_tags_1.MeiTag({ tagTitle: 'section' });
        section.setAttribute(new interfaces_1.MeiAttribute('n', '1'));
        section.addChildren(...childrenToMeiTags);
        section.setChildrenAsSelfClosing('note');
        return section;
    }
    static meiTagInstanceFromJsonElem(jsonElem) {
        var _a, _b, _c, _d, _e, _f;
        let tag;
        switch (jsonElem.tagTitle) {
            case 'measure':
                tag = new Measure_1.default(Number(((_b = (_a = jsonElem.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.title == 'n')) === null || _b === void 0 ? void 0 : _b.value) || 1));
                break;
            case 'staff':
                tag = new Staff_1.default(Number(((_d = (_c = jsonElem.attributes) === null || _c === void 0 ? void 0 : _c.find(a => a.title == 'n')) === null || _d === void 0 ? void 0 : _d.value) || 1));
                break;
            case 'tabGrp':
                tag = new TabGrp_1.default();
                break;
            case 'note':
                tag = new NoteTablature_1.default(jsonElem);
                break;
            case 'score':
                tag = new Section_1.default();
                break;
            case 'layer':
                tag = new Layer_1.default();
                break;
            case 'tabDurSym':
                tag = new TabGrp_1.TabDurSym();
                break;
            default:
                tag = new mei_tags_1.MeiTagInstance({ tagTitle: jsonElem.tagTitle, attributes: jsonElem.attributes, }); //  Number(jsonElem.attributes?.find(a => a.title == 'n')?.value || 1))
                break;
        }
        (_e = jsonElem.attributes) === null || _e === void 0 ? void 0 : _e.forEach(t => tag.pushAttribute(t));
        (_f = jsonElem.children) === null || _f === void 0 ? void 0 : _f.forEach(ch => tag.pushChildren(this.meiTagInstanceFromJsonElem(ch)));
        return tag;
    }
    // setDoc(section: Section, head?: MeiTag) 
    setDoc(retabDoc) {
        // get or initialize <mei></mei>
        // get or initialize <head>
        // get or initialize <music>
        // put section in the proper place;
        var _a;
        this.xml = ((_a = retabDoc.mainChild) === null || _a === void 0 ? void 0 : _a.getXML()) || '';
        const pretty = MeiDocGenerator_1.MeiDocGenerator.prettifyXmlFile(this.xml);
        return pretty;
    }
}
exports.default = TabIdeaDocGenerator;
