import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/primitives/control/Button";
import Elevation from "@/components/layout/Elevation";
import { useState } from "react";
import Time from "@/time/Time";
import TimeIntervalControl from "@/components/schedule/TimeIntervalControl";
import TimeStampControl from "@/components/schedule/TimeStampControl";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { ScheduleBlockType, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";
import ScheduleBlockTimeTypeSelect from "@/components/select/ScheduleBlockTimeTypeSelect";
import ScheduleBlockTypeSelect from "@/components/select/ScheduleBlockTypeSelect";
import useSchedule from "@/hooks/UseSchedule";
import useTime from "@/hooks/UseTime";
import useMessaging from "@/hooks/UseMessaging";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import { ModifySchedule } from "@/schedule/ModifySchedule";


export default function ScheduleControlPanel() {
    const now = useTime();
    const { schedule, setSchedule } = useSchedule();
    const { set: setMessage } = useMessaging();

    const modifySchedule = ModifySchedule.withContext({ now, schedule, setSchedule, setMessage });

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

    const openTimeStampBlock = ScheduleCalculations.getOpenTimestamp(schedule);

    const isScheduleBlockTypeSegmentedControlDisabled = (
        !!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp'
    );
    const isButtonDisabled = selectedBlockType.identifier == 'timeInterval' && (!timeInterval.startTime || !timeInterval.endTime);

    const maskingScheduleBlockTimeType = (
        (!!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp')
            ? openTimeStampBlock.timeType
            : undefined
    );

    function addTimeInterval() {
        const success = modifySchedule.addTimeInterval(timeInterval.startTime, timeInterval.endTime, selectedBlockTimeType);
        if (success) {
            timeInterval.setStartTime(undefined);
            timeInterval.setEndTime(undefined);
        }
    }

    function openAndCloseTimeStamp() {
        const timeType = ScheduleCalculations.getOpenTimestamp(schedule)?.timeType;
        if (!timeType) {
            throw new Error("Cannot find time type of open timestamp.");
        }

        const toggledTimeType = ScheduleBlockTimeTypes.toggle(timeType);
        const success = modifySchedule.closeAndOpenTimeStamp(timeStamp.openOrCloseTime ?? now, toggledTimeType);

        if (success) {
            if (!timeStamp.useCurrentTimeAsOpenOrCloseTime) {
                timeStamp.setOpenOrCloseTime(undefined);
            }
            setSelectedBlockTimeType(toggledTimeType);
        }
    }

    function openOrCloseTimeStamp() {
        const success = (
            openTimeStampBlock
                ? modifySchedule.closeTimeStamp(timeStamp.openOrCloseTime ?? now)
                : modifySchedule.openTimeStamp(timeStamp.openOrCloseTime ?? now, selectedBlockTimeType)
        );

        if (success && !timeStamp.useCurrentTimeAsOpenOrCloseTime) {
            timeStamp.setOpenOrCloseTime(undefined);
        }
    }

    function onButtonClick(shiftKeyPressed: boolean) {
        if (selectedBlockType.identifier == 'timeInterval') {
            addTimeInterval();
        } else if (selectedBlockType.identifier == 'timeStamp') {
            if (openTimeStampBlock && shiftKeyPressed) {
                openAndCloseTimeStamp();
            } else {
                openOrCloseTimeStamp();
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
                            onRequestStamp={() => !isButtonDisabled && onButtonClick(false)}
                            className={'flex-1'}
                            getLatestEndTimeOfSchedule={() => ScheduleCalculations.getLatestEndTime(schedule)}
                        />
                        : <TimeIntervalControl
                            startTime={timeInterval.startTime}
                            setStartTime={timeInterval.setStartTime}
                            endTime={timeInterval.endTime}
                            setEndTime={timeInterval.setEndTime}
                            onRequestAdd={() => !isButtonDisabled && onButtonClick(false)}
                            className={'flex-1'}
                            getLatestEndTimeOfSchedule={() => ScheduleCalculations.getLatestEndTime(schedule)}
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
                    onClick={event => onButtonClick(event.shiftKey)}
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
