'use client';

import Button from "@/components/buttons/Button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Elevation from "@/components/layout/Elevation";
import Timeline from "@/components/timeline/Timeline";
import { DefaultTimelineBlockColor } from "@/components/timeline/TimelineBlockColor";
import React from "react";
import SegmentedControls from "@/components/control/SegmentedControls";
import Section from "@/components/layout/Section";
import Toggle from "@/components/control/Toggle";
import AddTime from "@/components/AddTime";
import useTime from "@/hooks/useTime";
import Time from "@/components/Time";
import TimeClass from '@/time/Time'


export default function TimeToWork() {

    const time = useTime();


    function not() {
        //Notification.requestPermission();
        const notification = new Notification("Hi there!", { body: "test", icon: "https://www.bdav.dev/favicon.ico", badge: "https://www.bdav.dev/favicon.ico" });
    }

    const [active, setActive] = React.useState(false);

    // concepts:
    // UseLocalStorage<T, S>(fallback: T, setter: T => S, getter: S => T)
    // .ttwc time to work config file
    // stempel hook => falls gestempelt wird
    // Hook: useStateWithLocalStorage
    // make margin on button optional -> default is NO Margin

    const [on, setOn] = React.useState(false);

    const [lang, setLang] = React.useState<string>();

    return (
        <div>
            <Button
                onClick={() => {
                    console.log(
                        //Time.ofString('13:01').toString(true)
                    );
                }}
            >
                Test Time Conversion
            </Button>



            <ThemeToggle/>



            <br/>

            <Time time={time}/>

            <AddTime/>
            <Toggle isOn={on} onChange={setOn}/>

            <Elevation>
                This is an Elevation!
                <Section>
                    And this is a Section!
                </Section>

                Test
            </Elevation>


            <br/>

            <Button onClick={not}>
                Notification
            </Button>
            <Timeline
                currentTime={TimeClass.ofString('10:45')}
                height={9}
                data={[
                    {
                        startTime: TimeClass.ofString('08:00'),
                        endTime: TimeClass.ofString('08:30'),
                        title: "Break",
                        color: DefaultTimelineBlockColor.GREEN,
                    },
                    {
                        startTime: TimeClass.ofString('10:30'),
                        color: DefaultTimelineBlockColor.BLUE,
                        title: "Work"
                    },
                    {
                        startTime: TimeClass.ofString('15:00'),
                        endTime: TimeClass.ofString('16:30'),
                        title: "Work",
                        color: DefaultTimelineBlockColor.YELLOW
                    }
                ]}
            />


            <Elevation>
                <div className={'flex flex-row items-center gap-1'}>
                    <div
                        className={`${active ? 'neumorphic-medium-inset neumorphic-reverse-active-medium' : 'neumorphic-medium neumorphic-active-medium'}  rounded-lg size-8 dark:border-zinc-600 border-zinc-400 border-2 text-center content-center text-xl select-none`}
                        onClick={() => setActive(current => !current)}
                    >
                        {active ? '✓' : ''}
                    </div>

                    Use Dark Mode

                </div>
            </Elevation>


            <SegmentedControls
                segmentClassName={(isSelection) => `w-40 flex flex-row justify-center ${isSelection && 'font-bold'}`}
                orientation={"vertical"}
                segments={[
                    "German",
                    "French",
                    "English",
                    "Polish",
                    "Spanish"
                ]}
                onSelectionChange={setLang}
                selection={lang}
                deselectable={true}
            />


            <div>
                t
                t <br/>
                te
            </div>


        </div>
    );
}
