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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../../modules/DB"));
const interfaces_1 = require("../interfaces");
const mei_tags_1 = require("../mei-tags");
const NoteTablature_1 = __importDefault(require("../NoteTablature"));
class StaffInfoContainer {
    constructor(info) {
        this.n = info.n || _a.DEFAULT_INFO.n;
        this.linesCount = info.linesCount || _a.DEFAULT_INFO.linesCount;
        this.notationType = info.notationType || _a.DEFAULT_INFO.notationType;
        this.tuning = info.tuning || _a.DEFAULT_TUNING;
    }
    setTuning(coursesInfo) {
        this.tuning = coursesInfo.sort((a, b) => a.n - b.n);
    }
    adjustStaffDef(el) {
        const CONSTANT_LINES_COUNT = 6;
        el.setAttribute(new interfaces_1.MeiAttribute('n', this.n));
        el.setAttribute(new interfaces_1.MeiAttribute('lines', CONSTANT_LINES_COUNT)); //this.linesCount!
        el.setAttribute(new interfaces_1.MeiAttribute('notationtype', this.notationType));
        const tuningTag = el.addChildIfNotExists(new mei_tags_1.MeiTag({
            tagTitle: 'tuning'
        }));
        tuningTag.children = [];
        tuningTag.addChildren(...this.tuning.map(c => {
            const pnameAccidAttributes = NoteTablature_1.default.makeAccidedPnameAttributes(c.pname); //            { title: 'pname', value: c.pname },
            return new mei_tags_1.MeiTag({
                tagTitle: 'course', attributes: [
                    { title: 'n', value: c.n + '' },
                    { title: 'oct', value: c.oct + '' },
                    ...pnameAccidAttributes
                ],
                selfClosing: true
            });
        }));
    }
    save(docId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield DB_1.default.getInstance().staffInfo.findUnique({
                where: {
                    docId_n: { docId: docId || 0, n: this.n || 1 }
                },
                select: { id: true }
            });
            if (exists) {
                yield DB_1.default.getInstance().staffInfo.update({
                    where: { id: exists.id },
                    data: {
                        tuning: { set: [] }
                    }
                });
            }
            const saved = yield DB_1.default.getInstance().staffInfo.upsert({
                where: (exists === null || exists === void 0 ? void 0 : exists.id) ? { id: exists.id } : { docId_n: { docId: docId || 0, n: this.n || 1 } },
                create: {
                    n: this.n, notationType: this.notationType,
                    doc: {
                        connect: { id: docId || 0 },
                    },
                    instrument: { connectOrCreate: { where: { title: 'Lute' }, create: { title: 'Lute' } } },
                    tuning: {
                        connectOrCreate: this.tuning.map(t => ({
                            where: {
                                n_pname_oct: {
                                    n: t.n, pname: t.pname, oct: t.oct
                                }
                            },
                            create: {
                                n: t.n, pname: t.pname, oct: t.oct
                            },
                        }))
                    }
                },
                update: {
                    n: this.n, notationType: this.notationType,
                    doc: {
                        connect: { id: docId || 0 }
                    },
                    tuning: {
                        connectOrCreate: this.tuning.map(t => ({ where: { n_pname_oct: t }, create: t })),
                    }
                },
                select: {
                    id: true, tuning: { select: { id: true } }
                }
            });
            return saved;
        });
    }
}
_a = StaffInfoContainer;
StaffInfoContainer.DEFAULT_TUNING = [
    { n: 1, pname: "g", oct: 4 },
    { n: 2, pname: "d", oct: 4 },
    { n: 3, pname: "a", oct: 3 },
    { n: 4, pname: "f", oct: 3 },
    { n: 5, pname: "c", oct: 3 },
    { n: 6, pname: "g", oct: 2 },
];
StaffInfoContainer.DEFAULT_INFO = {
    linesCount: 6,
    notationType: 'tab.lute.italian',
    tuning: _a.DEFAULT_TUNING,
    n: 1
};
exports.default = StaffInfoContainer;
