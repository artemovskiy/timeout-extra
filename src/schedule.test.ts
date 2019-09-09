import moment = require("moment")
import {Schedule} from "./schedule"

const timeout = (delay: number) =>
    new Promise(resolve => setTimeout(resolve, delay))

describe("schedule", () => {

    test("should run scheduled actions", async () => {
        jest.setTimeout(15000)
        const log = []
        const schedule = new Schedule()
        const onTime = value => () => {
            log.push(value)
        }
        const now = moment()
        schedule.add({
            time: now.clone().add(6, "seconds"),
            action: onTime(1)
        })
        schedule.add({
            time: now.clone().add(4, "seconds"),
            action: onTime(2)
        })
        schedule.add({
            time: now,
            action: onTime(3)
        })
        await timeout(13000)
        expect(log).toMatchObject([3, 2, 1])
    })

    test("should retrieve nearest action time", async () => {
        const schedule = new Schedule()
        expect(schedule.nearestActionTime).toBe(null)
        const now = moment()
        const addSix = now.clone().add(6, "seconds")
        const addFour = now.clone().add(4, "seconds")
        schedule.add({
            time: addSix,
            action: jest.fn()
        })
        expect(schedule.nearestActionTime).toBe(addSix)
        schedule.add({
            time: now,
            action: jest.fn()
        })
        expect(schedule.nearestActionTime).toBe(now)
        schedule.add({
            time: addFour,
            action: jest.fn()
        })
        expect(schedule.nearestActionTime).toBe(now)
    })
})