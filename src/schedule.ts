import * as moment from "moment"
import {DelayedCall, DelayedCallOptions} from "./delayed-call"

export class Schedule {

    protected _calls: DelayedCall[] = []
    protected _nearestActionTime: moment.Moment | null = null

    add(options: DelayedCallOptions) {
        const call = new DelayedCall(options)
        if (!this._nearestActionTime || call.time.isBefore(this._nearestActionTime)) {
            this._nearestActionTime = call.time
        }
        this._calls.push(call)
    }

    get nearestActionTime() {
        return this._nearestActionTime
    }

    get calls() {
        return [...this._calls]
    }

}