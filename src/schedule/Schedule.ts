import Time from "@/time/Time";
import { Serialization } from "@/hooks/UseStateWithLocalStorage";
import { ScheduleBlockTime, ScheduleBlockTimeIdentifier, ScheduleBlockTimes } from "@/schedule/ScheduleBlockTime";

type ScheduleBlock = {
    startTime: Time,
    endTime?: Time,
    type: ScheduleBlockTime,
}

export type Schedule = ScheduleBlock[];

type SerializableSchedule = {
    startTime: string,
    endTime?: string,
    typeIdentifier: string
}[];

export const ScheduleSerialization: Serialization<Schedule> = {
    serialize: source => {
        return JSON.stringify(
            source.map(block => ({
                startTime: block.startTime.toString(),
                endTime: block.endTime?.toString() ?? undefined,
                typeIdentifier: block.type.identifier
            }))
        );
    },
    deserialize: target => {
        return (JSON.parse(target) as SerializableSchedule).map(block => ({
            startTime: Time.ofString(block.startTime),
            endTime: block.endTime ? Time.ofString(block.endTime) : undefined,
            type: ScheduleBlockTimes.ofIdentifier(block.typeIdentifier as ScheduleBlockTimeIdentifier)
        }));
    }
}
