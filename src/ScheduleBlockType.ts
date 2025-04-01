import { TimelineBlockColor, TimelineBlockColors } from "@/components/timeline/TimelineBlockColor";

export type ScheduleBlockTypeIdentifier = 'workTime' | 'breakTime';

export type ScheduleBlockType = {
    identifier: ScheduleBlockTypeIdentifier,
    timelineBlock: {
        title: string,
        color: TimelineBlockColor
    },
    segment: {
        displayAs: string,
        className: string
    }
};

export class ScheduleBlockTypes {
    static readonly WORK_TIME: ScheduleBlockType = {
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
    static readonly BREAK_TIME: ScheduleBlockType = {
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
        return [this.WORK_TIME, this.BREAK_TIME];
    }

    static ofIdentifier(identifier: ScheduleBlockTypeIdentifier) {
        return this.values().find(type => type.identifier === identifier)!;
    }
}
