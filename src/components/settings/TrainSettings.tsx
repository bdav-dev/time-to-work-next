import Toggle from "@/components/primitives/control/Toggle";
import Settings from "@/components/layout/Settings";
import TimePicker from "@/components/primitives/control/TimePicker";
import Time from "@/time/Time";
import { useState } from "react";
import Section from "@/components/layout/Section";

export default function TrainSettings() {
    const [useTrain, setUseTrain] = useState(true);
    const [startTime, setStartTime] = useState(Time.of(0, 0));
    const [period, setPeriod] = useState(Time.of(0, 0));
    const [travelTime, setTravelTime] = useState(Time.of(0, 0));

    // TODO: WIP
    return (
        <div>
            <div className={'flex flex-col items-center justify-center gap-1'}>
                Nutze Zug

                <Toggle
                    value={useTrain}
                    onValueChange={setUseTrain}
                    customLabels={{ true: 'JA', false: 'NEIN' }}
                />
            </div>


            <Settings
                settingSections={[
                    {
                        title: 'Zeitplan',
                        settings: [
                            {
                                label: "Startzeitpunkt",
                                setting: disabled => <TimePicker
                                    value={startTime}
                                    onValueChange={val => setStartTime(val!)}
                                    disabled={disabled}
                                />,
                                disabled: !useTrain
                            },
                            {
                                label: "Periode (jede)",
                                setting: disabled => <TimePicker
                                    value={period}
                                    onValueChange={val => setPeriod(val!)}
                                    disabled={disabled}
                                />,
                                disabled: !useTrain
                            }
                        ]
                    },
                    {
                        settings: [
                            {
                                label: "Wegzeit",
                                setting: disabled => <TimePicker
                                    value={travelTime}
                                    onValueChange={val => setTravelTime(val!)}
                                    disabled={disabled}
                                />,
                                disabled: !useTrain
                            }
                        ]
                    }
                ]}
                trailingHorizontalRuler
            />

            <Section>
                // TODO show train schedule
            </Section>
        </div>
    );

}