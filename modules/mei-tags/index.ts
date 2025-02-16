import DB from "../../modules/DB";
import RetabDoc from "../../rez-mei/RetabDoc";
import { TMeiJsonElemInput } from "../../rez-mei/TabIdeaDocGenerator";
import { TMeiAttribute, TMeiTag, TRetabDoc } from "../db-types";
import { MeiAttribute } from "../interfaces";

export type TMeiTagFactoryArgs = {
    tagTitle: MeiTag["tagTitle"],
    attributes?: { title: MeiAttribute["title"], value?: MeiAttribute["value"] }[],
    children?: TMeiTagFactoryArgs[],
    selfClosing?: boolean,
    textContent?: string
}
export class MeiTag implements TMeiTag {
    tagTitle: string = "";
    id?: number;
    parentId?: number | null | undefined;
    doc?: TRetabDoc | undefined;
    docId?: number | undefined;
    indexAmongSiblings?: number | undefined;
    parent?: TMeiTag | undefined;
    relatedChildId?: number | undefined;
    xmlId: string;
    selfClosing = false;
    private indent = 0
    constructor(payload?: TMeiTag) {
        const payloadXmlId = payload?.attributes?.find(at => at.title == 'xml:id')?.value

        this.xmlId =  payloadXmlId||  this.generateId();
        this.tagTitle = payload?.tagTitle || this.tagTitle
        if (payload && Object.keys(payload)?.[0]) {
            // cleanup payload attributes:
            payload.attributes = payload.attributes?.filter(a => a.value);
            for (const k in payload) {
                if (k == 'attributes') {
                    this.attributes = payload.attributes?.map(a => new MeiAttribute(a.title || 'TITLE', a.value || 'VALUE')) || []
                } else {
                    Object.assign(this, ({ [k]: payload[k as keyof typeof payload] }))
                }
            }

            if (payload.children?.length) {
                this.children = payload.children.map(ch => ch instanceof MeiTag ? ch : new MeiTag(ch))
            }
        }

    }

    getChildrenTagTitlesTree(): any {
        return { [this.tagTitle]: this.children.map(ch => ch.getChildrenTagTitlesTree()) }
    }
    addChildIfNotExists(child: MeiTag, index?: number) {
        const found = this.children.find(ch => ch.tagTitle == child.tagTitle)
        return found ? found instanceof MeiTag ? found : new MeiTag(found) : this.addChild(child, index)


    }
    addOrReplaceChild(...children: MeiTag[]) {

        for (const child of children) {
            const idx = this.children.indexOf(this.children.find(ch => ch.tagTitle == child.tagTitle)!)
            if (idx > -1) {
                this.children.splice(idx, 1);
            }
            this.addChild(child)
        }

    }
    addChildren(...children: MeiTag[]) {
        for (const ch of children) this.addChild(ch)
    }
    addChild(ch: MeiTag, index?: number) {

        if (index != undefined) this.children.splice(index, 0, ch)
        else this.children.push(ch);

        ch.setIndent(this.getIndent() + 1)
        return ch
    }
    setChildrenAsSelfClosing(tagTitle: string): this {
        if (this.tagTitle == tagTitle) this.selfClosing = true
        this.children.forEach(ch => ch.setChildrenAsSelfClosing(tagTitle))
        return this;
    }
    textContent?: string;
    setAttribute(att: MeiAttribute) {
        const alreadySameTitleAtt = this.attributes.find(a => a.title == att.title)
        if (alreadySameTitleAtt) alreadySameTitleAtt.value = att.value;
        else this.attributes.push(att)

    }
    setIndent(i: number) {
        this.indent = i
    }
    getIndent() { return this.indent }

    generateId(): string {
        const lettersCount = 6;
        const characters = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ]
        let str = ''
        for (let i = 0; i < lettersCount; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomNumber = String(Math.floor(Math.random() * 10));
            str = str.concat(characters[randomIndex], randomNumber)
        }

        return str
    }

    getAttributesTitles() {
        return this.attributes.map(a => a.title)
    }

    async updatePrevSavedAttributes() {
        const prisma = DB.getInstance();
        const extrasIds: number[] = []//alreadyHasThem.filter(a => !this.attributes.find(at => at.title == a.title)).map(({id})=> id);
        const tobeUpdated: TMeiAttribute[] = [];
        const alreadyHasThem = await prisma.meiAttribute.findMany({
            where: {
                containerTag: {
                    id: this.id || 0
                }
            }
        });
        alreadyHasThem.forEach(alreadyHasAtt => {
            const foundByTitle = this.attributes.find(at => at.title == alreadyHasAtt.title);
            if (!foundByTitle) extrasIds.push(alreadyHasAtt.id)
            else {
                if (foundByTitle.value != alreadyHasAtt.value) {
                    tobeUpdated.push({ ...alreadyHasAtt, value: foundByTitle.value })
                }
                this.attributes.splice(this.attributes.indexOf(foundByTitle), 1)
            }
        })


        const result = await prisma.$transaction([
            ...tobeUpdated.map(upAt => prisma.meiAttribute.update({
                where: { id: upAt.id }, data: { value: upAt.value }
            })),
            ...!extrasIds.length ? [] : [prisma.meiAttribute.deleteMany({ where: { id: { in: extrasIds } } })],
            prisma.meiAttribute.createMany({
                data: this.attributes.map(at => ({
                    containerTagId: this.id || 0,
                    title: at.title,
                    value: at.value
                }))
            })
        ]);

        this.attributes = await this.getSavedAttributes();
    }

    async getSavedAttributes(): Promise<MeiAttribute[]> {
        return (await DB.getInstance().meiAttribute.findMany({
            where: { containerTagId: this.id || 0 },

        })).map(a => new MeiAttribute(a.title, a.value || ''))
    }

    getParentId() { return this.parentId || this.parent?.id }
    async save(doc: RetabDoc) {
        this.setAttributes();

        const prisma = DB.getInstance();
        const saved = await prisma.meiTag.upsert({
            where: {
                id: this.id || 0
            },
            create: {
                xmlId: this.xmlId,
                selfClosing: this.selfClosing,
                ...this.tagTitle == 'mei' ? { doc: { connect: { id: doc.id } } } : {},
                tagTitle: this.tagTitle,
                indexAmongSiblings: this.indexAmongSiblings || 0,
                ...this.getParentId() ? { parent: { connect: { id: this.parent?.id || this.parentId || 0 } } } : {},
                ...this.textContent ? { textContent: this.textContent } : {},

            },
            update: {
                xmlId: this.xmlId,
                selfClosing: this.selfClosing,
                ...this.tagTitle == 'mei' ? { doc: { connect: { id: doc.id } } } : {},
                tagTitle: this.tagTitle,
                indexAmongSiblings: this.indexAmongSiblings || 0,
                ...this.textContent ? { textContent: this.textContent } : {},

            },
            include: {
                children: true
            }
        });

        this.id = saved.id;
        await this.updatePrevSavedAttributes();
        //removing extra children
        await prisma.meiTag.deleteMany({
            where: {
                AND: [
                    { parentId: this.id },
                    { id: { notIn: this.children.map(ch => ch.id!).filter(id => id) } }
                ]
            }
        })
        this.setChildrenParentId();
        await Promise.all(this.children.map(ch => ch.save(doc)))
    }
    attributes: MeiAttribute[] = [];
    // abstract getXML(): string 
    setAttributes(): void {
        return
    }

    setChildrenParentId() {
        if (!this.id) throw new Error('WE HAVE NO ID HERE!');
        this.children.forEach((ch, index) => {
            ch.parentId = this.id
            ch.indexAmongSiblings = ch.indexAmongSiblings || index
            ch.parent = this
        })
    }

    hasSameAttributeKeyValue(att: TMeiAttribute) {
        return this.attributes.find(a => a.title == att.title && a.value == att.value)
    }
    // hasAttributeWithValue(cb:  (value: IMeiAttribute, index: number, obj: IMeiAttribute[]) => unknown) {
    //     return this.attributes.find(cb)

    // }

    async remove() {
        return await DB.getInstance().meiTag.delete({where: {id: this.id}})
    }
    getChildrenByTagName(tagname: string) {
        return this.children.filter(ch => ch.tagTitle == tagname)
            .map(ch => ch instanceof MeiTag ? ch : new MeiTag(ch));
    }

    getChildByTagName(tagname: string): MeiTag | undefined {
        const ch = this.children.find(ch => ch.tagTitle == tagname)
        return !ch ? undefined : (ch instanceof MeiTag) ? ch : new MeiTag(ch)
    }
    /**getChildByTagName */
    __(tagname: string) {
        return this.getChildByTagName(tagname)!
    }

    toJsonElem(): TMeiJsonElemInput {
        return {
            attributes: this.attributes,
            children: this.children.map(ch => ch.toJsonElem()),
            tagTitle: this.tagTitle,
            selfClosing: this.selfClosing,
            ...this.textContent ? { textContent: this.textContent } : {}
        }
    }
    setTextContent(str?: string) {
        this.textContent = str

    }
    children: MeiTag[] = [];
    initChildTags(): void {
        this.setChildrenParentId();

        throw new Error("Method not implemented.");
    }
    wrapChildTags(): string {
        return this.children.map(ch => ch.getXML()).join('\n')
    }

    pushChildren(...children: MeiTag[]) {
        children.forEach(ch => this.children.push(ch));
        [...children].forEach(i => i.setIndent(this.getIndent() + 1))
    }

    getXML(): string {
        this.setAttributes();
        return '<' + this.tagTitle + ` ${this.getAttributesJoint()} ` +
            (this.selfClosing ? "/>" : (
                '>' + '\n' + (this.textContent || '') + this.wrapChildTags() + '\n' + '</' + this.tagTitle + '>')
            )

    }

    static makeTagsTree(args: TMeiTagFactoryArgs) {
        // const constructor = args.tagTitle == 'note' ? Note : MeiTagInstance;
        const newTag = new MeiTagInstance(args);
        newTag.selfClosing = args.selfClosing || false
        if (args.textContent) newTag.textContent = args.textContent
        return newTag
    }
    getAttributesJoint(): string {

        return this.attributes.map(att => att.toString()).join(' ')
    }
    pushAttribute(att: MeiAttribute) {
        if (!this.hasSameAttributeKeyValue(att)) {
            this.attributes.push(new MeiAttribute(att.title, att.value || ""))
        }
    }



}


export class MeiTagInstance extends MeiTag {
    // tagTitle: string;

    constructor(args: TMeiTagFactoryArgs) {
        super(args);
        // this.tagTitle = args.tagTitle
        this.textContent = args.textContent
        this.selfClosing = args.selfClosing || false
        args.attributes?.forEach(att => this.setAttribute(new MeiAttribute(att.title, att.value || "")))
        this.children = args.children?.map(ch => ch instanceof MeiTag ? ch : new MeiTagInstance(ch)) || []


    }
    setAttributes(): void { return; }
    updateChildren(): MeiTag {
        return this;
    }

}