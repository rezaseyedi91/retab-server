import Duration, { TDuration } from "./Duration";

export default abstract class BeatUnit {
    abstract duration: Duration;
    isTripletChild = false;
    children: BeatUnit[] = [];
   





    protected log() {
        return this.duration.durNum
    }


    static makeInstance(durNum: Duration["durNum"]) {
        return durNum == 1 ? new WholeBeat()
            : durNum == 2 ? new HalfBeat()
                : durNum == 4 ? new QuarterBeat()
                    : durNum == 8 ? new QuaverBeat()
                        : durNum == 16 ? new SemiQuaverBeat()
                            : durNum == 32 ? new DemiSemiQuaverBeat()
                                : new TinyBeat(durNum)
    }
    protected halved(): BeatUnit {
        return BeatUnit.makeInstance(this.duration.durNum * 2 as Duration["durNum"])
    };




    leftToFill(figure: BeatUnit[]) {
        if (figure.length == 0) return 1 / this.duration.durNum
        const left = 1 / this.duration.durNum - (1 / figure.reduce((sum, b) => sum + b.getFractionOfWholeNote(), 0))
        return (left);
    }

    getFractionOfWholeNote(): number {
        return this.duration.getFraction();

    }

    putTieInTheMiddle() {
        return
    }

    equalsDuration(du: TDuration) {
        return this.duration.dur == du
    }




}

export class WholeBeat extends BeatUnit {
    duration = new Duration('1');
}

export class HalfBeat extends BeatUnit {
    duration = new Duration('2');
}

export class QuarterBeat extends BeatUnit {
    duration = new Duration('4');
}

export class QuaverBeat extends BeatUnit {
    duration = new Duration('8');
}


export class SemiQuaverBeat extends BeatUnit {
    duration = new Duration('16');
}
export class DemiSemiQuaverBeat extends BeatUnit {
    duration = new Duration('32');
    protected halved() { return new TinyBeat('64') }
}

export class TinyBeat extends BeatUnit {
    duration: Duration;
    constructor(duration?: Duration | Duration["durNum"] | Duration["dur"]) {
        super()
        if (!duration) this.duration = new Duration('64')
        else if (duration instanceof Duration) this.duration = duration
        else this.duration = new Duration(String(duration) as Duration["dur"])
    }
    halved() {
        const newInst = new TinyBeat();
        newInst.duration = new Duration((Number(this.duration.dur) * 2).toString() as TDuration)
        return newInst
    }
}





