import Dialog from "@/components/primitives/Dialog";
import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { ReactNode, useState } from "react";
import Frame from "@/components/layout/Frame";
import TimelineSettings from "@/components/settings/TimelineSettings";
import About from "@/components/settings/About";

type SettingsDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void
};

export default function SettingsDialog(props: SettingsDialogProps) {
    const [selectedSettings, setSelectedSettings] = useState<Segment<Settings>>(SettingsSegments.general);

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Einstellungen'}
            overrideSize
            className={'max-w-[95rem] min-h-[51rem]'}
        > {/* TODO: Make it so that dialog adapts to screen size, content inside gets scroll bar */}
            <div className={'flex flex-row gap-2 flex-1'}>
                <SegmentedControls
                    segments={Object.values(SettingsSegments)}
                    selection={selectedSettings}
                    onSelectionChange={s => setSelectedSettings(s!)}
                    deselectable={false}
                    orientation={'vertical'}
                    segmentClassName={isSelection => `${isSelection && 'font-bold'}`}
                />

                <Frame className={'flex flex-col flex-1'}>
                    <div className={'text-xl'}>
                        {
                            selectedSettings.displayAs
                        }
                    </div>
                    {
                        SettingsToComponentMap[selectedSettings.value]
                    }
                </Frame>
            </div>
        </Dialog>
    );
}

type Settings = 'general' | 'myInfo' | 'regulatory' | 'about' | 'timeline';

const SettingsSegments: { [key in Settings]: Segment<Settings> } = {
    general: {
        id: 0,
        value: "general",
        displayAs: "Allgemein"
    },
    myInfo: {
        id: 1,
        value: "myInfo",
        displayAs: "Meine Angaben"
    },
    regulatory: {
        id: 2,
        value: "regulatory",
        displayAs: "Rechtliche Vorgaben"
    },
    timeline: {
        id: 3,
        value: "timeline",
        displayAs: "Timeline"
    },
    about: {
        id: 4,
        value: "about",
        displayAs: "Über"
    }
};

const SettingsToComponentMap: { [key in Settings]: ReactNode } = {
    timeline: <TimelineSettings/>,
    about: <About/>,
    general: <></>,
    myInfo: <></>,
    regulatory: <></>
}
