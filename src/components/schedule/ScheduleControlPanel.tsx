import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/primitives/control/Button";
import Elevation from "@/components/layout/Elevation";
import { useState } from "react";
import Time from "@/time/Time";
import TimeIntervalControl from "@/components/schedule/TimeIntervalControl";
import TimeStampControl from "@/components/schedule/TimeStampControl";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { ScheduleBlockType, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import ScheduleBlockTimeTypeSelect from "@/components/select/ScheduleBlockTimeTypeSelect";
import ScheduleBlockTypeSelect from "@/components/select/ScheduleBlockTypeSelect";
import { Schedule } from "@/schedule/Schedule";
import TimeInterval from "@/time/TimeInterval";
import { DisplayableError } from "@/error/DisplayableError";
import useSchedule from "@/hooks/UseSchedule";
import { Message } from "@/contexts/MessageContext";
import useTime from "@/hooks/UseTime";
import useMessaging from "@/hooks/UseMessaging";


export default function ScheduleControlPanel() {
    const now = useTime();
    const { schedule, setSchedule } = useSchedule();
    const { set: setMessage } = useMessaging();

    const context: ScheduleModificationContext = { now, schedule, setSchedule, setMessage };

    const [selectedBlockType, setSelectedBlockType] = useState<ScheduleBlockType>(ScheduleBlockTypes.TIME_STAMP);
    const [selectedBlockTimeType, setSelectedBlockTimeType] = useState<ScheduleBlockTimeType>(ScheduleBlockTimeTypes.WORK);

    const timeInterval = (() => {
        const [startTime, setStartTime] = useState<Time>();
        const [endTime, setEndTime] = useState<Time>();
        return { startTime, setStartTime, endTime, setEndTime };
    })();
    const timeStamp = (() => {
        const [openOrCloseTime, setOpenOrCloseTime] = useState<Time>();
        const [useCurrentTimeAsOpenOrCloseTime, setUseCurrentTimeAsOpenOrCloseTime] = useState<boolean>(true);
        return { openOrCloseTime, setOpenOrCloseTime, useCurrentTimeAsOpenOrCloseTime, setUseCurrentTimeAsOpenOrCloseTime };
    })();

    const openTimeStampBlock = ScheduleOperations.getOpenTimestamp(schedule);

    const isScheduleBlockTypeSegmentedControlDisabled = (
        !!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp'
    );
    const isButtonDisabled = selectedBlockType.identifier == 'timeInterval' && (!timeInterval.startTime || !timeInterval.endTime);

    const maskingScheduleBlockTimeType = (
        (!!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp')
            ? openTimeStampBlock.timeType
            : undefined
    );

    function onButtonClick() {
        const timeType = selectedBlockTimeType;

        if (selectedBlockType.identifier == 'timeInterval') {
            const success = addTimeInterval(timeInterval.startTime, timeInterval.endTime, timeType, context);
            if (success) {
                timeInterval.setStartTime(undefined);
                timeInterval.setEndTime(undefined);
            }

        } else if (selectedBlockType.identifier == 'timeStamp') {
            const success = (
                openTimeStampBlock
                    ? closeTimeStamp(timeStamp.openOrCloseTime ?? now, context)
                    : openTimeStamp(timeType, timeStamp.openOrCloseTime ?? now, context)
            );

            if (success && !timeStamp.useCurrentTimeAsOpenOrCloseTime) {
                timeStamp.setOpenOrCloseTime(undefined);
            }
        }
    }

    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'p-2.5 flex'}>
                <ScheduleBlockTypeSelect
                    value={selectedBlockType}
                    onValueChange={setSelectedBlockType}
                />
            </div>

            <HorizontalRuler/>

            <div className={'p-3 min-h-32 flex items-center'}>
                {
                    selectedBlockType.identifier == 'timeStamp'
                        ? <TimeStampControl
                            currentTime={now}
                            openTimeStamp={openTimeStampBlock?.startTime}
                            openOrCloseTime={timeStamp.useCurrentTimeAsOpenOrCloseTime ? now : timeStamp.openOrCloseTime}
                            onOpenOrCloseTimeChange={timeStamp.setOpenOrCloseTime}
                            useCurrentTimeAsOpenOrCloseTime={timeStamp.useCurrentTimeAsOpenOrCloseTime}
                            onUseCurrentTimeAsOpenOrCloseTimeChange={timeStamp.setUseCurrentTimeAsOpenOrCloseTime}
                            isTimePickerDisabled={timeStamp.useCurrentTimeAsOpenOrCloseTime}
                            onRequestStamp={() => !isButtonDisabled && onButtonClick()}
                            className={'flex-1'}
                        />
                        : <TimeIntervalControl
                            startTime={timeInterval.startTime}
                            setStartTime={timeInterval.setStartTime}
                            endTime={timeInterval.endTime}
                            setEndTime={timeInterval.setEndTime}
                            onRequestAdd={() => !isButtonDisabled && onButtonClick()}
                            className={'flex-1'}
                        />
                }
            </div>

            <HorizontalRuler/>

            <div className={'p-3 flex sm:flex-row flex-col items-center'}>
                <ScheduleBlockTimeTypeSelect
                    value={maskingScheduleBlockTimeType ?? selectedBlockTimeType}
                    onValueChange={setSelectedBlockTimeType}
                    disabled={isScheduleBlockTypeSegmentedControlDisabled}
                />

                <Button
                    className={'min-w-56'}
                    onClick={onButtonClick}
                    disabled={isButtonDisabled}
                >
                    {
                        selectedBlockType.identifier == 'timeInterval'
                            ? 'Hinzufügen'
                            : openTimeStampBlock ? 'Zeitstempel schließen' : 'Zeitstempel öffnen'
                    }
                </Button>
            </div>

        </Elevation>
    );
}

function addTimeInterval(
    startTime: Time | undefined,
    endTime: Time | undefined,
    time: ScheduleBlockTimeType,
    context: ScheduleModificationContext
): boolean {
    if (!startTime || !endTime) {
        context.setMessage(
            createTimeIntervalErrorMessage('Das Start- oder Endfeld ist leer.')
        );
        return false;
    }

    let timeInterval: TimeInterval;
    try {
        timeInterval = TimeInterval.of(startTime, endTime)
    } catch (ignored) {
        context.setMessage(
            createTimeIntervalErrorMessage('Die Endzeit des Zeitintervalls darf nicht vor der Startzeit liegen.')
        );
        return false;
    }

    let newSchedule: Schedule;
    try {
        newSchedule = ScheduleOperations.addTimeInterval(context.schedule, context.now, timeInterval, time);
    } catch (error) {
        context.setMessage(
            error instanceof DisplayableError
                ? createTimeIntervalErrorMessage(error.message, error.messageRetentionInSeconds)
                : createTimeIntervalErrorMessage(DisplayableError.unknown().message)
        );
        return false;
    }

    context.setSchedule(newSchedule);

    return true;
}

function openTimeStamp(time: ScheduleBlockTimeType, openTimeStampAt: Time, context: ScheduleModificationContext): boolean {
    let newSchedule: Schedule;
    try {
        newSchedule = ScheduleOperations.openTimeStamp(context.schedule, openTimeStampAt, context.now, time);
    } catch (error) {
        context.setMessage(
            error instanceof DisplayableError
                ? createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                : createTimeStampErrorMessage(DisplayableError.unknown().message)
        );
        return false;
    }

    context.setSchedule(newSchedule);
    return true;
}

function closeTimeStamp(closeTimeStampAt: Time, context: ScheduleModificationContext): boolean {
    let newSchedule: Schedule;

    try {
        newSchedule = ScheduleOperations.closeTimeStamp(context.schedule, closeTimeStampAt, context.now);
    } catch (error) {
        context.setMessage(
            error instanceof DisplayableError
                ? createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                : createTimeStampErrorMessage(DisplayableError.unknown().message)
        );
        return false;
    }

    context.setSchedule(newSchedule);
    return true;
}


const createTimeIntervalErrorMessage: (body: string, retentionInSeconds?: number) => Message = (
    (body, retentionInSeconds) => ({
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Hinzufügen',
        type: 'error'
    })
);

const createTimeStampErrorMessage: (body: string, retentionInSeconds?: number) => Message = (
    (body, retentionInSeconds) => ({
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Stempeln',
        type: 'error'
    })
);

type ScheduleModificationContext = {
    now: Time,
    schedule: Schedule,
    setSchedule: (schedule: Schedule) => void,
    setMessage: (message: Message) => void
}
