import * as moment from "moment"


export type DelayedCallOptions = {
    time: moment.Moment,
    action: { (): void }
}

export type DelayedCallStatus = "pending" | "completed" | "dropped"

export class DelayedCall {

    public readonly time: moment.Moment
    public readonly action: { (): void }
    protected handle: NodeJS.Timeout
    protected _status: DelayedCallStatus

    constructor(options: DelayedCallOptions) {
        this.action = options.action
        this.time = options.time

        this.setTimeout()
    }

    drop() {
        if (this.status == "pending") {
            clearInterval(this.handle)
            this._status = "dropped"
        }
    }

    get status() {
        return this._status
    }

    protected setTimeout() {
        this._status = "pending"

        const delay = this.calcDelay()
        if (delay > 0) {
            this.handle = setTimeout(() => {
                this.complete()
            }, delay)
        } else {
            this.complete()
        }
    }

    protected complete() {
        this.action()
        this._status = "completed"
    }

    protected calcDelay(): number {
        const currentTime = moment()
        if (this.time.isBefore(currentTime)) {
            console.warn("Task executionTime is before current time")
            return 0
        }
        return this.time.diff(currentTime, "millisecond")
    }
}