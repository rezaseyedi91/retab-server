import * as fs from 'fs';
import { getInstance as getVerovioToolkitInstance } from './../rez-mei/VerovioToolkitInstance'
export async function xmlToSvg(str: string) {
    fs.writeFileSync('./result.mei', str);
        

    const verovioToolkit = await getVerovioToolkitInstance();
    verovioToolkit.setOptions({
        adjustPageHeight: true,
        
    })
    if (!verovioToolkit) return 'no'
    verovioToolkit.loadData(str);
    const outputData = verovioToolkit.renderToSVG(1);
    return outputData
}


export function getQueryAccidental(query: {accidental?: string}) {
    return !query.accidental ? '' : query.accidental == 'f' ? 'b' : query.accidental == 's' ? '#' : '-';
}

export function getTwoPower(num: number) {
    let result: number;
    switch (num) {
        case 1:
            result = 0; break;
        case 2:
            result = 1; break;
        case 4:
            result = 2; break;
        case 8:
            result = 3; break;
        case 16:
            result = 4; break;
        case 32:
            result = 5; break;
        case 64:
            result = 6; break;
        case 128:
            result = 7; break;
        case 256:
            result = 8; break;
        case 512:
            result = 9; break;
        default:
            result= 1
            break;
    }
    return result

}







