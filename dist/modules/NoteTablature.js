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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccidedNotePname = exports.NotePname = void 0;
const interfaces_1 = require("./interfaces");
const mei_tags_1 = require("./mei-tags");
var NotePname;
(function (NotePname) {
    NotePname["c"] = "c";
    NotePname["d"] = "d";
    NotePname["e"] = "e";
    NotePname["f"] = "f";
    NotePname["g"] = "g";
    NotePname["a"] = "a";
    NotePname["b"] = "b";
})(NotePname || (exports.NotePname = NotePname = {}));
var AccidedNotePname;
(function (AccidedNotePname) {
    AccidedNotePname["c"] = "c";
    AccidedNotePname["cSharp"] = "c#";
    AccidedNotePname["cFlat"] = "cb";
    AccidedNotePname["d"] = "d";
    AccidedNotePname["dSharp"] = "d#";
    AccidedNotePname["dFlat"] = "db";
    AccidedNotePname["e"] = "e";
    AccidedNotePname["eSharp"] = "e#";
    AccidedNotePname["eFlat"] = "eb";
    AccidedNotePname["f"] = "f";
    AccidedNotePname["fSharp"] = "f#";
    AccidedNotePname["fFlat"] = "fb";
    AccidedNotePname["g"] = "g";
    AccidedNotePname["gSharp"] = "g#";
    AccidedNotePname["gFlat"] = "gb";
    AccidedNotePname["a"] = "a";
    AccidedNotePname["aSharp"] = "a#";
    AccidedNotePname["aFlat"] = "ab";
    AccidedNotePname["b"] = "b";
    AccidedNotePname["bSharp"] = "b#";
    AccidedNotePname["bFlat"] = "bb";
})(AccidedNotePname || (exports.AccidedNotePname = AccidedNotePname = {}));
class NoteTablature extends mei_tags_1.MeiTag {
    constructor(payload) {
        super(payload);
        this.tagTitle = 'note';
    }
    setAttributes() {
        this.attributes = this.attributes || [];
        this.setAttribute(new interfaces_1.MeiAttribute('xml:id', this.xmlId));
    }
    save(doc) {
        const _super = Object.create(null, {
            save: { get: () => super.save }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.save.call(this, doc);
            if (!this.attributes.find(at => at.title == 'tab.fret' && !isNaN(Number(at.value))))
                yield this.remove();
        });
    }
    static makeAccidedPnameAttributes(name) {
        const pname = name[0];
        const accid = !name[1] ? undefined : name[1] == '#' ? 's' : 'f';
        return [new interfaces_1.MeiAttribute('pname', pname), ...accid ? [new interfaces_1.MeiAttribute('accid', accid)] : []];
    }
}
exports.default = NoteTablature;
