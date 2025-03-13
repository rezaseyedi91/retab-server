import { Router } from "express";

import { getInstance as getVerovioToolkitInstance } from './../../rez-mei/VerovioToolkitInstance'
import { promises, readFile } from "fs";
import retabTestRouter from './retab'
import getMidiRouter from './get-midi'
import DB from "../../modules/DB";
import { PrismaClient } from "@prisma/client";
const router = Router();

router.get('/dbman', async (req, res) => {
    return res.send('just nothing')
    const prisma = new PrismaClient({
        log: [
            {emit: 'event', 'level': 'query'}
        ]
    })// DB.getInstance();
    prisma.$on('query', (e) => {
        console.log(e);
      });
    const result  = await prisma.staffInfo.findMany({
        select: {
            tuning:  true
        }
    })

    console.log(result.length)
    const set = new Set();
    result.forEach((t) => set.add( JSON.stringify(t)))
    const arr = Array.from(set).map(i => JSON.parse(i as string))
    // console.log(arr)

    return res.json(arr)
})
router.use('/retab', retabTestRouter)

router.use('/get-midi', getMidiRouter)
 

router.get('/render', async (req, res) => {
    try {

 
        const query = req.query;
        const filename = query.filename;
        if (!filename) return res.json({msg: 'filename query must be provided'});
        const fileType = '.' + query.fileType || 'mei'
        const filepath = './mei-docs/' + filename + fileType
        const str = (await promises.readFile(filepath, {encoding: 'utf-8'})).toString();
        if (!str) return res.json({msg: filepath + ' not found.'});
        const verovioToolkit = await getVerovioToolkitInstance();
        if (!verovioToolkit) return res.json({msg:  'err.'});
        verovioToolkit.loadData(str);
        verovioToolkit.setOptions({
            adjustPageHeight: true
        });

        // return res.send(verovioToolkit.edit(
        //     {action: "keyDown", param: {elementId: 'n1ijob6t', key: 5, shiftKey: false, ctrlKey: true }}
        // ))
        const inf = verovioToolkit.edit({
            action: 'delete',
            param: {
                elementId: 'r.0.1.0.0_1'
            }
        });
        
        return res.send(verovioToolkit.renderToSVG(1))
        // const midi = verovioToolkit.renderToMIDI();
        
        // return res.send(midi)
    } catch(err) {
        res.send(err)
    }
})


router.get('/verovio', async (req, res) => {
    const verovioToolkit = await getVerovioToolkitInstance();
    if (!verovioToolkit) return 'no'
    const str = (await promises.readFile('./mei-docs/sample.mei', {encoding: 'utf-8'})).toString();
    verovioToolkit.loadData(str);
    verovioToolkit.setOptions({
        adjustPageHeight: true
    });
    // verovioToolkit.setOptions({
    //     pageHeight: 500
    // })
    const outputData = verovioToolkit.renderToSVG(1);
    return res.send(outputData)
    
})
export default router;