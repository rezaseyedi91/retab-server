import { TStaffInfo } from "../db-types";

export type TabCourseTuningInfo = {
    n: number,
    pname?: string,
    oct?: number
}

export enum Instrument {
    LUTE = "lute",
}

export enum TabType {
    FRENCH = "french",
    GERMAN = "german",
    ITALIAN = "italian"
}


export type TCourseInfo = {
    tuning?: TabCourseTuningInfo;
    number: number
}


export type TNoteInfo = {
    course?: number
    fret?: number
    id?: string
}

export type TSectionInfo = {
    staves: TStaffInfo[]
}

export type DurNum = 1|2|4|8|16|32|64