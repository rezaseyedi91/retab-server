import { MeiTag } from ".";
import { IMeiAttribute, IMeiTag, MeiAttribute } from "../interfaces";
import Layer from "./Layer";
import Staff from "./Staff";

export default class MeterSig extends MeiTag {
    count = 4;
    unit = 4;
    initChildTags(): void {
        throw new Error("Method not implemented.");
    }
    attributes: IMeiAttribute[] = [];
    getXML(): string {
        this.setAttributes();
        return `
        <meterSig count="${this.count}" unit="${this.unit}" >
            ${this.wrapChildTags()}
        </meterSig>
        
        `
    }

    tagTitle = 'meterSig';
    setAttributes(): void {
        this.attributes = [];
        
        this.setAttribute(new MeiAttribute('xml:id', this.xmlId))
        this.setAttribute(new MeiAttribute('count', this.count.toString()))
        this.setAttribute(new MeiAttribute('unit', this.unit.toString()))
    }
    addStaff() {
        const n = this.children.filter(ch => ch instanceof Staff).length + 1
        this.children.push(new Staff(n).addLayer());
        return this
    }

    findChildLayer(staffIndex = 0, layerIndex = 0): Layer {
        const staff = this.children.filter(i => i instanceof Staff)[staffIndex];
        const layer = staff.children.filter(i => i instanceof Layer)[layerIndex];
        return layer as Layer
    }
    

    constructor(count: number, unit: number) {
        super();
        this.count = count;
        this.unit = unit;

    }
    
}