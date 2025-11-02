import { describe, it } from "node:test";
import assert from "node:assert";
import { Schedule } from "@/schedule/Schedule";
import { ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import Time from "@/time/Time";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";


describe('hasOpenWorkTimeStamp', () => {

    it('should return true when open work time stamp is present', () => {
        const schedule: Schedule = [
            {
                timeType: ScheduleBlockTimeTypes.WORK,
                startTime: Time.ofString("08:00"),
                endTime: Time.ofString("09:00"),
            },
            {
                timeType: ScheduleBlockTimeTypes.WORK,
                startTime: Time.ofString("09:00")
            }
        ]

        assert.strictEqual(ScheduleCalculations.hasOpenWorkTimeStamp(schedule), true);
    });

    it('should return false when open break time stamp is present', () => {
        const schedule: Schedule = [
            {
                timeType: ScheduleBlockTimeTypes.WORK,
                startTime: Time.ofString("08:00"),
                endTime: Time.ofString("09:00"),
            },
            {
                timeType: ScheduleBlockTimeTypes.BREAK,
                startTime: Time.ofString("09:00")
            }
        ]

        assert.strictEqual(ScheduleCalculations.hasOpenWorkTimeStamp(schedule), false);
    });

    it('should return false when no time stamp is present', () => {
        const schedule: Schedule = [
            {
                timeType: ScheduleBlockTimeTypes.WORK,
                startTime: Time.ofString("08:00"),
                endTime: Time.ofString("09:00"),
            }
        ]

        assert.strictEqual(ScheduleCalculations.hasOpenWorkTimeStamp(schedule), false);
    });

});

