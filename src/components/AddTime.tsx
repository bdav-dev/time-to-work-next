'use client';

import SegmentedControls, { Segment } from "@/components/control/SegmentedControls";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import TimePicker from "@/components/control/TimePicker";
import Section from "@/components/layout/Section";
import Button from "@/components/buttons/Button";
import Elevation from "@/components/layout/Elevation";
import React, { useState } from "react";

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

    return (
        <Elevation overridePadding className={'w-fit'}>

            <div className={'py-2 px-2'}>
                <div className={'flex justify-center'}>
                    <SegmentedControls
                        segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                        orientation={'horizontal'}
                        segments={Object.values(tabs)}
                        selection={tab}
                        onSelectionChanged={setTab}
                        deselectable={false}
                        widthFull
                        roundedFull
                    />
                </div>
            </div>

            <HorizontalRuler/>


            <div className={'flex justify-center items-center gap-2.5 py-3'}>
                <TimePicker/> bis <TimePicker/>
            </div>

            <div className={'px-4'}>
                <Section className={'flex justify-between my-4'}>
                    <div className={'font-bold'}>
                        Differenz
                    </div>
                    <div>
                        21:22
                    </div>
                </Section>
            </div>

            <HorizontalRuler/>

            <div className={'px-2 py-2 flex sm:flex-row flex-col items-center'}>
                <SegmentedControls
                    segments={Object.values(timeOptions)}
                    selection={timeOption}
                    onSelectionChanged={setTimeOption}
                    orientation={'horizontal'}
                    segmentClassName={(isSelection) => `${isSelection && 'font-bold'}`}
                    deselectable={false}
                />

                <Button className={'flex-1 min-w-56'}>
                    Zeitstempel erfassen
                </Button>
            </div>

        </Elevation>
    );
}