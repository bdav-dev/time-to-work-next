'use client';

import { useState } from "react";
import ScheduleControlPanel from "@/components/schedule/ScheduleControlPanel";
import useTime from "@/hooks/UseTime";
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


// .ttwc time to work config file
// stempel hook => falls gestempelt wird
// für schedule.equals => evtl to set umwandeln, dann normale scheduleblock equals anwenden
// change message retention times by add timeinterval error
// make timeline name of big and small lines in code consistent
// create TimeSpanPicker -> aktuell 0 usages: replace
// make () Bereit not showing when noting changed (scheduleblock dialog)
// unreliable time untersuchen
// fix bug: see desktop
// maybe return clearTimeout: useTime

export default function TimeToWork() {
    const now = useTime();
    const messaging = useMessaging();
    const { schedule } = useSchedule();

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
                    height={12}
                    schedule={schedule}
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
