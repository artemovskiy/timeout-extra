import {DelayedCall} from "./delayed-call"

jest.mock("moment")

const momentMock: jest.Mocked<typeof moment> = require("moment")

const moment = jest.requireActual("moment")

jest.useFakeTimers()

describe("createTask", () => {

    test("should calculate delay and set timeout", () => {
        const currentTime = moment()
        const delay = 100
        const time = currentTime.clone().add(delay, "millisecond")
        const action = jest.fn()
        momentMock.mockReturnValueOnce(currentTime)
        const call = new DelayedCall({action, time})
        expect(call.status).toBe("pending")

        // @ts-ignore
        expect(setTimeout.mock.calls[0][1]).toBe(delay)
        jest.advanceTimersByTime(delay)
        expect(action).toBeCalled()
        expect(call.status).toBe("completed")
    })

    test("should call action instantly if time if before current time ", () => {
        const currentTime = moment()
        const delay = 100
        const time = currentTime.clone().subtract(delay, "millisecond")
        const action = jest.fn()
        momentMock.mockReturnValueOnce(currentTime)
        const call = new DelayedCall({action, time})
        expect(call.status).toBe("completed")
        expect(action).toBeCalled()
    })

    test("should drop should cancel action call ", () => {
        const currentTime = moment()
        const delay = 100
        const time = currentTime.clone().add(delay, "millisecond")
        const action = jest.fn()
        momentMock.mockReturnValueOnce(currentTime)
        const call = new DelayedCall({action, time})
        expect(call.status).toBe("pending")
        call.drop()
        expect(call.status).toBe("dropped")
        expect(action).not.toBeCalled()
        jest.advanceTimersByTime(delay)
        expect(action).not.toBeCalled()
    })
})