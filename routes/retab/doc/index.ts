import { Router } from "express";
import RetabDoc from "../../../rez-mei/RetabDoc";
import TabIdeaDocGenerator from "../../../rez-mei/TabIdeaDocGenerator";
import RetabUser from "../../../modules/retab-modules/User";
import { MeiTag } from "../../../modules/mei-tags";
import { TStaffInfo } from "../../../modules/db-types";
import StaffInfoContainer from "../../../modules/retab-modules/StaffInfoContainer";
const router = Router();

router.get('/get-all-saved', async (req, res) => {
    const user = await RetabUser.getUser();
    const list = await user.getSavedDocsList();
    return res.json(list)
})
router.get('/:id', async (req, res) => {
    const docId = Number(req.params.id || 0)
    const retabDoc = await RetabDoc.getInstanceFromDb(docId);
    
    if (req.query.fileType == 'mei') {
        
        return res.send(await retabDoc?.toMei())
    }
     else return res.json(retabDoc?.getDataToEdit())
})
router.delete('/:id', async (req, res) => {
    const docId = Number(req.params.id || 0)
    const doc = new RetabDoc().setInfo({id: docId});
    const result = await doc.remove();
    return res.send(result)
})
 /**save doc */
 router.post('/:id', async (req, res) => {
    const retabDoc = new RetabDoc();
    const user = await RetabUser.getUser()
    const docInfo = req.body.docInfo
    retabDoc.setInfo({
        id: req.params.id == 'new' ? undefined : Number(req.params.id || 0) || undefined, 
        filename: docInfo.filename, 
        title: docInfo.title,
        user: user,
    })
    
    retabDoc.initializeMeiMainTag()
    const section = TabIdeaDocGenerator.jsonElemToSection( req.body.sectionJsonElem);
    retabDoc?.appendSection(section)
    const head = req.body.headJsonElem ? MeiTag.makeTagsTree(req.body.headJsonElem) : undefined;
    if (head) retabDoc?.appendHead(head)
    retabDoc.stavesInfo = docInfo.stavesInfo.map((si: TStaffInfo) => new StaffInfoContainer(si))
    retabDoc.setTuning(retabDoc.stavesInfo[0].tuning)
    await retabDoc.save();
    return res.json({id: retabDoc.id})
 })
export default router