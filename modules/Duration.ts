export default class Duration {
    dur: TDuration
    durNum: 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
    dots = 0;
    constructor(dur: TDuration) {
        this.dur = dur
        this.durNum = Number(this.dur)  as typeof this["durNum"]
    }
    clone() {
        const newInstance = new Duration(this.dur);
        newInstance.setDotsCount(this.dots);
        
        return newInstance
    }

    dot(limit?: number) {
        if (limit && (this.dots || 0) < limit) this.setDotsCount(this.dots+1);

        return this
    }
    setDotsCount(count: number) {
        this.dots = count
    }
    getFraction() {
        const dotsCoefficient =  Math.pow(1.5, this.dots) 
        return 1 / this.durNum * dotsCoefficient
    }
 
    isTimesOf(duration: Duration, times = 1) {
        return this.getFraction() / (duration.getFraction()) == times
    }
    static isTheSumWillBePointed(first: Duration, second: Duration) {
        return first.isTimesOf(second, 2) || second.isTimesOf(first, 2)
    }
    static getLonger(first: Duration, second: Duration) {
        return first.durNum < second.durNum ? first : second
    }
    isEqualTo(duration: Duration): boolean {
        // return this.durNum == duration.durNum
        return this.getFraction() == duration.getFraction()
        }
}


export type TDuration = '1' | '2' | '4' | '8' | '16' | '32' | '64' | '128'