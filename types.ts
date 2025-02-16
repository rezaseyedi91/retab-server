
export type RhythmFiguresQuery = {
    timeSig?: string // 3-4
    bars?: number;
    difficulty?: 'easy' | 'medium' | 'hard'
}


export enum ErrorMessages {
    NOTE_NOT_IN_SCALE = "This note is not on this scale"
}






export type TIntervalExerciseQuery = {
     tonic?: string, accidental?: string, mode?: 'major' | 'minor'
}

export type TArpeggioExerciseQuery = TIntervalExerciseQuery & {
    level?: number
} & TArpeggioLevelDetailsQuery

export type TArpeggioLevelDetailsQuery = {
    progression?: string //chordProgression?: ChordFunction[];
    continousIndexes?: string; 
    varietyLevels?: string;
}


export enum TriadType {
    MINOR = 'minor', MAJOR = 'major', 
    DIMINISHED = 'diminished', AUGMENTED = 'augmented'
}
export enum TabType {
    FRENCH = "french",
    GERMAN = "german",
    ITALIAN = "italian"

}


