import { MeiTag } from ".";
import { IMeiAttribute, IMeiTag, MeiAttribute } from "../interfaces";

export default class Layer extends MeiTag {
    n: number;
     tagTitle = 'layer';
    attributes: IMeiAttribute[] = [];
    // getXML(): string {
    //     this.setAttributes();
    //     return `<layer ${this.attributes.map(att => att.toString()).join(' ')} >
    //         ${this.wrapChildTags()}
    //     </layer>`
        
    // }
    setAttributes(): void {
        this.setAttribute(new MeiAttribute('xml:id', this.xmlId));
        const nAtt = new MeiAttribute('n', this.n.toString())
        if (!this.hasSameAttributeKeyValue(nAtt)) this.setAttribute(nAtt)
    }
    initChildTags(someTags?: MeiTag[]): void {
        if (someTags) this.children.push(...someTags)

    }
    wrapChildTags(): string {
        return this.children.map(ch => ch.getXML()).join('\n')
    }

    constructor(n = 1) {
        super()
        this.n = n
    }

}