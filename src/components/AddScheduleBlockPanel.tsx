'use client';

import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/buttons/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useMemo, useState } from "react";
import Time from "@/time/Time";
import TimeInterval from "@/components/TimeInterval";
import TimeStamp from "@/components/TimeStamp";
import { getOpenTimestamp, Schedule } from "@/Schedule";
import { ScheduleBlockType, ScheduleBlockTypeIdentifier, ScheduleBlockTypes } from "@/ScheduleBlockType";
import { AddScheduleBlockMode, AddScheduleBlockModeIdentifier, AddScheduleBlockModes } from "@/AddScheduleBlockMode";


type AddTimeProps = {
    workTime: Schedule;
}

export default function AddScheduleBlockPanel(props: AddTimeProps) {
    const [addScheduleBlockModeSegment, setAddScheduleBlockModeSegment] = useState<Segment<AddScheduleBlockMode>>(AddScheduleBlockModeSegments.timeStamp);
    const [scheduleBlockTypeSegment, setScheduleBlockTypeSegment] = useState<Segment<ScheduleBlockType>>(ScheduleBlockTypeSegments.workTime);

    const addButtonText = useMemo(() => {
        return addScheduleBlockModeSegment.value.identifier === AddScheduleBlockModes.TIME_STAMP.identifier
            ? 'Zeitstempel schließen'
            : 'Hinzufügen'; // öffnen
    }, [addScheduleBlockModeSegment]);

    const isAddScheduleBlockModeSegmentSelected = (mode: AddScheduleBlockMode) => addScheduleBlockModeSegment.value.identifier == mode.identifier

    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();

    const openTimeStamp = getOpenTimestamp(props.workTime);

    const isWorkTimeTypeInputDisabled = openTimeStamp != undefined && isAddScheduleBlockModeSegmentSelected(AddScheduleBlockModes.TIME_STAMP);

    const forced = useMemo(() => {
        if (isWorkTimeTypeInputDisabled && openTimeStamp) {
            return ScheduleBlockTypeSegments[openTimeStamp.type.identifier];
        }
        return undefined;
    }, [isWorkTimeTypeInputDisabled]);


    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'p-3 flex'}>
                <SegmentedControls
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    orientation={'horizontal'}
                    segments={Object.values(AddScheduleBlockModeSegments)}
                    selection={addScheduleBlockModeSegment}
                    onSelectionChange={selected => setAddScheduleBlockModeSegment(selected!)}
                    deselectable={false}
                    widthFull
                    roundedFull
                />
            </div>

            <HorizontalRuler/>

            <div className={'p-3 min-h-32 flex items-center'}>
                {
                    addScheduleBlockModeSegment != undefined && typeof addScheduleBlockModeSegment === 'object' && (
                        addScheduleBlockModeSegment.id == 0
                            ? <TimeStamp className={'flex-1'} openTimeStamp={openTimeStamp?.startTime ?? undefined}/>
                            : <TimeInterval
                                className={'flex-1'}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                endTime={endTime}
                                setEndTime={setEndTime}
                            />
                    )
                }

            </div>

            <HorizontalRuler/>

            <div className={'p-3 flex sm:flex-row flex-col items-center'}>
                <SegmentedControls
                    segments={Object.values(ScheduleBlockTypeSegments)}
                    selection={forced ?? scheduleBlockTypeSegment}
                    onSelectionChange={segment => setScheduleBlockTypeSegment(segment!)}
                    orientation={'horizontal'}
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    deselectable={false}
                    disabled={isWorkTimeTypeInputDisabled}
                />

                <Button className={'min-w-56'}>
                    {addButtonText}
                </Button>
            </div>

        </Elevation>
    );
}

const AddScheduleBlockModeSegments: { [key in AddScheduleBlockModeIdentifier]: Segment<AddScheduleBlockMode> } = {
    timeStamp: {
        id: 0,
        value: AddScheduleBlockModes.TIME_STAMP,
        displayAs: AddScheduleBlockModes.TIME_STAMP.segment.displayAs
    },
    timeInterval: {
        id: 1,
        value: AddScheduleBlockModes.TIME_INTERVAL,
        displayAs: AddScheduleBlockModes.TIME_INTERVAL.segment.displayAs
    }
};

const ScheduleBlockTypeSegments: { [key in ScheduleBlockTypeIdentifier]: Segment<ScheduleBlockType> } = {
    workTime: {
        id: 0,
        value: ScheduleBlockTypes.WORK_TIME,
        displayAs: ScheduleBlockTypes.WORK_TIME.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTypes.WORK_TIME.segment.className}`
    },
    breakTime: {
        id: 1,
        value: ScheduleBlockTypes.BREAK_TIME,
        displayAs: ScheduleBlockTypes.BREAK_TIME.segment.displayAs,
        className: isSelection => `${isSelection && ScheduleBlockTypes.BREAK_TIME.segment.className}`
    }
};