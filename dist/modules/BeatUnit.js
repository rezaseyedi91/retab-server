"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TinyBeat = exports.DemiSemiQuaverBeat = exports.SemiQuaverBeat = exports.QuaverBeat = exports.QuarterBeat = exports.HalfBeat = exports.WholeBeat = void 0;
const Duration_1 = __importDefault(require("./Duration"));
class BeatUnit {
    constructor() {
        this.isTripletChild = false;
        this.children = [];
    }
    log() {
        return this.duration.durNum;
    }
    static makeInstance(durNum) {
        return durNum == 1 ? new WholeBeat()
            : durNum == 2 ? new HalfBeat()
                : durNum == 4 ? new QuarterBeat()
                    : durNum == 8 ? new QuaverBeat()
                        : durNum == 16 ? new SemiQuaverBeat()
                            : durNum == 32 ? new DemiSemiQuaverBeat()
                                : new TinyBeat(durNum);
    }
    halved() {
        return BeatUnit.makeInstance(this.duration.durNum * 2);
    }
    ;
    leftToFill(figure) {
        if (figure.length == 0)
            return 1 / this.duration.durNum;
        const left = 1 / this.duration.durNum - (1 / figure.reduce((sum, b) => sum + b.getFractionOfWholeNote(), 0));
        return (left);
    }
    getFractionOfWholeNote() {
        return this.duration.getFraction();
    }
    putTieInTheMiddle() {
        return;
    }
    equalsDuration(du) {
        return this.duration.dur == du;
    }
}
exports.default = BeatUnit;
class WholeBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('1');
    }
}
exports.WholeBeat = WholeBeat;
class HalfBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('2');
    }
}
exports.HalfBeat = HalfBeat;
class QuarterBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('4');
    }
}
exports.QuarterBeat = QuarterBeat;
class QuaverBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('8');
    }
}
exports.QuaverBeat = QuaverBeat;
class SemiQuaverBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('16');
    }
}
exports.SemiQuaverBeat = SemiQuaverBeat;
class DemiSemiQuaverBeat extends BeatUnit {
    constructor() {
        super(...arguments);
        this.duration = new Duration_1.default('32');
    }
    halved() { return new TinyBeat('64'); }
}
exports.DemiSemiQuaverBeat = DemiSemiQuaverBeat;
class TinyBeat extends BeatUnit {
    constructor(duration) {
        super();
        if (!duration)
            this.duration = new Duration_1.default('64');
        else if (duration instanceof Duration_1.default)
            this.duration = duration;
        else
            this.duration = new Duration_1.default(String(duration));
    }
    halved() {
        const newInst = new TinyBeat();
        newInst.duration = new Duration_1.default((Number(this.duration.dur) * 2).toString());
        return newInst;
    }
}
exports.TinyBeat = TinyBeat;
