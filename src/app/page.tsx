'use client';

import ThemeToggle from "@/components/theme/ThemeToggle";
import Elevation from "@/components/layout/Elevation";
import React from "react";
import Section from "@/components/layout/Section";
import ScheduleControlPanel from "@/components/ScheduleControlPanel";
import useTime from "@/hooks/UseTime";
import Time from "@/components/Time";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Timeline, { TimelineData } from "@/components/timeline/Timeline";
import TimeClass from '@/time/Time';
import Table from "@/components/layout/Table";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { Schedule, ScheduleSerialization } from "@/schedule/Schedule";


function mapScheduleToTimelineData(schedule: Schedule): TimelineData[] {
    return schedule.map(
        scheduleBlock => ({
            startTime: scheduleBlock.startTime,
            endTime: scheduleBlock.endTime,
            color: scheduleBlock.type.timelineBlock.color,
            title: scheduleBlock.type.timelineBlock.title
        })
    );
}

// concepts:
// .ttwc time to work config file
// stempel hook => falls gestempelt wird
// maybe make Schedule (immutable) class, any changes to schedule results in new object

export default function TimeToWork() {
    const time = useTime();
    const [schedule, setSchedule] = useStateWithLocalStorage<Schedule>('schedule', [], ScheduleSerialization);


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

            {/*<Button className={'w-fit'}*/}
            {/*        onClick={() => {*/}
            {/*            setSchedule([*/}
            {/*                {*/}
            {/*                    startTime: TimeClass.ofString('08:00'),*/}
            {/*                    endTime: TimeClass.ofString('09:00'),*/}
            {/*                    type: ScheduleBlockTypes.WORK_TIME*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    startTime: TimeClass.ofString('11:00'),*/}
            {/*                    type: ScheduleBlockTypes.WORK_TIME*/}
            {/*                }*/}
            {/*            ]);*/}
            {/*        }}*/}

            {/*>test</Button>*/}

            <div className={'flex-1 flex flex-col justify-between'}>
                <div className={'flex justify-center'}>
                    <ScheduleControlPanel schedule={schedule}/>
                </div>

                <Timeline
                    currentTime={time}
                    height={12}
                    data={mapScheduleToTimelineData(schedule)}
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
