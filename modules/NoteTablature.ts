import RetabDoc from "../rez-mei/RetabDoc";
import { TMeiTag } from "./db-types";
import { MeiAttribute } from "./interfaces";
import { MeiTag } from "./mei-tags";
export enum NotePname {
    c = "c",
    d = "d",
    e = "e",
    f = "f",
    g = "g",
    a = "a",
    b = "b",
}
export enum AccidedNotePname {
    c = "c",
    cSharp = "c#",
    cFlat = "cb",
    d = "d",
    dSharp = "d#",
    dFlat = "db",
    e = "e",
    eSharp = "e#",
    eFlat = "eb",
    f = "f",
    fSharp = "f#",
    fFlat = "fb",
    g = "g",
    gSharp = "g#",
    gFlat = "gb",
    a = "a",
    aSharp = "a#",
    aFlat = "ab",
    b = "b",
    bSharp = "b#",
    bFlat = "bb",
}

/**NATURAL ALSO CONSIDERED! */
export type Accidental = 's' | 'f' | '' | 'n' //'#' | 'b' | ''


export default class NoteTablature extends MeiTag {
    tagTitle = 'note'; 
    constructor(payload?:TMeiTag ) {
        super(payload)
    }
    setAttributes() {
        this.attributes = this.attributes || [];
        this.setAttribute(new MeiAttribute('xml:id', this.xmlId))
    }

    override async save(doc: RetabDoc): Promise<void> {
        await super.save(doc);
        if (!this.attributes.find(at => at.title == 'tab.fret' && !isNaN(Number(at.value)))) await this.remove()
    }

    
    static makeAccidedPnameAttributes(name: AccidedNotePname) : MeiAttribute[] {
        const pname = name[0]
        const accid = !name[1] ? undefined : name[1] == '#' ? 's' : 'f'
        
        return [new MeiAttribute('pname', pname), ...accid ? [new MeiAttribute('accid', accid)] : []]
    }
}