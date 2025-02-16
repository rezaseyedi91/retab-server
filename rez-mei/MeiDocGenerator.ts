import { xmlToSvg } from "../utils"

import  xmlFormatter from 'xml-formatter'
export interface IMeiDocGenerator {
    xml: string

}


export class MeiDocGenerator implements IMeiDocGenerator {
    xml = ''

    static prettifyXmlFile(input: string) {
      try {
         const output = xmlFormatter(input, {forceSelfClosingEmptyTag: true, collapseContent: true});         
         return output;
          } catch (err) {
            console.log(err)
              console.error('there is some error importing XSLT DOC at prettyfy Xml file; continuing with ugly xml file for now :)')
              return input
          }
  }

   async toSvg() {
      return await xmlToSvg(this.xml)
   }


}

