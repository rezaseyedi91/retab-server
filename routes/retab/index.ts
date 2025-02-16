import { Router } from "express";
import docRouter from './doc'
import DB from "../../modules/DB";
const router = Router(); 
router.use('/doc', docRouter)
router.get('/test', async (req, res) => {

    console.log('listen! see also /test/retab.')
    const meiMainTag = await DB.getInstance().meiTag.findFirst({
        where: {id: {equals: 690}},
        include: {children: true, parent: true},
    })
    res.json(meiMainTag)
})
export default router