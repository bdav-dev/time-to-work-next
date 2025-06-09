import { TimelineBlockColor, TimelineBlockColors } from "@/components/timeline/TimelineColors";

export type ScheduleBlockTimeTypeIdentifier = 'workTime' | 'breakTime';

export type ScheduleBlockTimeType = {
    identifier: ScheduleBlockTimeTypeIdentifier,
    timelineBlock: {
        title: string,
        color: TimelineBlockColor
    },
    segment: {
        displayAs: string,
        className: string
    }
};

export class ScheduleBlockTimeTypes {
    static readonly WORK: ScheduleBlockTimeType = {
        identifier: 'workTime',
        timelineBlock: {
            title: 'Arbeit',
            color: TimelineBlockColors.BLUE
        },
        segment: {
            displayAs: 'Arbeitszeit',
            className: 'text-blue-500 dark:text-blue-400',
        }
    }
    static readonly BREAK: ScheduleBlockTimeType = {
        identifier: 'breakTime',
        timelineBlock: {
            title: 'Pause',
            color: TimelineBlockColors.GREEN
        },
        segment: {
            displayAs: 'Pausenzeit',
            className: 'text-emerald-500 dark:text-emerald-400'
        }
    }

    static values() {
        return [this.WORK, this.BREAK];
    }

    static ofIdentifier(identifier: ScheduleBlockTimeTypeIdentifier) {
        return this.values().find(timeType => timeType.identifier === identifier)!;
    }

    static toggle(timeType: ScheduleBlockTimeType) {
        return timeType.identifier === 'workTime' ? this.BREAK : this.WORK;
    }

}
