import { TimelineBlockColor, TimelineBlockColors } from "@/components/timeline/TimelineBlockColor";

export type ScheduleBlockTimeIdentifier = 'workTime' | 'breakTime';

export type ScheduleBlockTime = {
    identifier: ScheduleBlockTimeIdentifier,
    timelineBlock: {
        title: string,
        color: TimelineBlockColor
    },
    segment: {
        displayAs: string,
        className: string
    }
};

export class ScheduleBlockTimes {
    static readonly WORK: ScheduleBlockTime = {
        identifier: 'workTime',
        timelineBlock: {
            title: 'Arbeit',
            color: TimelineBlockColors.BLUE,
        },
        segment: {
            displayAs: 'Arbeitszeit',
            className: 'text-blue-500 dark:text-blue-400',
        }
    }
    static readonly BREAK: ScheduleBlockTime = {
        identifier: 'breakTime',
        timelineBlock: {
            title: 'Pause',
            color: TimelineBlockColors.GREEN,
        },
        segment: {
            displayAs: 'Pausenzeit',
            className: 'text-emerald-500 dark:text-emerald-400'
        }
    }

    static values() {
        return [this.WORK, this.BREAK];
    }

    static ofIdentifier(identifier: ScheduleBlockTimeIdentifier) {
        return this.values().find(type => type.identifier === identifier)!;
    }
}
