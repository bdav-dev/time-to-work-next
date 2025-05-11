import Time from "@/time/Time";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypeIdentifier, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { TimelineData } from "@/components/timeline/Timeline";
import { createSerialization, Serialization } from "@/serialization/Serialization";
import { DisplayableError } from "@/error/DisplayableError";

export type ScheduleBlock = {
    startTime: Time,
    endTime?: Time,
    timeType: ScheduleBlockTimeType
}

export type Schedule = ScheduleBlock[];

export type ScheduleModificationResult = {
    submissionSchedule?: Schedule,
    error?: DisplayableError,
    timeline: {
        previewSchedule: Schedule,
        highlightBlock?: ScheduleBlock
    },
};

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

export function highlightBlock(highlightBlock: ScheduleBlock, isErroneous?: boolean) {
    return (block: ScheduleBlock) => (
        scheduleBlockEquals(block, highlightBlock) ? `${isErroneous && 'border-2 border-red-500'}` : 'opacity-40'
    );
}

export const ScheduleSerialization: Serialization<Schedule> = createSerialization({
    encode: source => (
        source.map(block => ({
            startTime: block.startTime.toString(),
            endTime: block.endTime?.toString() ?? undefined,
            timeTypeIdentifier: block.timeType.identifier
        }))
    ),
    decode: target => (
        target.map(block => ({
            startTime: Time.ofString(block.startTime),
            endTime: block.endTime ? Time.ofString(block.endTime) : undefined,
            timeType: ScheduleBlockTimeTypes.ofIdentifier(block.timeTypeIdentifier as ScheduleBlockTimeTypeIdentifier)
        }))
    )
});
