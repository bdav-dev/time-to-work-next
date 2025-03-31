'use client';

import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import TimePicker from "@/components/control/TimePicker";
import Section from "@/components/layout/Section";
import Button from "@/components/buttons/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useMemo, useState } from "react";
import Time from "@/time/Time";
import TimeComponent from '@/components/Time';


export default function AddTime() {
    const tabs: { [key: string]: Segment } = {
        timestamp: {
            id: 0,
            displayAs: 'Zeitstempel'
        },
        timeInterval: {
            id: 1,
            displayAs: 'Zeitintervall'
        }
    };
    const [tab, setTab] = useState<Segment | undefined>(tabs.timestamp);

    const timeOptions: { [key: string]: Segment } = {
        workTime: {
            id: 0,
            displayAs: 'Arbeitszeit',
            className: isSelection => `${isSelection && 'text-blue-500 dark:text-blue-400'}`
        },
        breakTime: {
            id: 1,
            displayAs: 'Pausenzeit',
            className: isSelection => `${isSelection && 'text-emerald-500 dark:text-emerald-400'}`
        }
    }
    const [timeOption, setTimeOption] = useState<Segment | undefined>(timeOptions.workTime);

    const addButtonText = useMemo(() => {
        if (tab == undefined || typeof tab !== 'object') {
            return '';
        }

        return tab.id == 0 ? 'Zeitstempel schließen' : 'Hinzufügen'; // öffnen
    }, [tab])


    const [startTime, setStartTime] = useState<Time>();
    const [endTime, setEndTime] = useState<Time>();

    const timeDifference = useMemo(() => {
        if (!startTime || !endTime || startTime.compareTo(endTime) >= 1) {
            return undefined;
        }

        return endTime.asTimeSpan().subtract(startTime.asTimeSpan()).asTime();
    }, [startTime, endTime]);

    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'py-2 px-2'}>
                <div className={'flex justify-center'}>
                    <SegmentedControls
                        segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                        orientation={'horizontal'}
                        segments={Object.values(tabs)}
                        selection={tab}
                        onSelectionChange={setTab}
                        deselectable={false}
                        widthFull
                        roundedFull
                    />
                </div>
            </div>

            <HorizontalRuler/>


            <div className={'flex justify-center items-center gap-2.5 py-3'}>

                <TimePicker
                    value={startTime}
                    onValueChange={setStartTime}
                />
                bis
                <TimePicker
                    value={endTime}
                    onValueChange={setEndTime}
                />
            </div>

            <div className={'px-4'}>
                <Section className={'flex justify-between my-4'}>
                    <div className={'font-bold'}>
                        Zeitdifferenz
                    </div>
                    <div>
                        <TimeComponent time={timeDifference}/>
                    </div>
                </Section>
            </div>

            <HorizontalRuler/>

            <div className={'px-2 py-2 flex sm:flex-row flex-col items-center'}>
                <SegmentedControls
                    segments={Object.values(timeOptions)}
                    selection={timeOption}
                    onSelectionChange={setTimeOption}
                    orientation={'horizontal'}
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    deselectable={false}
                    disabled
                />

                <Button className={'flex-1 min-w-56'} onClick={() => { setStartTime(Time.now()) }}>
                    {addButtonText}
                </Button>
            </div>

        </Elevation>
    );
}