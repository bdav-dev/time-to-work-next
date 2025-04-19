import Time from "@/time/Time";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypeIdentifier, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { TimelineData } from "@/components/timeline/Timeline";
import { createJsonSerialization, Serialization } from "@/serialization/Serialization";

export type ScheduleBlock = {
    startTime: Time,
    endTime?: Time,
    timeType: ScheduleBlockTimeType
}

export type Schedule = ScheduleBlock[];

export function scheduleBlockEquals(a: ScheduleBlock | undefined, b: ScheduleBlock | undefined) {
    if (!a || !b) {
        return false;
    }

    const endTimeEquals = (
        a.endTime && b.endTime
            ? a.endTime.equals(b.endTime)
            : !a.endTime && !b.endTime
    );

    return (
        endTimeEquals &&
        a.startTime.equals(b.startTime) &&
        a.timeType.identifier === b.timeType.identifier
    );
}

export type ScheduleToTimelineDataMapOptions = {
    onClick?: (block: ScheduleBlock) => void,
    className?: (block: ScheduleBlock) => string
}

export function mapScheduleToTimelineData(schedule: Schedule, options?: ScheduleToTimelineDataMapOptions): TimelineData[] {
    return schedule.map(
        scheduleBlock => ({
            startTime: scheduleBlock.startTime,
            endTime: scheduleBlock.endTime,
            color: scheduleBlock.timeType.timelineBlock.color,
            title: scheduleBlock.timeType.timelineBlock.title,
            onClick: options?.onClick ? () => options?.onClick?.(scheduleBlock) : undefined,
            className: options?.className?.(scheduleBlock)
        })
    );
}

export const ScheduleSerialization: Serialization<Schedule> = createJsonSerialization({
    serialize: source => (
        source.map(block => ({
            startTime: block.startTime.toString(),
            endTime: block.endTime?.toString() ?? undefined,
            timeTypeIdentifier: block.timeType.identifier
        }))
    ),
    deserialize: target => (
        target.map(block => ({
            startTime: Time.ofString(block.startTime),
            endTime: block.endTime ? Time.ofString(block.endTime) : undefined,
            timeType: ScheduleBlockTimeTypes.ofIdentifier(block.timeTypeIdentifier as ScheduleBlockTimeTypeIdentifier)
        }))
    )
});
