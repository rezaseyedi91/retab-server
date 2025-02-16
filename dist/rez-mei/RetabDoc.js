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
const DB_1 = __importDefault(require("../modules/DB"));
const MeiMainTag_1 = __importDefault(require("../modules/mei-tags/MeiMainTag"));
const interfaces_1 = require("../modules/interfaces");
const StaffInfoContainer_1 = __importDefault(require("../modules/retab-modules/StaffInfoContainer"));
const User_1 = __importDefault(require("../modules/retab-modules/User"));
const TabIdeaDocGenerator_1 = __importDefault(require("./TabIdeaDocGenerator"));
class RetabDoc {
    constructor() {
        this.stavesInfo = [];
    }
    static makeInstance(id) {
        const instance = new RetabDoc();
        if (!id)
            return instance;
        else
            return this.getInstanceFromDb(id) || new RetabDoc();
    }
    initializeMeiMainTag() {
        // 
        this.mainChild = new MeiMainTag_1.default({});
    }
    appendHead(head) {
        var _a;
        // this.mainChild?.addOrReplaceChild(head);
        (_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.appendHead(head);
    }
    getStaffInfo(n = 1) {
        return this.stavesInfo.find(si => si.n) || this.stavesInfo[n - 1];
    }
    setTuning(coursesInfo, staffN = 1) {
        var _a;
        let sic = this.getStaffInfoContainer(staffN);
        if (sic)
            sic.setTuning(coursesInfo);
        else {
            sic = new StaffInfoContainer_1.default({
                linesCount: coursesInfo.length,
                notationType: StaffInfoContainer_1.default.DEFAULT_INFO.notationType,
                tuning: StaffInfoContainer_1.default.DEFAULT_TUNING,
            });
            this.stavesInfo.push(sic);
        }
        const staffDefMeiTag = (_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.getStaffDefMeiTag(staffN);
        sic.adjustStaffDef(staffDefMeiTag);
    }
    getStaffInfoContainer(n = 1) { return this.stavesInfo.find(sic => sic.n == n); }
    appendSection(section) {
        this.mainChild.appendSection(section);
    }
    static getInstanceFromDb(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield DB_1.default.getInstance().retabDoc.findUniqueOrThrow({
                    where: { id },
                    include: {
                        user: true,
                        mainChild: includeChildrenRecursively(),
                        stavesInfo: {
                            include: {
                                tuning: true
                            }
                        }
                    }
                });
                const instance = new RetabDoc();
                instance.setInfo(info);
                return instance;
            }
            catch (error) {
                console.log('Err: No Doc Record Found.');
            }
        });
    }
    getDataToEdit() {
        var _a, _b, _c, _d, _e, _f;
        return {
            id: this.id,
            title: this.title,
            filename: this.filename,
            createdAt: this.createdAt,
            instruments: this.stavesInfo.map(si => { var _a; return (_a = si.instrument) === null || _a === void 0 ? void 0 : _a.title; }) || [],
            tabType: (_b = (_a = this.stavesInfo) === null || _a === void 0 ? void 0 : _a.map((si) => si.notationType)) === null || _b === void 0 ? void 0 : _b[0],
            tuning: (_d = (_c = this.stavesInfo) === null || _c === void 0 ? void 0 : _c.map((si) => si.tuning)) === null || _d === void 0 ? void 0 : _d[0],
            sectionJsonElem: (_e = this.getSection()) === null || _e === void 0 ? void 0 : _e.toJsonElem(),
            headJsonElem: (_f = this.getHead()) === null || _f === void 0 ? void 0 : _f.toJsonElem(),
            stavesInfo: this.stavesInfo
        };
    }
    getSection() {
        var _a;
        return (_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.getSection();
    }
    getHead() {
        var _a;
        return (_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.getHead();
    }
    setInfo(info) {
        var _a;
        this.id = info.id;
        this.lastModifiedAt = new Date(info.lastModifiedAt);
        this.mainChild = new MeiMainTag_1.default(info.mainChild || undefined);
        this.mainChildId = info.mainChildId || undefined;
        this.stavesInfo = ((_a = info.stavesInfo) === null || _a === void 0 ? void 0 : _a.map(s => s instanceof StaffInfoContainer_1.default ? s : new StaffInfoContainer_1.default(s))) || [];
        this.title = info.title;
        this.user = info.user;
        this.createdAt = info.createdAt;
        this.filename = info.filename;
        this.userId = info.userId;
        return this;
    }
    getStaffDefMeiTag(n = 1) {
        var _a, _b;
        const score = (_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.getScoreMeiTag();
        const staffGrp = score === null || score === void 0 ? void 0 : score.__('staffGrp');
        const staffDef = (_b = staffGrp === null || staffGrp === void 0 ? void 0 : staffGrp.getChildrenByTagName('staffDef')) === null || _b === void 0 ? void 0 : _b.find(ch => ch.hasSameAttributeKeyValue(new interfaces_1.MeiAttribute('n', n)));
        return staffDef;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield User_1.default.getUser();
            const savedInfo = yield this.initializeFileInDb({
                userId: user.id,
                title: this.title,
                id: this.id,
            });
            this.id = savedInfo.id;
            yield this.saveStavesInfo();
            yield ((_a = this.mainChild) === null || _a === void 0 ? void 0 : _a.save(this));
        });
    }
    saveStavesInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('RetabDoc Must be savedFirst');
            const saveResults = yield Promise.all(this.stavesInfo.map(si => si.save(this.id)));
        });
    }
    generateFilename(title) { var _a; return `${title || 'unknownTitle'}-${(_a = this.user) === null || _a === void 0 ? void 0 : _a.name}-${Date.now()}.mei`; }
    initializeFileInDb(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield DB_1.default.getInstance().retabDoc.upsert({
                where: { id: this.id || 0 },
                create: {
                    title: payload.title || '',
                    user: { connect: { id: payload.userId } },
                    filename: this.generateFilename(payload.title || 'unknown-title'),
                },
                update: {
                    lastModifiedAt: new Date(),
                    title: payload.title || '',
                    filename: this.generateFilename(payload.title || 'unknown-title'),
                }
            });
            return saved;
        });
    }
    toMei() {
        return __awaiter(this, void 0, void 0, function* () {
            const docGenerator = new TabIdeaDocGenerator_1.default();
            return docGenerator.setDoc(this);
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('ID must be present');
            return yield DB_1.default.getInstance().retabDoc.delete({
                where: { id: this.id },
            });
        });
    }
}
exports.default = RetabDoc;
function includeChildrenRecursively(n = 1) {
    if (n >= 20)
        return {
            include: { children: { orderBy: { indexAmongSiblings: 'asc' } }, attributes: true }
        };
    else
        return {
            include: { children: Object.assign(Object.assign({}, includeChildrenRecursively(n + 1)), { orderBy: { indexAmongSiblings: 'asc' } }), attributes: true }
        };
}
