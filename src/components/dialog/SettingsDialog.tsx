import Dialog from "@/components/primitives/Dialog";
import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { ReactNode, useState } from "react";
import Frame from "@/components/layout/Frame";
import TimelineSettings from "@/components/settings/instances/TimelineSettings";
import PublicTransitSettings from "@/components/settings/instances/PublicTransitSettings";
import ThemeToggle from "@/components/theme/ThemeToggle";
import WorkingTimeSettings from "@/components/settings/instances/WorkingTimeSettings";
import NotificationSettings from "@/components/settings/instances/NotificationSettings";

type SettingsDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void
};

export default function SettingsDialog(props: SettingsDialogProps) {
    const [selectedSettings, setSelectedSettings] = useState<Segment<Settings>>(SettingsSegments.workingTime);

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Einstellungen'}
            overrideSize
            className={'max-w-[95rem] h-[51rem]'}
        >
            <div className={'flex flex-row gap-2 flex-1 max-h-full'}>
                <div className={'flex flex-col justify-between mt-1.5'}>
                    <SegmentedControls
                        segments={Object.values(SettingsSegments)}
                        selection={selectedSettings}
                        onSelectionChange={segment => setSelectedSettings(segment!)}
                        deselectable={false}
                        orientation={'vertical'}
                        segmentClassName={isSelection => `${isSelection && 'font-bold'}`}
                    />
                    <ThemeToggle/>
                </div>

                <Frame className={'flex flex-col flex-1 '}>
                    <div className={'text-2xl font-bold'}>
                        {selectedSettings.displayAs}
                    </div>
                    <div className={'overflow-y-auto'}>
                        {SettingViewMap[selectedSettings.value]}
                    </div>
                </Frame>
            </div>
        </Dialog>
    );
}

type Settings = 'workingTime' | 'timeline' | 'publicTransit' | 'notifications';

const SettingsSegments: { [key in Settings]: Segment<Settings> } = {
    workingTime: {
        id: 1,
        value: "workingTime",
        displayAs: "Arbeitszeit"
    },
    timeline: {
        id: 2,
        value: "timeline",
        displayAs: "Timeline"
    },
    publicTransit: {
        id: 3,
        value: "publicTransit",
        displayAs: "Rückfahrt mit ÖPNV"
    },
    notifications: {
        id: 4,
        value: "notifications",
        displayAs: "Benachrichtigungen"
    }
};

const SettingViewMap: { [key in Settings]: ReactNode } = {
    timeline: <TimelineSettings/>,
    publicTransit: <PublicTransitSettings/>,
    workingTime: <WorkingTimeSettings/>,
    notifications: <NotificationSettings/>
}
