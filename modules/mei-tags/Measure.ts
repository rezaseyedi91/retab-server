import { MeiTag } from ".";
import { IMeiAttribute, IMeiTag, MeiAttribute } from "../interfaces";
import Layer from "./Layer";
import Staff from "./Staff";

export default class Measure extends MeiTag {
    tagTitle = 'measure';
    n: number
    initChildTags(): void {
        throw new Error("Method not implemented.");
    }
    attributes: IMeiAttribute[] = [];

    setAttributes(): void {
        this.attributes = [];
        
        this.setAttribute(new MeiAttribute('xml:id', this.xmlId))
        this.setAttribute(new MeiAttribute('n', this.n.toString()));
    }
    addStaff() {
        const n = this.children.filter(ch => ch instanceof Staff).length + 1
        this.children.push(new Staff(n).addLayer());
        return this
    }

  
    
    constructor(n: number) {
        super();
        this.n = n;
    }
    
}