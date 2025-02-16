import { Router } from "express";
import retabRouter from './retab'
const router = Router();

router.get('/', async (req, res) => {
    try {
        
        res.send('test')
        // const result = await testModule();
        // res.send(result)

    } catch(err) {
        res.send('err happened')
    }
})
router.use('/retab', retabRouter)


export default router