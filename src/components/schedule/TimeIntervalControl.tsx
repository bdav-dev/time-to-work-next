import TimePicker from "@/components/primitives/control/TimePicker";
import Time from "@/time/Time";
import TimeComponent from '@/components/time/Time';
import KeyValueSection from "@/components/layout/KeyValueSection";
import { compare } from "@/util/CompareUtils";
import useTime from "@/hooks/UseTime";

type TimeIntervalControl = {
    startTime: Time | undefined,
    setStartTime: (value: Time | undefined) => void
    endTime: Time | undefined,
    setEndTime: (value: Time | undefined) => void,
    className?: string,
    onRequestAdd?: () => void
}

export default function TimeIntervalControl(props: TimeIntervalControl) {
    const now = useTime();

    const timeDifference = (
        !props.startTime || !props.endTime || compare(props.startTime, 'greaterThan', props.endTime)
            ? undefined
            : props.endTime.asTimeSpan().subtract(props.startTime.asTimeSpan())
    );

    return (
        <div className={`flex flex-col gap-2.5 ${props.className}`}>
            <div className={'flex justify-center gap-2.5 items-center'}>
                <TimePicker
                    value={props.startTime}
                    onValueChange={props.setStartTime}
                    onEnterKeyPressed={props.onRequestAdd}
                    valueOnSpaceKeyPressed={now}
                />
                bis
                <TimePicker
                    value={props.endTime}
                    onValueChange={props.setEndTime}
                    onEnterKeyPressed={props.onRequestAdd}
                    valueOnSpaceKeyPressed={now}
                />
            </div>

            <KeyValueSection
                first={'Zeitdifferenz'}
                second={<TimeComponent time={timeDifference}/>}
            />
        </div>
    );

}