'use client';

import ThemeToggle from "@/components/theme/ThemeToggle";
import Elevation from "@/components/layout/Elevation";
import React, { useContext, useEffect, useState } from "react";
import Section from "@/components/layout/Section";
import ScheduleControlPanel from "@/components/control/schedule/ScheduleControlPanel";
import useTime from "@/hooks/UseTime";
import TimeComponent from "@/components/time/Time";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Timeline from "@/components/timeline/Timeline";
import Time from '@/time/Time';
import Table from "@/components/layout/Table";
import useStateWithLocalStorage from "@/hooks/UseStateWithLocalStorage";
import { mapScheduleToTimelineData, Schedule, ScheduleBlock, ScheduleSerialization } from "@/schedule/Schedule";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import TimeInterval from "@/time/TimeInterval";
import Messaging from "@/components/message/Messaging";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import TimeSpan from "@/time/TimeSpan";
import { Message, MessageContext } from "@/contexts/MessageContext";
import { DisplayableError } from "@/error/DisplayableError";
import ScheduleBlockDialog from "@/components/dialog/ScheduleBlockDialog";
import FlatButton from "@/components/primitives/control/FlatButton";
import SettingsDialog from "@/components/dialog/SettingsDialog";


// concepts:
// .ttwc time to work config file
// stempel hook => falls gestempelt wird
// ersetze 'Offener Zeitstempel 12:00 - ...' text mit ui, wo man steuern kann, wann geöffnet werden kann / geschlossen
// für schedule.equals => evtl to set umwandeln, dann normale scheduleblock equals anwenden
// dialog customizable bar => title, mehr buttons, X-Button
// make neu hier dialog only show when user enters first time
// change message retention times by add timeinterval error

export default function TimeToWork() {
    const messaging = useContext(MessageContext);

    const now = useTime();
    const [schedule, setSchedule] = useStateWithLocalStorage<Schedule>('schedule', [], ScheduleSerialization);
    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<ScheduleBlock>();

    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

    useEffect(() => {

        messaging.set(
            {
                title: "Neu hier?",
                body: <div className={'flex flex-col'}>
                    Gib' einige Informationen zu deiner Arbeitszeit an,
                    damit time-to-work für dich Daten, wie zum Beispiel die restliche Arbeitszeit, berechnen kann.

                    <FlatButton
                        className={'mt-2'}
                        onClick={() => {
                            messaging.clear();
                            setIsSettingsDialogOpen(true);
                        }}
                    >
                        Zu den Einstellungen
                    </FlatButton>
                </div>,
                retentionInSeconds: 45
            }
        );

    }, []);

    // useEffect(() => {
    //     setSchedule([
    //         {
    //             startTime: Time.of(8, 0),
    //             endTime: Time.of(9, 0),
    //             timeType: ScheduleBlockTimeTypes.WORK
    //         },
    //         {
    //             startTime: Time.of(10, 0),
    //             endTime: Time.of(11, 0),
    //             timeType: ScheduleBlockTimeTypes.BREAK
    //         }
    //     ])
    // }, []);

    function addTimeInterval(startTime: Time | undefined, endTime: Time | undefined, time: ScheduleBlockTimeType): boolean {
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

    function openTimeStamp(time: ScheduleBlockTimeType, openTimeStampAt?: Time) {
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

    function remove(block: ScheduleBlock): boolean {
        setSchedule(
            schedule => ScheduleOperations.removeScheduleBlock(schedule, block)
        );

        return true;
    }

    return (
        <div className={'relative flex-1 flex flex-col'}>

            <Messaging/>

            {
                selectedScheduleBlock &&
                <ScheduleBlockDialog
                    isOpen={!!selectedScheduleBlock}
                    onRequestClose={() => setSelectedScheduleBlock(undefined)}
                    currentTime={now}
                    schedule={schedule}
                    block={selectedScheduleBlock}
                    onRequestRemoveScheduleBlock={remove}
                    onRequestSubmitSchedule={(schedule) => {
                        setSelectedScheduleBlock(undefined);
                        setSchedule(schedule);
                    }}
                />
            }

            <SettingsDialog isOpen={isSettingsDialogOpen} onRequestClose={() => setIsSettingsDialogOpen(false)}/>

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

            {/*<Button className={'w-fit'} onClick={() => setSchedule([])}>Clear Schedule</Button>*/}

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
                    data={mapScheduleToTimelineData(schedule, { onClick: setSelectedScheduleBlock })}
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
                            <Section>
                                <TimeComponent time={ScheduleCalculations.getSumOfBreakTime(schedule, now)}/>
                            </Section>,
                            '--:--'
                        ]
                    ]}
                />
            </div>

        </div>
    );
}

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
