export type AddScheduleBlockModeIdentifier = 'timeStamp' | 'timeInterval';

export type AddScheduleBlockMode = {
    identifier: AddScheduleBlockModeIdentifier,
    segment: {
        displayAs: string
    }
};

export class AddScheduleBlockModes {
    static readonly TIME_STAMP: AddScheduleBlockMode = {
        identifier: 'timeStamp',
        segment: {
            displayAs: 'Zeitstempel'
        }
    }
    static readonly TIME_INTERVAL: AddScheduleBlockMode = {
        identifier: 'timeInterval',
        segment: {
            displayAs: 'Zeitintervall'
        }
    }

    static values() {
        return [this.TIME_STAMP, this.TIME_INTERVAL];
    }

    static ofIdentifier(identifier: AddScheduleBlockModeIdentifier) {
        return this.values().find(type => type.identifier === identifier)!;
    }
}