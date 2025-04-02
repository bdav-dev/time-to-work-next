import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/control/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useState } from "react";
import Time from "@/time/Time";
import AddTimeInterval from "@/components/AddTimeInterval";
import TimeStampInfo from "@/components/TimeStampInfo";
import { Schedule } from "@/schedule/Schedule";
import { ScheduleBlockTime, ScheduleBlockTimeIdentifier, ScheduleBlockTimes } from "@/schedule/ScheduleBlockTime";
import { ScheduleBlockType, ScheduleBlockTypeIdentifier, ScheduleBlockTypes } from "@/schedule/ScheduleBlockType";
import ScheduleOperations from "@/schedule/ScheduleOperations";


type ScheduleControlPanelProps = {
    schedule: Schedule,
    onAddTimeIntervalRequest?: (startTime: Time | undefined, endTime: Time | undefined, time: ScheduleBlockTime) => boolean,
    onOpenTimeStampRequest?: (time: ScheduleBlockTime, openTimeStampAt?: Time) => void,
    onCloseTimeStampRequest?: (closeTimeStampAt?: Time) => void
}

export default function ScheduleControlPanel(props: ScheduleControlPanelProps) {
    const [selectedScheduleBlockTypeSegment, setSelectedScheduleBlockTypeSegment] = useState<Segment<ScheduleBlockType>>(ScheduleBlockTypeSegments.timeStamp);
    const [selectedScheduleBlockTimeSegment, setSelectedScheduleBlockTimeSegment] = useState<Segment<ScheduleBlockTime>>(ScheduleBlockTimeSegments.workTime);

    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();

    const isScheduleBlockTypeSegmentSelected = (type: ScheduleBlockType) => selectedScheduleBlockTypeSegment.value.identifier == type.identifier;

    const openTimeStamp = ScheduleOperations.getOpenTimestamp(props.schedule);
    const isScheduleBlockTypeSegmentedControlDisabled = !!openTimeStamp && isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_STAMP);
    const maskingScheduleBlockTimeSegment = (
        (!!openTimeStamp && isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_STAMP))
            ? ScheduleBlockTimeSegments[openTimeStamp.time.identifier]
            : undefined
    );

    const buttonText = (
        isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_INTERVAL)
            ? 'Hinzufügen'
            : openTimeStamp ? 'Zeitstempel schließen' : 'Zeitstempel öffnen'
    );

    function onButtonClick() {
        const time = selectedScheduleBlockTimeSegment.value;

        if (isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_INTERVAL)) {
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

        } else if (isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_STAMP)) {
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
                <SegmentedControls
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    orientation={'horizontal'}
                    segments={Object.values(ScheduleBlockTypeSegments)}
                    selection={selectedScheduleBlockTypeSegment}
                    onSelectionChange={selected => setSelectedScheduleBlockTypeSegment(selected!)}
                    deselectable={false}
                    widthFull
                    roundedFull
                />
            </div>

            <HorizontalRuler/>

            <div className={'p-3 min-h-32 flex items-center'}>
                {
                    isScheduleBlockTypeSegmentSelected(ScheduleBlockTypes.TIME_STAMP)
                        ? <TimeStampInfo className={'flex-1'} openTimeStamp={openTimeStamp?.startTime ?? undefined}/>
                        : <AddTimeInterval
                            className={'flex-1'}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            endTime={endTime}
                            setEndTime={setEndTime}
                        />
                }
            </div>

            <HorizontalRuler/>

            <div className={'p-3 flex sm:flex-row flex-col items-center'}>
                <SegmentedControls
                    segments={Object.values(ScheduleBlockTimeSegments)}
                    selection={maskingScheduleBlockTimeSegment ?? selectedScheduleBlockTimeSegment}
                    onSelectionChange={segment => setSelectedScheduleBlockTimeSegment(segment!)}
                    orientation={'horizontal'}
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    deselectable={false}
                    disabled={isScheduleBlockTypeSegmentedControlDisabled}
                />

                <Button className={'min-w-56'} onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </div>

        </Elevation>
    );
}

const ScheduleBlockTypeSegments: { [key in ScheduleBlockTypeIdentifier]: Segment<ScheduleBlockType> } = {
    timeStamp: {
        id: 0,
        value: ScheduleBlockTypes.TIME_STAMP,
        displayAs: ScheduleBlockTypes.TIME_STAMP.segment.displayAs
    },
    timeInterval: {
        id: 1,
        value: ScheduleBlockTypes.TIME_INTERVAL,
        displayAs: ScheduleBlockTypes.TIME_INTERVAL.segment.displayAs
    }
};

const ScheduleBlockTimeSegments: { [key in ScheduleBlockTimeIdentifier]: Segment<ScheduleBlockTime> } = {
    workTime: {
        id: 0,
        value: ScheduleBlockTimes.WORK,
        displayAs: ScheduleBlockTimes.WORK.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTimes.WORK.segment.className}`
    },
    breakTime: {
        id: 1,
        value: ScheduleBlockTimes.BREAK,
        displayAs: ScheduleBlockTimes.BREAK.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTimes.BREAK.segment.className}`
    }
};
