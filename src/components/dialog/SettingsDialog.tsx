import Dialog from "@/components/primitives/Dialog";
import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { useState } from "react";
import Frame from "@/components/layout/Frame";


type SettingsDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void
};


export default function SettingsDialog(props: SettingsDialogProps) {
    const [selectedSettings, setSelectedSettings] = useState<Segment<null>>(SettingsSegments.general);

    return (
        <Dialog
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
            title={'Einstellungen'}
        >

            <div className={'flex flex-row gap-2 min-h-60'}>
                <SegmentedControls
                    segments={Object.values(SettingsSegments)}
                    selection={selectedSettings}
                    onSelectionChange={s => setSelectedSettings(s!)}
                    deselectable={false}
                    orientation={'vertical'}
                />

                <Frame className={'flex-1'}>

                </Frame>

            </div>


        </Dialog>
    );

}

export const SettingsSegments: { [key: string]: Segment<null> } = {
    general: {
        id: 0,
        value: null,
        displayAs: "Allgemein"
    },
    myInfo: {
        id: 1,
        value: null,
        displayAs: "Meine Angaben"
    },
    regulatory: {
        id: 2,
        value: null,
        displayAs: "Rechtliche Vorgaben"
    },
    timeline: {
        id: 3,
        value: null,
        displayAs: "Timeline"
    },
    about: {
        id: 4,
        value: null,
        displayAs: "Über"
    }
};
