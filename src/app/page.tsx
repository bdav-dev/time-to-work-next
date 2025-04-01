'use client';

import ThemeToggle from "@/components/theme/ThemeToggle";
import Elevation from "@/components/layout/Elevation";
import React from "react";
import Section from "@/components/layout/Section";
import AddTime from "@/components/AddTime";
import useTime from "@/hooks/useTime";
import Time from "@/components/Time";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Timeline, { TimelineData } from "@/components/timeline/Timeline";
import { DefaultTimelineBlockColor } from "@/components/timeline/TimelineBlockColor";
import TimeClass from '@/time/Time';
import Table from "@/components/layout/Table";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { WorkTime, WorkTimeSerialization } from "@/WorkTime";
import Button from "@/components/buttons/Button";


function mapWorkTimeToTimelineData(workTime: WorkTime): TimelineData[] {
    return workTime.map(
        it => (
            {
                startTime: it.startTime,
                endTime: it.endTime,
                color: it.type == "work" ? DefaultTimelineBlockColor.BLUE : DefaultTimelineBlockColor.GREEN,
                title: it.type == "work" ? "Arbeit" : "Pause"
            }
        )
    )
}

export default function TimeToWork() {
    const time = useTime();

    // concepts:
    // UseLocalStorage<T, S>(fallback: T, setter: T => S, getter: S => T)
    // .ttwc time to work config file
    // stempel hook => falls gestempelt wird
    // Hook: useStateWithLocalStorage
    // make margin on button optional -> default is NO Margin






    const [workTime, setWorkTime] = useStateWithLocalStorage<WorkTime>('worktime', [], WorkTimeSerialization);


    return (
        <div className={'relative flex-1 flex flex-col'}>
            <Elevation
                overridePadding overrideMargin overrideRounded
                className={'w-fit p-5 rounded-br-2xl flex items-center gap-5 mb-4'}
            >
                <ThemeToggle overrideMargin/>

                <VerticalRuler className={'h-8'}/>

                <div>
                    <div className={'text-2xl font-bold'}>time-to-work</div>
                    Arbeitszeitdashboard
                </div>

                <VerticalRuler className={'h-8'}/>

                <Section className={'text-xl font-bold flex items-center px-5'}>
                    <Time time={time}/>
                </Section>

            </Elevation>

            <Button className={'w-fit'}
                    onClick={() => {
                        setWorkTime([
                            {
                                startTime: TimeClass.ofString('08:00'),
                                endTime: TimeClass.ofString('09:00'),
                                type: "work"
                            },
                            {
                                startTime: TimeClass.ofString('11:00'),
                                type: 'break'
                            }
                        ]);
                    }}

            >test</Button>


            <div className={'flex-1 flex flex-col justify-between'}>
                <div className={'flex justify-center'}>
                    <AddTime workTime={workTime}/>
                </div>

                <Timeline
                    currentTime={time}
                    height={11}
                    data={mapWorkTimeToTimelineData(workTime)}
                />

                <Table
                    header={['Summe der Arbeitszeit', 'restliche Arbeitszeit', 'Arbeitsende', 'neuer Zeitsaldo', 'Pause', 'nächster Zug']}
                    data={[
                        [<Section><Time time={TimeClass.of(11, 1)}/></Section>, '--:--', '--:--', '--:--', '--:--', '--:--']
                    ]}
                />
            </div>

        </div>
    );
}
