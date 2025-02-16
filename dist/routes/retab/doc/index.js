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
const express_1 = require("express");
const RetabDoc_1 = __importDefault(require("../../../rez-mei/RetabDoc"));
const TabIdeaDocGenerator_1 = __importDefault(require("../../../rez-mei/TabIdeaDocGenerator"));
const User_1 = __importDefault(require("../../../modules/retab-modules/User"));
const mei_tags_1 = require("../../../modules/mei-tags");
const StaffInfoContainer_1 = __importDefault(require("../../../modules/retab-modules/StaffInfoContainer"));
const router = (0, express_1.Router)();
router.get('/get-all-saved', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.getUser();
    const list = yield user.getSavedDocsList();
    return res.json(list);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docId = Number(req.params.id || 0);
    const retabDoc = yield RetabDoc_1.default.getInstanceFromDb(docId);
    if (req.query.fileType == 'mei') {
        return res.send(yield (retabDoc === null || retabDoc === void 0 ? void 0 : retabDoc.toMei()));
    }
    else
        return res.json(retabDoc === null || retabDoc === void 0 ? void 0 : retabDoc.getDataToEdit());
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docId = Number(req.params.id || 0);
    const doc = new RetabDoc_1.default().setInfo({ id: docId });
    const result = yield doc.remove();
    return res.send(result);
}));
/**save doc */
router.post('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const retabDoc = new RetabDoc_1.default();
    const user = yield User_1.default.getUser();
    const docInfo = req.body.docInfo;
    retabDoc.setInfo({
        id: req.params.id == 'new' ? undefined : Number(req.params.id || 0) || undefined,
        filename: docInfo.filename,
        title: docInfo.title,
        user: user,
    });
    retabDoc.initializeMeiMainTag();
    const section = TabIdeaDocGenerator_1.default.jsonElemToSection(req.body.sectionJsonElem);
    retabDoc === null || retabDoc === void 0 ? void 0 : retabDoc.appendSection(section);
    const head = req.body.headJsonElem ? mei_tags_1.MeiTag.makeTagsTree(req.body.headJsonElem) : undefined;
    if (head)
        retabDoc === null || retabDoc === void 0 ? void 0 : retabDoc.appendHead(head);
    retabDoc.stavesInfo = docInfo.stavesInfo.map((si) => new StaffInfoContainer_1.default(si));
    retabDoc.setTuning(retabDoc.stavesInfo[0].tuning);
    yield retabDoc.save();
    return res.json({ id: retabDoc.id });
}));
exports.default = router;
