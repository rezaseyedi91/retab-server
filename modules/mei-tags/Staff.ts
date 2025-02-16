import { MeiTag } from ".";
import { IMeiAttribute, IMeiTag } from "../interfaces";
import Layer from "./Layer";

export default class Staff extends MeiTag {
    n: number;
    constructor(n = 1) {
        super()
        this.n = n
    }
    tagTitle = 'staff';
    attributes: IMeiAttribute[] = [];
    setAttributes(): void {
        super.setAttributes()
    }

    addLayer() {
        this.children.push(new Layer(this.children.filter(ch => ch instanceof Layer).length + 1));
        return this
    }



}