import Dialog from "@/components/primitives/Dialog";
import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { ReactNode, useState } from "react";
import Frame from "@/components/layout/Frame";
import TimelineSettings from "@/components/settings/instances/TimelineSettings";
import About from "@/components/settings/instances/About";
import PublicTransitSettings from "@/components/settings/instances/PublicTransitSettings";
import ThemeToggle from "@/components/theme/ThemeToggle";
import WorkingTimeSettings from "@/components/settings/instances/WorkingTimeSettings";
import WorkingTimeRestrictionSettings from "@/components/settings/instances/WorkingTimeRestrictionSettings";

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
            className={'max-w-[95rem] min-h-[51rem]'}
        >
            <div className={'flex flex-row gap-2 flex-1'}>
                <div className={'flex flex-col justify-between'}>
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

                <Frame className={'flex flex-col flex-1'}>
                    <div className={'text-2xl font-bold'}>
                        {selectedSettings.displayAs}
                    </div>
                    {SettingViewMap[selectedSettings.value]}
                </Frame>
            </div>
        </Dialog>
    );
}

type Settings = 'workingTime' | 'about' | 'timeline' | 'publicTransit' | 'workingTimeRestrictions';

const SettingsSegments: { [key in Settings]: Segment<Settings> } = {
    /* TODO
    general: {
        id: 0,
        value: "general",
        displayAs: "Allgemein"
    },
    */
    workingTime: {
        id: 1,
        value: "workingTime",
        displayAs: "Angaben zur Arbeitszeit"
    },
    timeline: {
        id: 3,
        value: "timeline",
        displayAs: "Timeline"
    },
    publicTransit: {
        id: 5,
        value: "publicTransit",
        displayAs: "Rückfahrt mit ÖPNV"
    },
    workingTimeRestrictions: {
        id: 6,
        value: "workingTimeRestrictions",
        displayAs: "Einschränkungen"
    },
    about: {
        id: 4,
        value: "about",
        displayAs: "Über"
    }
};

const SettingViewMap: { [key in Settings]: ReactNode } = {
    timeline: <TimelineSettings/>,
    about: <About/>,
    publicTransit: <PublicTransitSettings/>,
    //general: <></>,
    workingTime: <WorkingTimeSettings/>,
    workingTimeRestrictions: <WorkingTimeRestrictionSettings/>
}
