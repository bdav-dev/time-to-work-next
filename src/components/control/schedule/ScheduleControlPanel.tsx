import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/primitives/control/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useState } from "react";
import Time from "@/time/Time";
import AddTimeInterval from "@/components/control/schedule/AddTimeInterval";
import TimeStampInfo from "@/components/control/schedule/TimeStampInfo";
import { ScheduleBlockTimeType, ScheduleBlockTimeTypes } from "@/schedule/ScheduleBlockTimeType";
import { ScheduleBlockType, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import ScheduleBlockTimeTypeSelect from "@/components/control/select/ScheduleBlockTimeTypeSelect";
import ScheduleBlockTypeSelect from "@/components/control/select/ScheduleBlockTypeSelect";
import useSchedule from "@/hooks/UseSchedule";


type ScheduleControlPanelProps = {
    onAddTimeIntervalRequest?: (startTime: Time | undefined, endTime: Time | undefined, timeType: ScheduleBlockTimeType) => boolean,
    onOpenTimeStampRequest?: (timeType: ScheduleBlockTimeType, openTimeStampAt?: Time) => void,
    onCloseTimeStampRequest?: (closeTimeStampAt?: Time) => void
}

export default function ScheduleControlPanel(props: ScheduleControlPanelProps) {
    const [schedule] = useSchedule();

    const [selectedScheduleBlockType, setSelectedScheduleBlockType] = useState<ScheduleBlockType>(ScheduleBlockTypes.TIME_STAMP);
    const [selectedScheduleBlockTimeType, setSelectedScheduleBlockTimeType] = useState<ScheduleBlockTimeType>(ScheduleBlockTimeTypes.WORK);

    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();

    const openTimeStamp = ScheduleOperations.getOpenTimestamp(schedule);

    const isScheduleBlockTypeSegmentedControlDisabled = (
        !!openTimeStamp && selectedScheduleBlockType.identifier == 'timeStamp'
    );
    const isButtonDisabled = selectedScheduleBlockType.identifier == 'timeInterval' && !startTime && !endTime;

    const maskingScheduleBlockTimeType = (
        (!!openTimeStamp && selectedScheduleBlockType.identifier == 'timeStamp')
            ? openTimeStamp.timeType
            : undefined
    );

    const buttonText = (
        selectedScheduleBlockType.identifier == 'timeInterval'
            ? 'Hinzufügen'
            : openTimeStamp ? 'Zeitstempel schließen' : 'Zeitstempel öffnen'
    );

    function onButtonClick() {
        const time = selectedScheduleBlockTimeType;

        if (selectedScheduleBlockType.identifier == 'timeInterval') {
            if (startTime && !endTime) {
                props.onOpenTimeStampRequest?.(time, startTime);
                return;
            }

            if (!startTime && endTime) {
                props.onCloseTimeStampRequest?.(endTime);
                return;
            }

            if (!props.onAddTimeIntervalRequest) {
                return;
            }

            const success = props.onAddTimeIntervalRequest?.(startTime, endTime, time);
            if (success) {
                setStartTime(undefined);
                setEndTime(undefined);
            }

        } else if (selectedScheduleBlockType.identifier == 'timeStamp') {
            if (openTimeStamp) {
                props.onCloseTimeStampRequest?.();
            } else {
                props.onOpenTimeStampRequest?.(time);
            }
        }
    }

    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'p-2.5 flex'}>
                <ScheduleBlockTypeSelect
                    value={selectedScheduleBlockType}
                    onValueChange={setSelectedScheduleBlockType}
                />
            </div>

            <HorizontalRuler/>

            <div className={'p-3 min-h-32 flex items-center'}>
                {
                    selectedScheduleBlockType.identifier == 'timeStamp'
                        ? <TimeStampInfo className={'flex-1'} openTimeStamp={openTimeStamp?.startTime ?? undefined}/>
                        : <AddTimeInterval
                            className={'flex-1'}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            endTime={endTime}
                            setEndTime={setEndTime}
                            onRequestAdd={() => !isButtonDisabled && onButtonClick()}
                        />
                }
            </div>

            <HorizontalRuler/>

            <div className={'p-3 flex sm:flex-row flex-col items-center'}>
                <ScheduleBlockTimeTypeSelect
                    value={maskingScheduleBlockTimeType ?? selectedScheduleBlockTimeType}
                    onValueChange={setSelectedScheduleBlockTimeType}
                    disabled={isScheduleBlockTypeSegmentedControlDisabled}
                />

                <Button
                    className={'min-w-56'}
                    onClick={onButtonClick}
                    disabled={isButtonDisabled}
                >
                    {buttonText}
                </Button>
            </div>

        </Elevation>
    );
}

