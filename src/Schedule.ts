import Time from "@/time/Time";
import { Serialization } from "@/hooks/UseStateWithLocalStorage";
import { ScheduleBlockType, ScheduleBlockTypeIdentifier, ScheduleBlockTypes } from "@/ScheduleBlockType";

type ScheduleBlock = {
    startTime: Time,
    endTime?: Time,
    type: ScheduleBlockType,
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
            type: ScheduleBlockTypes.ofIdentifier(block.typeIdentifier as ScheduleBlockTypeIdentifier)
        }));
    }
}

export function getOpenTimestamp(workTime: Schedule) {
    for (const block of workTime) {
        if (!block.endTime) {
            return block;
        }
    }

    return null;
}

export function closeTimeStamp() {

}