import TimePicker from "@/components/control/TimePicker";
import Time from "@/time/Time";
import TimeComponent from '@/components/Time';
import KeyValueSection from "@/components/layout/KeyValueSection";
import { compare } from "@/util/CompareUtils";

type AddTimeIntervalProps = {
    startTime: Time | undefined,
    setStartTime: (value: Time | undefined) => void
    endTime: Time | undefined,
    setEndTime: (value: Time | undefined) => void,
    className?: string,
    onRequestAdd?: () => void
}

export default function AddTimeInterval(props: AddTimeIntervalProps) {
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
                    onEnterKeyUp={props.onRequestAdd}
                />
                bis
                <TimePicker
                    value={props.endTime}
                    onValueChange={props.setEndTime}
                    onEnterKeyUp={props.onRequestAdd}
                />
            </div>

            <KeyValueSection
                first={'Zeitdifferenz'}
                second={<TimeComponent time={timeDifference}/>}
            />
        </div>
    );

}