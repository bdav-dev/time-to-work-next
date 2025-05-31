import TimePicker from "@/components/primitives/control/TimePicker";
import Time from "@/time/Time";
import TimeComponent from '@/components/time/Time';
import { compare } from "@/util/CompareUtils";
import useTime from "@/hooks/UseTime";
import TimeInterval from "@/time/TimeInterval";
import KeyValueSection from "@/components/layout/KeyValueSection";
import { SemanticKeys } from "@/shortcuts/SemanticKeys";

type TimeIntervalControl = {
    startTime: Time | undefined,
    setStartTime: (value: Time | undefined) => void
    endTime: Time | undefined,
    setEndTime: (value: Time | undefined) => void,
    className?: string,
    onRequestAdd?: () => void,
    getLatestEndTimeOfSchedule: () => Time | undefined,
}

export default function TimeIntervalControl(props: TimeIntervalControl) {
    const now = useTime();

    const timeDifference = (
        !props.startTime || !props.endTime || compare(props.startTime, 'greaterThan', props.endTime)
            ? undefined
            : TimeInterval.of(props.startTime, props.endTime).getTimeDifference()
    );

    return (
        <div className={`flex flex-col gap-2.5 ${props.className}`}>
            <div className={'flex justify-center gap-2.5 items-center'}>
                <TimePicker
                    value={props.startTime}
                    onValueChange={props.setStartTime}
                    onKeyUp={{
                        [SemanticKeys.SUBMIT]: { runAndBlur: props.onRequestAdd },
                        [SemanticKeys.SET_TO_CURRENT_TIME]: { setValue: now },
                        [SemanticKeys.SET_TO_ADJACENT]: { setValue: props.getLatestEndTimeOfSchedule() }
                    }}
                />
                bis
                <TimePicker
                    value={props.endTime}
                    onValueChange={props.setEndTime}
                    onKeyUp={{
                        [SemanticKeys.SUBMIT]: { runAndBlur: props.onRequestAdd },
                        [SemanticKeys.SET_TO_CURRENT_TIME]: { setValue: now }
                    }}
                />
            </div>

            <KeyValueSection
                first={'Zeitdifferenz'}
                second={<TimeComponent time={timeDifference}/>}
            />
        </div>
    );

}