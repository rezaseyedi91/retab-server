import DB from "../DB";
import { TDocSettings, TInstrument, TRetabDoc, TStaffInfo, TTabCourseTuningInfo } from "../db-types";
import { MeiAttribute } from "../interfaces";
import { MeiTag } from "../mei-tags";
import NoteTablature, { AccidedNotePname } from "../NoteTablature";

export default class StaffInfoContainer implements TStaffInfo {
    instrument?: TInstrument | undefined;
    instrumentId?: number | null | undefined;
    n?: number | undefined;
    linesCount?: number | null | undefined;
    doc?: TRetabDoc | undefined;
    docId?: number | undefined;
    id?: number | undefined;
    tuning: TTabCourseTuningInfo[];
    notationType: TStaffInfo["notationType"];
    static DEFAULT_TUNING: TTabCourseTuningInfo[] = [
        { n: 1, pname: "g", oct: 4 },
        { n: 2, pname: "d", oct: 4 },
        { n: 3, pname: "a", oct: 3 },
        { n: 4, pname: "f", oct: 3 },
        { n: 5, pname: "c", oct: 3 },
        { n: 6, pname: "g", oct: 2 },
    ]

    static DEFAULT_INFO: TStaffInfo = {
        linesCount: 6,
        notationType: 'tab.lute.italian',
        tuning: this.DEFAULT_TUNING,
        n: 1
    }

    constructor(info: TStaffInfo) {

        this.n = info.n || StaffInfoContainer.DEFAULT_INFO.n
        this.linesCount = info.linesCount || StaffInfoContainer.DEFAULT_INFO.linesCount
        this.notationType = info.notationType || StaffInfoContainer.DEFAULT_INFO.notationType
        this.tuning = (info.tuning as TTabCourseTuningInfo[]) || StaffInfoContainer.DEFAULT_TUNING
    }

    setTuning(coursesInfo: TTabCourseTuningInfo[]) {
        this.tuning = coursesInfo.sort((a, b) => a.n! - b.n!);
    }
    adjustStaffDef(el: MeiTag ) {
        const CONSTANT_LINES_COUNT = 6
        el.setAttribute(new MeiAttribute('n', this.n!))
        el.setAttribute(new MeiAttribute('lines', CONSTANT_LINES_COUNT)) //this.linesCount!
        el.setAttribute(new MeiAttribute('notationtype', this.notationType!))

        const tuningTag = el.addChildIfNotExists(new MeiTag({
            tagTitle: 'tuning'
        }))

        tuningTag.children = [];

        tuningTag.addChildren(...this.tuning.map(c => {
            const pnameAccidAttributes: MeiAttribute[] = NoteTablature.makeAccidedPnameAttributes(c.pname as AccidedNotePname) //            { title: 'pname', value: c.pname },
            return new MeiTag({
                tagTitle: 'course', attributes: [
                    { title: 'n', value: c.n + '' },
                    { title: 'oct', value: c.oct + '' },
                    ...pnameAccidAttributes
                ],
                selfClosing: true
            })
        }))



    }

    appendProport(el: MeiTag, num = 2, numbase = 2, sign: TDocSettings["proportionSign"], slash: TDocSettings["proportionSlash"]) {
        const proport = new MeiTag({
            tagTitle: 'proport', 
            selfClosing: true,
            attributes: [
                new MeiAttribute('num', num),
                new MeiAttribute('numbase', numbase),
            ]
        })

        el.children.unshift(proport);
        // for C and slashed C signs:
        if (sign) {
            el.setAttribute(new MeiAttribute('mensur.sign', sign))
        } 
        if (slash) {
            el.setAttribute(new MeiAttribute('mensur.slash', slash))

        }

    }

    async save(docId: number) {
        const exists = await DB.getInstance().staffInfo.findUnique({
            where: {

                docId_n: { docId: docId || 0, n: this.n || 1 }
            },
            select: { id: true }
        })
        if (exists) {
            await DB.getInstance().staffInfo.update({
                where: { id: exists.id },
                data: {
                    tuning: { set: [] }
                }
            });
        }

        const saved = await DB.getInstance().staffInfo.upsert({
            where: exists?.id ? { id: exists.id } : { docId_n: { docId: docId || 0, n: this.n || 1 } },
            create: {
                n: this.n!, notationType: this.notationType!,
                doc: {
                    connect: { id: docId || 0 },

                },
                instrument: { connectOrCreate: { where: { title: 'Lute' }, create: { title: 'Lute' } } },
                tuning: {
                    connectOrCreate: this.tuning.map(t => {
                        if (t.oct) t.oct = Number(t.oct)
                        return {
                        where: {
                            n_pname_oct: {
                                n: t.n, pname: t.pname, oct: t.oct
                            }
                        },
                        create: {
                            n: t.n!, pname: t.pname!, oct: t.oct!
                        },
                    }})
                }

            },
            update: {
                n: this.n!, notationType: this.notationType!,
                doc: {
                    connect: { id: docId || 0 }
                },
                tuning: {
                    connectOrCreate: this.tuning.map(t => {
                        if (t.oct) t.oct = Number(t.oct)
                        return {
                            where: {
                                n_pname_oct: {
                                    n: t.n, pname: t.pname, oct: t.oct
                                }
                            },
                            create: {
                                n: t.n!, pname: t.pname!, oct: t.oct!
                            },
                        }
                    })
                }
            },
            select: {
                id: true, tuning: { select: { id: true } }
            }
        })

        return saved
    }
}


