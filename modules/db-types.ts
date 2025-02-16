export type TUser = {
        docs?: TRetabDoc[]
        id?: number
        name?: string
        username?: string
        password?: string | null
        email?: string | null
}

export type TInstrument = {
        staves?: TStaffInfo[]
        id?: number
        title?: string
}

export type TRetabDoc = {

        user?: TUser
        mainChild?: TMeiTag | null
        stavesInfo?: TStaffInfo[]
        id?: number
        title?: string
        userId?: number
        mainChildId?: number | null
        lastModifiedAt?: Date | string
        filename?: string
        createdAt?: Date | string
}

export type TStaffInfo = {
        doc?: TRetabDoc
        instrument?: TInstrument
        instrumentId?: number | null;
        tuning?: TTabCourseTuningInfo[]
        id?: number
        docId?: number
        n?: number
        linesCount?: number | null
        notationType?: string
}

export type TTabCourseTuningInfo = {
        staves?: TStaffInfo[]
        id?: number
        n: number
        pname: string
        oct: number
}

export type TMeiTag = {
        attributes?: TMeiAttribute[]
        children?: TMeiTag[]
        parent?: TMeiTag | null
        doc?: TRetabDoc | null
        id?: number
        tagTitle?: string
        selfClosing?: boolean
        textContent?: string | null
        xmlId?: string
        indexAmongSiblings?: number
        parentId?: number | null
        docId?: number | null
}

export type TMeiAttribute = {
        containerTag?: TMeiTag
        id?: number
        title?: string
        value?: string | null
        containerTagId?: number
}


// export type TTabCourseTuningInfo = {
//         n: number,
//         pname: string,
//         oct: number
//     }
    
    
    