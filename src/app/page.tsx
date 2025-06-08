'use client';

import { useState } from "react";
import ScheduleControlPanel from "@/components/schedule/ScheduleControlPanel";
import { ScheduleBlock } from "@/schedule/Schedule";
import Messaging from "@/components/message/Messaging";
import EditScheduleBlockDialog from "@/components/dialog/EditScheduleBlockDialog";
import FlatButton from "@/components/primitives/control/FlatButton";
import SettingsDialog from "@/components/dialog/SettingsDialog";
import ConfiguredTimeline from "@/components/timeline/ConfiguredTimeline";
import useSchedule from "@/hooks/UseSchedule";
import useEffectOnFirstTimeVisit from "@/hooks/UseEffectOnFirstTimeVisit";
import useMessaging from "@/hooks/UseMessaging";
import Header from "@/components/layout/page/Header";
import InformationTable from "@/components/misc/InformationTable";
import UnclosedTimeStampWatcher from "@/unclosedTimeStamp/UnclosedTimeStampWatcher";
import useOptimalBreakEndTimeMarker from "@/hooks/UseOptimalBreakEndTimeMarker";


export default function TimeToWork() {
    const messaging = useMessaging();
    const { schedule } = useSchedule();
    const optimalBreakEndTimeMarker = useOptimalBreakEndTimeMarker();

    const [selectedScheduleBlock, setSelectedScheduleBlock] = useState<ScheduleBlock>();
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

    useEffectOnFirstTimeVisit(() => {
        messaging.set(
            createFirstTimeVisitMessage(
                () => {
                    messaging.clear();
                    setIsSettingsDialogOpen(true);
                }
            )
        );
    });

    return (
        <div className={'relative flex-1 flex flex-col'}>

            <Messaging/>

            {
                selectedScheduleBlock &&
                <EditScheduleBlockDialog
                    isOpen={!!selectedScheduleBlock}
                    onRequestClose={() => setSelectedScheduleBlock(undefined)}
                    block={selectedScheduleBlock}
                />
            }
            <SettingsDialog
                isOpen={isSettingsDialogOpen}
                onRequestClose={() => setIsSettingsDialogOpen(false)}
            />
            <UnclosedTimeStampWatcher/>

            <Header onSettingsButtonClick={() => setIsSettingsDialogOpen(true)}/>

            <div className={'flex-1 flex flex-col justify-between'}>
                <div className={'flex justify-center'}>
                    <ScheduleControlPanel/>
                </div>

                <ConfiguredTimeline
                    overrideConfiguration={{ height: "12rem" }}
                    schedule={schedule}
                    markers={optimalBreakEndTimeMarker ? [optimalBreakEndTimeMarker] : []}
                    scheduleMapOptions={{ onClick: setSelectedScheduleBlock }}
                />

                <InformationTable/>
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
