import { MeiTag } from ".";
import { IMeiAttribute, IMeiTag, MeiAttribute } from "../interfaces";
import Layer from "./Layer";
import Measure from "./Measure";
import Staff from "./Staff";

export default class Section extends MeiTag {
    tagTitle = 'section';
    initChildTags(): void {
        throw new Error("Method not implemented.");
    }
    attributes: IMeiAttribute[] = [];
    getXML(): string {
        this.setAttributes();
        return `
        <section ${this.attributes.map(att => att.toString()).join(' ')} >
            ${this.wrapChildTags()}
        </section>
        
        `
    }

    setAttributes(): void {
        this.attributes = !this.attributes.length ? [] : this.attributes;
        
        this.setAttribute(new MeiAttribute('xml:id', this.xmlId))
    }
    addMeasure() {
        const n = this.children.filter(ch => ch instanceof Measure).length + 1
        const newMeasure = new Measure(n).addStaff()
        this.children.push(newMeasure);
        return newMeasure
    }


    getMeasure(index = 0): Measure {
        if (index == 0) return this.children.find(ch => ch instanceof Measure) as Measure;
        else return this.children.filter(ch => ch instanceof Measure)[index] as Measure
    }

    

    
}