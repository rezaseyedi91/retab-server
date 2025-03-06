import { writeFileSync } from "fs";
import DB from "../modules/DB";
import { TDocSettings, TMeiTag, TRetabDoc, TTabCourseTuningInfo, TUser } from "../modules/db-types";
import MeiMainTag from "../modules/mei-tags/MeiMainTag";
import { MeiTag } from "../modules/mei-tags";
import Section from "../modules/mei-tags/Section";
import { MeiAttribute } from "../modules/interfaces";
import StaffInfoContainer from "../modules/retab-modules/StaffInfoContainer";
import RetabUser from "../modules/retab-modules/User";
import TabIdeaDocGenerator from "./TabIdeaDocGenerator";


export default class RetabDoc implements TRetabDoc {
    settings?: TDocSettings;
    id?: number | undefined;
    lastModifiedAt?: string | Date | undefined;
    mainChildId?: number | undefined;
    mainChild?: MeiMainTag | null | undefined;
    title?: string | undefined;
    user?: TUser | undefined;
    createdAt?: string | Date | undefined;
    filename?: string | undefined;

    userId?: number | undefined;

    stavesInfo: StaffInfoContainer[] = []

    static makeInstance(id?: number) {
        const instance = new RetabDoc();

        if (!id) return instance;
        else return this.getInstanceFromDb(id) || new RetabDoc()
    }
    initializeMeiMainTag() {
        // 
        this.mainChild = new MeiMainTag({})
    }

    appendHead(head: MeiTag) {
        // this.mainChild?.addOrReplaceChild(head);
        this.mainChild?.appendHead(head)
    }

    getStaffInfo(n = 1) {
        return this.stavesInfo.find(si => si.n) || this.stavesInfo[n - 1]
    }
    setStavesInfo(stavesInfo: StaffInfoContainer[]) {
        console.log(stavesInfo)
        // let sic = this.getStaffInfoContainer(staffN);
        for (const staffInfo of stavesInfo) {
            const staffN = staffInfo.n || 1
            
            const staffDefMeiTag = this.mainChild?.getStaffDefMeiTag(staffN)!;
            const sic = this.setTuning(staffInfo.tuning, staffInfo.n)
            sic.adjustStaffDef(staffDefMeiTag)
            if (this.settings?.proportionInclude) sic.appendProport(staffDefMeiTag, this.settings.proportionNum!, this.settings.proportionNumbase!)
        }
    }
    setTuning(coursesInfo: TTabCourseTuningInfo[], staffN = 1) {
        let sic = this.getStaffInfoContainer(staffN);
        if (sic) sic.setTuning(coursesInfo)
        else {
            sic = new StaffInfoContainer({
                linesCount: coursesInfo.length,
                notationType: StaffInfoContainer.DEFAULT_INFO.notationType,
                tuning: StaffInfoContainer.DEFAULT_TUNING,
            });
            this.stavesInfo.push(sic)
        }
        return sic
      
        
    }

    getStaffInfoContainer(n = 1) { return this.stavesInfo.find(sic => sic.n == n); }
    appendSection(section: MeiTag | Section) {

        (this.mainChild as MeiMainTag).appendSection(section as MeiTag)
    }
    static async getInstanceFromDb(id: number) {
        try {
            const info = await DB.getInstance().retabDoc.findUniqueOrThrow({
                where: { id },
                include: {
                    user: true,
                    mainChild: includeChildrenRecursively(),
                    stavesInfo: {
                        include: {
                            tuning: true
                        }
                    },
                    settings: true
                }
            });
            const instance = new RetabDoc();
            instance.setInfo(info as TRetabDoc)
            return instance;
        } catch (error) {
            console.log('Err: No Doc Record Found.')
        }

    }
    getDataToEdit() {
        return {
            id: this.id,
            title: this.title,
            filename: this.filename,
            createdAt: this.createdAt,
            instruments: this.stavesInfo.map(si => si.instrument?.title) || [],
            tabType: this.stavesInfo?.map((si: any) => si.notationType)?.[0],
            tuning: this.stavesInfo?.map((si: any) => si.tuning)?.[0],
            sectionJsonElem: this.getSection()?.toJsonElem(),
            headJsonElem: this.getHead()?.toJsonElem(),
            stavesInfo: this.stavesInfo,
            settings: this.settings
        }
    }

    getSection() {
        return this.mainChild?.getSection()
    }
    getHead() {
        return this.mainChild?.getHead()
    }
    setInfo(info: TRetabDoc) {
        this.id = info.id;
        this.lastModifiedAt = new Date(info.lastModifiedAt!);
        this.mainChild = new MeiMainTag(info.mainChild || undefined);
        this.mainChildId = info.mainChildId || undefined
        this.stavesInfo = info.stavesInfo?.map(s => s instanceof StaffInfoContainer ? s : new StaffInfoContainer(s)) || []
        this.title = info.title
        this.user = info.user
        this.createdAt = info.createdAt
        this.filename = info.filename
        this.settings = info.settings
        this.userId = info.userId;
        return this;
    }
    getStaffDefMeiTag(n = 1) {
        const score = this.mainChild?.getScoreMeiTag();
        const staffGrp = score?.__('staffGrp')
        const staffDef = staffGrp?.getChildrenByTagName('staffDef')?.find(ch => ch.hasSameAttributeKeyValue(new MeiAttribute('n', n)))
        return staffDef
    }

    async save() {
        const user = await RetabUser.getUser();
        const savedInfo = await this.initializeFileInDb({
            userId: user.id,
            title: this.title,
            id: this.id,
            settings: this.settings
        })
        this.id = savedInfo.id

        await this.saveStavesInfo();
        await this.mainChild?.save(this);

    }
    async saveStavesInfo() {
        if (!this.id) throw new Error('RetabDoc Must be savedFirst')
        const saveResults = await Promise.all(this.stavesInfo.map(si => si.save(this.id!)))
    }

    generateFilename(title: string) { return `${title || 'unknownTitle'}-${this.user?.name}-${Date.now()}.mei` }
    async initializeFileInDb(payload: TRetabDoc) {
        const settingsData = {
            defaultFirstTabgrpDurSymShow: this.settings?.defaultFirstTabgrpDurSymShow,
            proportionInclude: this.settings?.proportionInclude,
            proportionNum: this.settings?.proportionNum,
            proportionNumbase: this.settings?.proportionNumbase,
            tabgroupsIncludeDurAttribute: this.settings?.tabgroupsIncludeDurAttribute,

        }
        const saved = await DB.getInstance().retabDoc.upsert({
            where: { id: this.id || 0 },
            create: {
                title: payload.title || '',
                user: { connect: { id: payload.userId } },
                filename: this.generateFilename(payload.title || 'unknown-title'),
                settings: {
                    connectOrCreate: {
                        where: {docId: this.id || 0},
                        create: settingsData
                    }
                }

            },
            update: {
                lastModifiedAt: new Date(),
                title: payload.title || '',
                filename: this.generateFilename(payload.title || 'unknown-title'),
                settings: {
                    upsert: {
                        where: {
                            docId: this.id || 0
                        },
                        create:settingsData, update:settingsData
                    }
                }
            }
        })
        return saved
    }

    async toMei() {
        const docGenerator = new TabIdeaDocGenerator();

        return docGenerator.setDoc(this)
    }

    async remove() {
        if (!this.id) throw new Error('ID must be present');
        return await DB.getInstance().retabDoc.delete({
            where: { id: this.id },
        })
    }
    assignDocSettings(docStetings: {
        defaultFirstTabgrpDurSymShow: boolean,
        proportion: { include: boolean, num: number, numbase: number }
        tabgroupsIncludeDurAttribute: boolean
    }) {
        this.settings = {
            defaultFirstTabgrpDurSymShow: docStetings.defaultFirstTabgrpDurSymShow,
            proportionInclude: docStetings.proportion.include,
            proportionNum: docStetings.proportion.num,
            proportionNumbase: docStetings.proportion.numbase,
            tabgroupsIncludeDurAttribute: docStetings.tabgroupsIncludeDurAttribute,
            docId: this.id || undefined
        }
    }
}


function includeChildrenRecursively(n = 1): any {
    if (n >= 20) return {
        include: { children: { orderBy: { indexAmongSiblings: 'asc' } }, attributes: true }
    }
    else return {
        include: { children: { ...includeChildrenRecursively(n + 1), orderBy: { indexAmongSiblings: 'asc' } }, attributes: true }
    }



}