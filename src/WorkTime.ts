import Time from "@/time/Time";
import { Serialization } from "@/hooks/UseStateWithLocalStorage";

type TimeBlock = {
    startTime: Time,
    endTime?: Time,
    type: 'work' | 'break',
}

export type WorkTime = TimeBlock[];

export type SerializableWorkTime = {
    startTime: string,
    endTime?: string,
    type: 'work' | 'break'
}[];

export const WorkTimeSerialization: Serialization<WorkTime> = {
    serialize: source => {
        return JSON.stringify(
            source.map(it => (
                {
                    startTime: it.startTime.toString(),
                    endTime: it.endTime?.toString() ?? undefined,
                    type: it.type
                }
            ))
        );
    },
    deserialize: target => {
        return (JSON.parse(target) as SerializableWorkTime).map(it => (
            {
                startTime: Time.ofString(it.startTime),
                endTime: it.endTime ? Time.ofString(it.endTime) : undefined,
                type: it.type
            }
        ));
    }
}

export function getOpenTimestamp(workTime: WorkTime) {
    for (const block of workTime) {
        if (!block.endTime) {
            return block;
        }
    }

    return null;
}

export function closeTimeStamp() {

}