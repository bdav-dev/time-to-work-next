'use client';

import { useState } from "react";
import Section from "@/components/layout/Section";
import ScheduleControlPanel from "@/components/schedule/ScheduleControlPanel";
import useTime from "@/hooks/UseTime";
import TimeComponent from "@/components/time/Time";
import Time from '@/time/Time';
import Table from "@/components/layout/Table";
import { Schedule, ScheduleBlock } from "@/schedule/Schedule";
import { ScheduleBlockTimeType } from "@/schedule/ScheduleBlockTimeType";
import ScheduleOperations from "@/schedule/ScheduleOperations";
import TimeInterval from "@/time/TimeInterval";
import Messaging from "@/components/message/Messaging";
import ScheduleCalculations from "@/schedule/ScheduleCalculations";
import TimeSpan from "@/time/TimeSpan";
import { Message } from "@/contexts/MessageContext";
import { DisplayableError } from "@/error/DisplayableError";
import ScheduleBlockDialog from "@/components/dialog/ScheduleBlockDialog";
import FlatButton from "@/components/primitives/control/FlatButton";
import SettingsDialog from "@/components/dialog/SettingsDialog";
import ConfiguredTimeline from "@/components/timeline/ConfiguredTimeline";
import useSchedule from "@/hooks/UseSchedule";
import { useVerifiedPublicTransitConfiguration } from "@/hooks/configuration/instances/UsePublicTransitConfiguration";
import useEffectOnFirstTimeVisit from "@/hooks/UseEffectOnFirstTimeVisit";
import PublicTransitInformationBoard from "@/components/publicTransit/PublicTransitInformationBoard";
import useMessaging from "@/hooks/UseMessaging";
import Header from "@/components/layout/page/Header";


// concepts:
// .ttwc time to work config file
// stempel hook => falls gestempelt wird
// ersetze 'Offener Zeitstempel 12:00 - ...' text mit ui, wo man steuern kann, wann geöffnet werden kann / geschlossen
// für schedule.equals => evtl to set umwandeln, dann normale scheduleblock equals anwenden
// change message retention times by add timeinterval error
// make timeline name of big and small lines in code consistent
// maybe limit grace period
// implement own material symbol api
// create TimeSpanPicker
// make () Bereit not showing when noting changed (scheduleblock dialog)

export default function TimeToWork() {
    const now = useTime();
    const messaging = useMessaging();

    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<ScheduleBlock>();
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [schedule, setSchedule] = useSchedule();

    const publicTransitConfig = useVerifiedPublicTransitConfiguration();

    useEffectOnFirstTimeVisit(() => {
        showFirstTimeVisitMessage();
    });

    function showFirstTimeVisitMessage() {
        messaging.set(
            createFirstTimeVisitMessage(
                () => {
                    messaging.clear();
                    setIsSettingsDialogOpen(true);
                }
            )
        );
    }

    function addTimeInterval(
        startTime: Time | undefined,
        endTime: Time | undefined,
        time: ScheduleBlockTimeType
    ): boolean {
        if (!startTime || !endTime) {
            messaging.set(
                createTimeIntervalErrorMessage('Das Start- und Endfeld ist leer.')
            );
            return false;
        }

        let timeInterval: TimeInterval;
        try {
            timeInterval = TimeInterval.of(startTime, endTime)
        } catch (ignored) {
            messaging.set(
                createTimeIntervalErrorMessage('Die Endzeit des Zeitintervalls darf nicht vor der Startzeit liegen.')
            );
            return false;
        }

        let newSchedule: Schedule;
        try {
            newSchedule = ScheduleOperations.addTimeInterval(schedule, now, timeInterval, time);
        } catch (error) {
            messaging.set(
                error instanceof DisplayableError
                    ? createTimeIntervalErrorMessage(error.message, error.messageRetentionInSeconds)
                    : createTimeIntervalErrorMessage(DisplayableError.unknown().message)
            );
            return false;
        }

        setSchedule(newSchedule);

        return true;
    }

    function openTimeStamp(time: ScheduleBlockTimeType, openTimeStampAt?: Time) {
        let newSchedule: Schedule;
        try {
            newSchedule = ScheduleOperations.openTimeStamp(schedule, openTimeStampAt ?? now, now, time);
        } catch (error) {
            messaging.set(
                error instanceof DisplayableError
                    ? createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                    : createTimeStampErrorMessage(DisplayableError.unknown().message)
            );
            return;
        }

        setSchedule(newSchedule);
    }

    function closeTimeStamp(closeTimeStampAt?: Time) {
        let newSchedule: Schedule;

        try {
            newSchedule = ScheduleOperations.closeTimeStamp(schedule, closeTimeStampAt ?? now, now);
        } catch (error) {
            messaging.set(
                error instanceof DisplayableError
                    ? createTimeStampErrorMessage(error.message, error.messageRetentionInSeconds)
                    : createTimeStampErrorMessage(DisplayableError.unknown().message)
            );
            return;
        }

        setSchedule(newSchedule);
    }

    function remove(block: ScheduleBlock): boolean {
        setSchedule(schedule => ScheduleOperations.removeScheduleBlock(schedule, block));
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
            <SettingsDialog
                isOpen={isSettingsDialogOpen}
                onRequestClose={() => setIsSettingsDialogOpen(false)}
            />

            <Header
                time={now}
                onSettingsButtonClick={() => setIsSettingsDialogOpen(true)}
            />

            <div className={'flex-1 flex flex-col justify-between'}>
                <div className={'flex justify-center'}>
                    <ScheduleControlPanel
                        onAddTimeIntervalRequest={addTimeInterval}
                        onOpenTimeStampRequest={openTimeStamp}
                        onCloseTimeStampRequest={closeTimeStamp}
                    />
                </div>

                <ConfiguredTimeline
                    height={12}
                    schedule={schedule}
                    scheduleMapOptions={{ onClick: setSelectedScheduleBlock }}
                />

                <Table
                    header={[
                        'Summe der Arbeitszeit',
                        'restliche Arbeitszeit',
                        'Arbeitsende',
                        'neuer Zeitsaldo',
                        'Pause',
                        publicTransitConfig?.type.nextDepartureText
                    ]}
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
                            publicTransitConfig &&
                            <Section className={'flex justify-center'}>
                                <PublicTransitInformationBoard config={publicTransitConfig} now={now}/>
                            </Section>
                        ]
                    ]}
                />
            </div>
        </div>
    );
}

const createFirstTimeVisitMessage = (onSettingsButtonClick: () => void) => (
    {
        title: "Neu hier?",
        body: <div className={'flex flex-col'}>
            Gib' einige Informationen zu deiner Arbeitszeit an,
            damit time-to-work für dich Daten, wie zum Beispiel die restliche Arbeitszeit, berechnen kann.

            <FlatButton
                className={'mt-2'}
                onClick={onSettingsButtonClick}
            >
                Zu den Einstellungen
            </FlatButton>
        </div>,
        retentionInSeconds: 60
    }
);

const createTimeIntervalErrorMessage: (body: string, retentionInSeconds?: number) => Message = (
    (body, retentionInSeconds) => ({
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Hinzufügen',
        type: 'error'
    })
);

const createTimeStampErrorMessage: (body: string, retentionInSeconds?: number) => Message = (
    (body, retentionInSeconds) => ({
        body,
        retentionInSeconds: retentionInSeconds ?? 5,
        title: 'Fehler beim Stempeln',
        type: 'error'
    })
);
