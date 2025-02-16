import verovio, { toolkit as ToolkitType } from 'verovio';
let verovioToolkit: ToolkitType;

export function initVerovio() {
    try {
        verovio.module.onRuntimeInitialized = () => {
            verovioToolkit = new verovio.toolkit(); 
        }
        
    } catch (error) {
        console.log('verovio errored')
    }
}   

export async function getInstance(): Promise<ToolkitType> {
    return new Promise<ToolkitType>(resolve => {
        
        if (verovioToolkit)  return resolve(verovioToolkit);
        
        else { 
            setTimeout(() => {
                return resolve(verovioToolkit)
            }, 1000)
        
        }
    })
}


