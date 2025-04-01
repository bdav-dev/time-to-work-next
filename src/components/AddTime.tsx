'use client';

import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Button from "@/components/buttons/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useMemo, useState } from "react";
import Time from "@/time/Time";
import TimeInterval from "@/components/TimeInterval";
import TimeStamp from "@/components/TimeStamp";
import { getOpenTimestamp, WorkTime } from "@/WorkTime";


type AddTimeProps = {
    workTime: WorkTime;
}

enum Type {
    TIME_STAMP,
    TIME_INTERVAL
}

enum TimeOption {
    WORK,
    BREAK
}


export default function AddTime(props: AddTimeProps) {
    const types: { [key in Type]: Segment<Type> } = {
        [Type.TIME_STAMP]: {
            id: 0,
            value: Type.TIME_STAMP,
            displayAs: 'Zeitstempel'
        },
        [Type.TIME_INTERVAL]: {
            id: 1,
            value: Type.TIME_INTERVAL,
            displayAs: 'Zeitintervall'
        }
    };
    const [type, setType] = useState<Segment<Type>>(types[Type.TIME_STAMP]);

    const timeOptions: { [key in TimeOption]: Segment<TimeOption> } = {
        [TimeOption.WORK]: {
            id: 0,
            value: TimeOption.WORK,
            displayAs: 'Arbeitszeit',
            className: isSelection => `${isSelection && 'text-blue-500 dark:text-blue-400'}`
        },
        [TimeOption.BREAK]: {
            id: 1,
            value: TimeOption.BREAK,
            displayAs: 'Pausenzeit',
            className: isSelection => `${isSelection && 'text-emerald-500 dark:text-emerald-400'}`
        }
    }
    const [timeOption, setTimeOption] = useState<Segment<TimeOption> | undefined>(timeOptions[TimeOption.WORK]);

    const addButtonText = useMemo(() => {
        return type.value == Type.TIME_STAMP ? 'Zeitstempel schließen' : 'Hinzufügen'; // öffnen
    }, [type]);


    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();

    const openTimeStamp = getOpenTimestamp(props.workTime);

    const isWorkTimeTypeInputDisabled = openTimeStamp != undefined && (type.value == Type.TIME_STAMP);

    const forced = useMemo(() => {
        if (isWorkTimeTypeInputDisabled) {
            return timeOptions[openTimeStamp.type == 'work' ? TimeOption.WORK : TimeOption.BREAK];
        }
        return undefined;
    }, [isWorkTimeTypeInputDisabled]);


    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'p-3 flex'}>
                <SegmentedControls
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    orientation={'horizontal'}
                    segments={Object.values(types)}
                    selection={type}
                    onSelectionChange={selected => setType(selected ?? types[Type.TIME_STAMP])}
                    deselectable={false}
                    widthFull
                    roundedFull
                />
            </div>

            <HorizontalRuler/>

            <div className={'p-3 min-h-32 flex items-center'}>
                {
                    type != undefined && typeof type === 'object' && (
                        type.id == 0
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
                    segments={Object.values(timeOptions)}
                    selection={forced ?? timeOption}
                    onSelectionChange={setTimeOption}
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