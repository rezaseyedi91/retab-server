
import * as fs from 'fs'
import * as pathLib from 'path';
import { getInstance as getVerovioToolkitInstance } from './VerovioToolkitInstance';


const testModule = async () => {
    // return 'this is the result'
    const verovioToolkit =  await getVerovioToolkitInstance();
    if (!verovioToolkit) return 'no'
    const inputFile = fs.readFileSync(pathLib.resolve(__dirname, '../mei-docs/test.mei'));
    try {
        verovioToolkit.loadData(inputFile.toString());
        

    } catch(err) {
        console.log('err in loading data'/** , err*/)
    }
    try {
         
        const outputData = verovioToolkit.renderToSVG(1);
        return outputData
    } catch (error) {
        console.log('err in rendertoSVG')
    }
    // fs.writeFileSync(pathLib.join(__dirname, './mei-docs/outpupt.svg'), outputData)
};

export default testModule