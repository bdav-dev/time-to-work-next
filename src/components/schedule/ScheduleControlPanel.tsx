import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/primitives/control/Button";
import Elevation from "@/components/layout/Elevation";
import { useState } from "react";
import Time from "@/time/Time";
import TimeIntervalControl from "@/components/schedule/TimeIntervalControl";
import TimeStampControl from "@/components/schedule/TimeStampControl";
import { ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";
import ScheduleBlockTimeTypeSelect from "@/components/select/ScheduleBlockTimeTypeSelect";
import ScheduleBlockTypeSelect from "@/components/select/ScheduleBlockTypeSelect";
import useSchedule from "@/hooks/UseSchedule";
import useTime from "@/hooks/UseTime";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import useModifySchedule from "@/hooks/UseModifySchedule";


function createTimeStampStateHolder() {
    const [openOrCloseTime, setOpenOrCloseTime] = useState<Time>();
    const [useCurrentTimeAsOpenOrCloseTime, setUseCurrentTimeAsOpenOrCloseTime] = useState(true);
    return { openOrCloseTime, setOpenOrCloseTime, useCurrentTimeAsOpenOrCloseTime, setUseCurrentTimeAsOpenOrCloseTime };
}

function createTimeIntervalStateHolder() {
    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();
    return { startTime, setStartTime, endTime, setEndTime };
}

export default function ScheduleControlPanel() {
    const now = useTime();
    const { schedule } = useSchedule();
    const modifySchedule = useModifySchedule();

    const [selectedBlockType, setSelectedBlockType] = useState(ScheduleBlockTypes.TIME_STAMP);
    const [selectedBlockTimeType, setSelectedBlockTimeType] = useState(ScheduleBlockTimeTypes.WORK);

    const timeStampInput = createTimeStampStateHolder();
    const timeIntervalInput = createTimeIntervalStateHolder();

    const openTimeStampBlock = ScheduleCalculations.getOpenTimestamp(schedule);

    const isScheduleBlockTypeSegmentedControlDisabled = (
        !!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp'
    );

    const timeStamp = timeStampInput.useCurrentTimeAsOpenOrCloseTime ? now : timeStampInput.openOrCloseTime;

    const isButtonDisabled =
        (selectedBlockType.identifier == 'timeStamp' && timeStampInput.openOrCloseTime == undefined && !timeStampInput.useCurrentTimeAsOpenOrCloseTime) ||
        (selectedBlockType.identifier == 'timeInterval' && (!timeIntervalInput.startTime || !timeIntervalInput.endTime));

    const maskingScheduleBlockTimeType = (
        (!!openTimeStampBlock && selectedBlockType.identifier == 'timeStamp')
            ? openTimeStampBlock.timeType
            : undefined
    );

    function addTimeInterval() {
        const success = modifySchedule.addTimeInterval(timeIntervalInput.startTime, timeIntervalInput.endTime, selectedBlockTimeType);
        if (success) {
            timeIntervalInput.setStartTime(undefined);
            timeIntervalInput.setEndTime(undefined);
        }
    }

    function openAndCloseTimeStamp() {
        const timeType = ScheduleCalculations.getOpenTimestamp(schedule)?.timeType;
        if (!timeType) {
            throw new Error("Cannot find time type of open timestamp.");
        }

        const toggledTimeType = ScheduleBlockTimeTypes.toggle(timeType);
        const success = modifySchedule.closeAndOpenTimeStamp(timeStamp ?? now, toggledTimeType);

        if (success) {
            if (!timeStampInput.useCurrentTimeAsOpenOrCloseTime) {
                timeStampInput.setOpenOrCloseTime(undefined);
                timeStampInput.setUseCurrentTimeAsOpenOrCloseTime(true);
            }
            setSelectedBlockTimeType(toggledTimeType);
        }
    }

    function openOrCloseTimeStamp() {
        const success = (
            openTimeStampBlock
                ? modifySchedule.closeTimeStamp(timeStamp ?? now)
                : modifySchedule.openTimeStamp(timeStamp ?? now, selectedBlockTimeType)
        );

        if (success && !timeStampInput.useCurrentTimeAsOpenOrCloseTime) {
            timeStampInput.setOpenOrCloseTime(undefined);
            timeStampInput.setUseCurrentTimeAsOpenOrCloseTime(true);
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
                            openOrCloseTime={timeStampInput.useCurrentTimeAsOpenOrCloseTime ? now : timeStampInput.openOrCloseTime}
                            onOpenOrCloseTimeChange={timeStampInput.setOpenOrCloseTime}
                            useCurrentTimeAsOpenOrCloseTime={timeStampInput.useCurrentTimeAsOpenOrCloseTime}
                            onUseCurrentTimeAsOpenOrCloseTimeChange={timeStampInput.setUseCurrentTimeAsOpenOrCloseTime}
                            isTimePickerDisabled={timeStampInput.useCurrentTimeAsOpenOrCloseTime}
                            onRequestStamp={() => !isButtonDisabled && onButtonClick(false)}
                            className={'flex-1'}
                            getLatestEndTimeOfSchedule={() => ScheduleCalculations.getLatestEndTime(schedule)}
                        />
                        : <TimeIntervalControl
                            startTime={timeIntervalInput.startTime}
                            setStartTime={timeIntervalInput.setStartTime}
                            endTime={timeIntervalInput.endTime}
                            setEndTime={timeIntervalInput.setEndTime}
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
