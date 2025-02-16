import { MeiAttribute } from "../modules/interfaces";
import { MeiTag, MeiTagInstance } from "../modules/mei-tags";
import Layer from "../modules/mei-tags/Layer";
import Measure from "../modules/mei-tags/Measure";
import Section from "../modules/mei-tags/Section";
import Staff from "../modules/mei-tags/Staff";
import TabGrp, { TabDurSym } from "../modules/mei-tags/TabGrp";
import NoteTablature from "../modules/NoteTablature";
import { MeiDocGenerator } from "./MeiDocGenerator";
import RetabDoc from "./RetabDoc";
import { TTabCourseTuningInfo } from "../modules/db-types";
export type TMeiJsonElemInput = {
    attributes: MeiAttribute[]
    tagTitle: string;
    children: TMeiJsonElemInput[];
    textContent?: string;
    selfClosing?: boolean
}


export default class TabIdeaDocGenerator extends MeiDocGenerator {
    /**OLD WAY:*/
    // async generateXml(docId: number | undefined, jsonElem: TMeiJsonElemInput, options: TabIdeaDocGeneratorOptions, customHead?: TMeiJsonElemInput) {
    //     // const section = TabIdeaDocGenerator.jsonElemToSection(jsonElem);
    //     // const head = customHead ? MeiTag.makeTagsTree(customHead) : undefined;
    //     // if (options.tuning) this.setTuning(options.tuning);
         
    //     // NEW WAY:
    //     const retabDoc = (await RetabDoc.makeInstance(docId))!;
    //     retabDoc.initializeMeiMainTag()
    //     const section = TabIdeaDocGenerator.jsonElemToSection(jsonElem);
    //     retabDoc?.appendSection(section)
    //     const head = customHead ? MeiTag.makeTagsTree(customHead) : undefined;
    //     if (head) retabDoc?.appendHead(head)
        
    //     retabDoc?.setTuning(options.tuning);
    //     await retabDoc.save()
    //     const xml = this.setDoc(retabDoc);
      
    //     return xml
    // }

 

    static jsonElemToSection(jsonElem: TMeiJsonElemInput) {
        const childrenToMeiTags = jsonElem.children?.map(ch => this.meiTagInstanceFromJsonElem(ch)) || [];
        const section = new MeiTag({tagTitle: 'section'});
        section.setAttribute(new MeiAttribute('n', '1'))
        section.addChildren(...childrenToMeiTags);
        section.setChildrenAsSelfClosing('note')
        return section;
    }

    static meiTagInstanceFromJsonElem(jsonElem: TMeiJsonElemInput): MeiTag {
        let tag: MeiTag
        switch (jsonElem.tagTitle) {
            case 'measure':
                tag = new Measure(Number(jsonElem.attributes?.find(a => a.title == 'n')?.value || 1))
                break;
            case 'staff':
                tag = new Staff(Number(jsonElem.attributes?.find(a => a.title == 'n')?.value || 1))
                break;
            case 'tabGrp':
                tag = new TabGrp()
                break;
            case 'note':
                tag = new NoteTablature(jsonElem)
                break;
            case 'score':
                tag = new Section();

                break;
            case 'layer':
                tag = new Layer();
                break;
            case 'tabDurSym':
                tag = new TabDurSym();
                break;
            default:
                tag = new MeiTagInstance({ tagTitle: jsonElem.tagTitle, attributes: jsonElem.attributes, })//  Number(jsonElem.attributes?.find(a => a.title == 'n')?.value || 1))
                break;
        }

        jsonElem.attributes?.forEach(t => tag.pushAttribute(t))
        jsonElem.children?.forEach(ch => tag.pushChildren(this.meiTagInstanceFromJsonElem(ch)))
        return tag;
    }

    
    // setDoc(section: Section, head?: MeiTag) 
    setDoc(retabDoc: RetabDoc) {

        // get or initialize <mei></mei>
        // get or initialize <head>
        // get or initialize <music>
        // put section in the proper place;
        
        this.xml = retabDoc.mainChild?.getXML() || ''
        const pretty = MeiDocGenerator.prettifyXmlFile(this.xml )
        return pretty;

    }
}