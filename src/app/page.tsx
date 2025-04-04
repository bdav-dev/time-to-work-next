'use client';

import ThemeToggle from "@/components/theme/ThemeToggle";
import Elevation from "@/components/layout/Elevation";
import React, { useContext } from "react";
import Section from "@/components/layout/Section";
import ScheduleControlPanel from "@/components/ScheduleControlPanel";
import useTime from "@/hooks/UseTime";
import TimeComponent from "@/components/Time";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Timeline, { TimelineData } from "@/components/timeline/Timeline";
import Time from '@/time/Time';
import Table from "@/components/layout/Table";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { Schedule, ScheduleSerialization } from "@/schedule/Schedule";
import { ScheduleBlockTime } from "@/schedule/ScheduleBlockTime";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import TimeInterval from "@/time/TimeInterval";
import Messaging from "@/components/message/Messaging";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import TimeSpan from "@/time/TimeSpan";
import Button from "@/components/control/Button";
import { Message, MessageContext } from "@/contexts/MessageContext";
import { DisplayableError } from "@/error/DisplayableError";


function mapScheduleToTimelineData(schedule: Schedule): TimelineData[] {
    return schedule.map(
        scheduleBlock => ({
            startTime: scheduleBlock.startTime,
            endTime: scheduleBlock.endTime,
            color: scheduleBlock.time.timelineBlock.color,
            title: scheduleBlock.time.timelineBlock.title
        })
    );
}

// concepts:
// .ttwc time to work config file
// stempel hook => falls gestempelt wird
// maybe make Schedule (immutable) class, any changes to schedule results in new object
// ersetze 'Offener Zeitstempel 12:00 - ...' text mit ui, wo man steuern kann, wann geöffnet werden kann / geschlossen

const createTimeIntervalErrorMessage: (body: string, retentionInSeconds?: number) => Message = (body, retentionInSeconds) => ({
    body,
    retentionInSeconds: retentionInSeconds ?? 2,
    title: 'Fehler beim Hinzufügen',
    type: 'error'
});

const createTimeStampErrorMessage: (body: string, retentionInSeconds?: number) => Message = (body, retentionInSeconds) => ({
    body,
    retentionInSeconds: retentionInSeconds ?? 2,
    title: 'Fehler beim Stempeln',
    type: 'error'
});

export default function TimeToWork() {
    const now = useTime();
    const [schedule, setSchedule] = useStateWithLocalStorage<Schedule>('schedule', [], ScheduleSerialization);
    const messaging = useContext(MessageContext);

    function addTimeInterval(startTime: Time | undefined, endTime: Time | undefined, time: ScheduleBlockTime): boolean {
        if (!startTime || !endTime) {
            messaging.set(createTimeIntervalErrorMessage('Das Start- und Endfeld ist leer.'));
            return false;
        }

        let timeInterval: TimeInterval;
        try {
            timeInterval = TimeInterval.of(startTime, endTime)
        } catch (e) {
            messaging.set(createTimeIntervalErrorMessage('Die Endzeit des Zeitintervalls darf nicht vor der Startzeit liegen.'));
            return false;
        }

        let newSchedule: Schedule;
        try {
            newSchedule = ScheduleOperations.addTimeInterval(schedule, now, timeInterval, time);
        } catch (e) {
            if (e instanceof DisplayableError) {
                messaging.set(createTimeIntervalErrorMessage(e.message, e.messageRetentionInSeconds));
            }
            return false;
        }

        setSchedule(newSchedule);

        return true;
    }

    function openTimeStamp(time: ScheduleBlockTime, openTimeStampAt?: Time) {
        let newSchedule: Schedule;
        try {
            newSchedule = ScheduleOperations.openTimeStamp(schedule, openTimeStampAt ?? now, now, time);
        } catch (e) {
            if (e instanceof DisplayableError) {
                messaging.set(createTimeStampErrorMessage(e.message, e.messageRetentionInSeconds));
            }
            return;
        }

        setSchedule(newSchedule);
    }

    function closeTimeStamp(closeTimeStampAt?: Time) {
        let newSchedule: Schedule;

        try {
            newSchedule = ScheduleOperations.closeTimeStamp(schedule, closeTimeStampAt ?? now, now);
        } catch (e) {
            if (e instanceof DisplayableError) {
                messaging.set(createTimeStampErrorMessage(e.message, e.messageRetentionInSeconds));
            }
            return;
        }

        setSchedule(newSchedule);
    }

    return (
        <div className={'relative flex-1 flex flex-col'}>

            <Messaging/>

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
                    <TimeComponent time={now}/>
                </Section>

            </Elevation>

            <Button className={'w-fit'} onClick={() => setSchedule([])}>Clear Schedule</Button>

            <div className={'flex-1 flex flex-col justify-between'}>
                <div className={'flex justify-center'}>
                    <ScheduleControlPanel
                        schedule={schedule}
                        onAddTimeIntervalRequest={addTimeInterval}
                        onOpenTimeStampRequest={openTimeStamp}
                        onCloseTimeStampRequest={closeTimeStamp}
                    />
                </div>

                <Timeline
                    currentTime={now}
                    height={12}
                    data={mapScheduleToTimelineData(schedule)}
                />

                <Table
                    header={['Summe der Arbeitszeit', 'restliche Arbeitszeit', 'Arbeitsende', 'neuer Zeitsaldo', 'Pause', 'nächster Zug']}
                    data={[
                        [
                            <Section>
                                <TimeComponent time={ScheduleCalculations.getSumOfWorkTime(schedule, now)}/>
                            </Section>,
                            <Section>
                                <TimeComponent time={ScheduleCalculations.getRemainingTimeToWork(schedule, now, TimeSpan.of(8, 12))}/>
                            </Section>,
                            '--:--',
                            '--:--',
                            '--:--',
                            '--:--'
                        ]
                    ]}
                />
            </div>

        </div>
    );
}
