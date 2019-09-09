import {DelayedCall, DelayedCallOptions} from "./delayed-call"

export const holdOn = (options: DelayedCallOptions) =>
    new DelayedCall(options)