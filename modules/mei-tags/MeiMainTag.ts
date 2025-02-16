import { MeiTag } from ".";
import { TMeiTag } from "../db-types";
import { IMeiTag, MeiAttribute } from "../interfaces";

export default class MeiMainTag extends MeiTag implements TMeiTag {
    static XMLNS = 'http://www.music-encoding.org/ns/mei'
    // static MEI_VERSION = '5.1-dev'
    static MEI_VERSION = '5.1'
    static TAG_TITLE = 'mei'
    constructor(payload?: TMeiTag) {
        super({...payload, tagTitle: MeiMainTag.TAG_TITLE});
        
        
    }
    setAttributes(): void {
        this.attributes.push(
            new MeiAttribute('xmlns', MeiMainTag.XMLNS),
            new MeiAttribute('meiversion', MeiMainTag.MEI_VERSION),
            new MeiAttribute('xml:id', this.xmlId),
        )
    }
    appendHead(head: MeiTag) {
        if (this.__('head')) {
            throw new Error('already has the head')
        }
        this.addChild(head, 0)
    }


    appendSection(section: MeiTag) {
        this.getScoreMeiTag().addOrReplaceChild(section)        
    }
    

    getSection() {
        return this.getScoreMeiTag().__('section')
    }
    getHead() {
        return this.__('meiHead')
    }
    getScoreMeiTag() {
        
        if (this.__('music')?.__('body')?.__('mdiv')?.__('score')) return this.__('music').__('body').__('mdiv').__('score');
        
        this.addChildIfNotExists(new MeiTag({tagTitle: 'music'}));
        this.__('music').addChildIfNotExists(new MeiTag({tagTitle: 'body'}))
        this.__('music').__('body').addChildIfNotExists(new MeiTag({tagTitle: 'mdiv'}))
        return this.__('music').__('body').__('mdiv').addChildIfNotExists(new MeiTag({tagTitle: 'score'}))
    }

    getStaffDefMeiTag(staffN = 1) {
        const scoreDef = this.getScoreMeiTag().addChildIfNotExists(new MeiTag({tagTitle: 'scoreDef'}), 0)
        const staffGrp = scoreDef.addChildIfNotExists(new MeiTag({tagTitle: 'staffGrp'}))
        const alreadyThere = staffGrp.children.find((ch) => ch.tagTitle == 'staffDef' && (ch as MeiTag).hasSameAttributeKeyValue({title: 'n', value: staffN + ''}))
         return alreadyThere ||  staffGrp.addChild(new MeiTag({
                tagTitle: 'staffDef'
            }))
    }

}