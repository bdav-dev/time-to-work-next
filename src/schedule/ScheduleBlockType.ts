export type ScheduleBlockTypeIdentifier = 'timeStamp' | 'timeInterval';

export type ScheduleBlockType = {
    identifier: ScheduleBlockTypeIdentifier,
    segment: {
        displayAs: string
    }
};

export class ScheduleBlockTypes {
    static readonly TIME_STAMP: ScheduleBlockType = {
        identifier: 'timeStamp',
        segment: {
            displayAs: 'Zeitstempel'
        }
    }
    static readonly TIME_INTERVAL: ScheduleBlockType = {
        identifier: 'timeInterval',
        segment: {
            displayAs: 'Zeitintervall'
        }
    }

    static values() {
        return [this.TIME_STAMP, this.TIME_INTERVAL];
    }

    static ofIdentifier(identifier: ScheduleBlockTypeIdentifier) {
        return this.values().find(type => type.identifier === identifier)!;
    }
}
