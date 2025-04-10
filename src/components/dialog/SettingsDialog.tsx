import Dialog from "@/components/primitives/Dialog";
import SegmentedControls, { Segment } from "@/components/primitives/control/SegmentedControls";
import { useEffect, useState } from "react";
import Frame from "@/components/layout/Frame";
import Timeline from "@/components/timeline/Timeline";
import useTime from "@/hooks/UseTime";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import Time from "@/time/Time";
import { TimelineBlockColors } from "@/components/timeline/TimelineBlockColor";
import NumberPicker from "@/components/primitives/control/NumberPicker";
import TimePicker from "@/components/primitives/control/TimePicker";


type SettingsDialogProps = {
    isOpen: boolean,
    onRequestClose: () => void
};


export default function SettingsDialog(props: SettingsDialogProps) {
    const [selectedSettings, setSelectedSettings] = useState<Segment<null>>(SettingsSegments.general);
    const now = useTime();

    const [num, setNum] = useState(0);

    const [startTime, setStartTime] = useState(Time.ofString('07:00'));
    const [endTime, setEndTime] = useState<Time | undefined>(Time.ofString('18:00'));

    useEffect(() => {
        console.log(num);
    }, [num]);

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
                    <div className={'text-xl'}>
                        Timeline
                    </div>

                    <Timeline
                        data={[
                            {
                                startTime: Time.ofString('10:00'),
                                endTime: Time.ofString('12:00'),
                                title: "test",
                                color: TimelineBlockColors.BLUE
                            }
                        ]}
                        endTime={endTime}
                        currentTime={now}
                    />

                    <div className={'h-3'}/>

                    <HorizontalRuler/>

                    <div className={'flex flex-row justify-between p-4'}>
                        <div>
                            Startzeit
                        </div>

                        <div>
                            test
                        </div>
                    </div>

                    <HorizontalRuler/>

                    <div className={'flex flex-row justify-between items-center p-4'}>
                        <div>
                            Endzeit
                        </div>

                        <div>
                            <TimePicker value={endTime} onValueChange={setEndTime}/>
                        </div>
                    </div>

                    <HorizontalRuler/>

                    <div className={'flex flex-row justify-between p-4'}>
                        <div>
                            Anzahl großer Zeitabschnitte
                        </div>

                        <div>
                            <NumberPicker value={num} onValueChange={setNum}/>
                        </div>
                    </div>

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
