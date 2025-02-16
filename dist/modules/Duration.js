"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Duration {
    constructor(dur) {
        this.dots = 0;
        this.dur = dur;
        this.durNum = Number(this.dur);
    }
    clone() {
        const newInstance = new Duration(this.dur);
        newInstance.setDotsCount(this.dots);
        return newInstance;
    }
    dot(limit) {
        if (limit && (this.dots || 0) < limit)
            this.setDotsCount(this.dots + 1);
        return this;
    }
    setDotsCount(count) {
        this.dots = count;
    }
    getFraction() {
        const dotsCoefficient = Math.pow(1.5, this.dots);
        return 1 / this.durNum * dotsCoefficient;
    }
    isTimesOf(duration, times = 1) {
        return this.getFraction() / (duration.getFraction()) == times;
    }
    static isTheSumWillBePointed(first, second) {
        return first.isTimesOf(second, 2) || second.isTimesOf(first, 2);
    }
    static getLonger(first, second) {
        return first.durNum < second.durNum ? first : second;
    }
    isEqualTo(duration) {
        // return this.durNum == duration.durNum
        return this.getFraction() == duration.getFraction();
    }
}
exports.default = Duration;
