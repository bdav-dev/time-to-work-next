import { Schedule } from "@/schedule/Schedule";


export default class ScheduleOperations {
    private constructor() {}


    static getOpenTimestamp(schedule: Schedule) {
        for (const block of schedule) {
            if (!block.endTime) {
                return block;
            }
        }

        return null;
    }

}