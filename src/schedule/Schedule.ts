import Time from "@/time/Time";
import { Serialization } from "@/hooks/UseStateWithLocalStorage";
import { ScheduleBlockTime, ScheduleBlockTimeIdentifier, ScheduleBlockTimes } from "@/schedule/ScheduleBlockTime";
import { TimelineData } from "@/components/timeline/Timeline";

export type ScheduleBlock = {
    startTime: Time,
    endTime?: Time,
    time: ScheduleBlockTime
}

export type Schedule = ScheduleBlock[];

export function scheduleBlockEquals(a: ScheduleBlock, b: ScheduleBlock) {
    const endTimeEquals = (
        a.endTime && b.endTime
            ? a.endTime.equals(b.endTime)
            : !a.startTime && !b.startTime
    );

    return (
        endTimeEquals &&
        a.startTime.equals(b.startTime) &&
        a.time.identifier === b.time.identifier
    );
}

export function mapScheduleToTimelineData(schedule: Schedule, options?: { onClick?: (block: ScheduleBlock) => void, className?: (block: ScheduleBlock) => string }): TimelineData[] {
    return schedule.map(
        scheduleBlock => ({
            startTime: scheduleBlock.startTime,
            endTime: scheduleBlock.endTime,
            color: scheduleBlock.time.timelineBlock.color,
            title: scheduleBlock.time.timelineBlock.title,
            onClick: options?.onClick ? () => options?.onClick?.(scheduleBlock) : undefined,
            className: options?.className?.(scheduleBlock)
        })
    );
}


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
                typeIdentifier: block.time.identifier
            }))
        );
    },
    deserialize: target => {
        return (JSON.parse(target) as SerializableSchedule).map(block => ({
            startTime: Time.ofString(block.startTime),
            endTime: block.endTime ? Time.ofString(block.endTime) : undefined,
            time: ScheduleBlockTimes.ofIdentifier(block.typeIdentifier as ScheduleBlockTimeIdentifier)
        }));
    }
}
