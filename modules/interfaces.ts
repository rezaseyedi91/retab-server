import { TMeiAttribute, TMeiTag } from "./db-types"
import { MeiTag } from "./mei-tags"

export interface IMeiTag extends TMeiTag {
    
    attributes: IMeiAttribute[]
    tagTitle: string
    getXML(): string
    setAttributes(): void
    children: IMeiTag[]
    initChildTags(): void
    wrapChildTags(): string;
    addChild(ch: MeiTag): void
    generateId(): string;
    xmlId: string;
    setChildrenAsSelfClosing(tagTitle: string): this;
    selfClosing: boolean
}




export interface IMeiAttribute extends TMeiAttribute {
    title: string
    getConnectOrCreateQuery(): any

    value?: string  | null
    toString(): string
}

export class MeiAttribute implements IMeiAttribute{
    title: string
    value?: string | null
    id?: number
    constructor(title: string, value: string | number) {
        this.title = title
        this.value = value + ""
    }
    getConnectOrCreateQuery() {
        return {
            where: { id: this.id || 0 },
            create: { title: this.title, value: this.value }
        }
    }
    toString(): string {
        return ` ${this.title}="${this.value}" `
    }

    



}