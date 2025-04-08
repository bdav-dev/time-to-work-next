import Time from "@/time/Time";
import { Serialization } from "@/hooks/UseStateWithLocalStorage";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypeIdentifier, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { TimelineData } from "@/components/timeline/Timeline";

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

export function mapScheduleToTimelineData(
    schedule: Schedule,
    options?: {
        onClick?: (block: ScheduleBlock) => void,
        className?: (block: ScheduleBlock) => string
    }
): TimelineData[] {
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


type SerializableSchedule = {
    startTime: string,
    endTime?: string,
    timeTypeIdentifier: string
}[];

export const ScheduleSerialization: Serialization<Schedule> = {
    serialize: source => {
        return JSON.stringify(
            source.map(block => ({
                startTime: block.startTime.toString(),
                endTime: block.endTime?.toString() ?? undefined,
                timeTypeIdentifier: block.timeType.identifier
            }))
        );
    },
    deserialize: target => {
        return (JSON.parse(target) as SerializableSchedule).map(block => ({
            startTime: Time.ofString(block.startTime),
            endTime: block.endTime ? Time.ofString(block.endTime) : undefined,
            timeType: ScheduleBlockTimeTypes.ofIdentifier(block.timeTypeIdentifier as ScheduleBlockTimeTypeIdentifier)
        }));
    }
}
