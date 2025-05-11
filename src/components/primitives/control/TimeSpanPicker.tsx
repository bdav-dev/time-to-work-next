import TimeSpan from "@/time/TimeSpan";
import TimePicker, { TimePickerProps } from "./TimePicker";
import { compare } from "@/util/CompareUtils";

type TimeSpanPickerProps = {
    value: TimeSpan | undefined
    onValueChange: (timeSpan: TimeSpan | undefined) => void,
    valueOnSpaceKeyPressed?: TimeSpan
} & Omit<TimePickerProps, 'value' | 'onValueChange' | 'valueOnSpaceKeyPressed'>

export default function TimeSpanPicker({ value, onValueChange, valueOnSpaceKeyPressed, ...rest }: TimeSpanPickerProps) {
    return (
        <TimePicker
            value={rectifyTimeSpan(value)?.asTime()}
            onValueChange={value => onValueChange(value?.asTimeSpan())}
            valueOnSpaceKeyPressed={rectifyTimeSpan(valueOnSpaceKeyPressed)?.asTime()}
            {...rest}
        />
    );
}

function rectifyTimeSpan(timeSpan: TimeSpan | undefined) {
    if (!timeSpan) {
        return undefined;
    }

    const latestTime = TimeSpan.ofString('23:59');

    let timeSpanToRectify = timeSpan;

    if (timeSpanToRectify.isNegative()) {
        timeSpanToRectify = TimeSpan.empty();

    } else if (compare(timeSpanToRectify, 'greaterThan', latestTime)) {
        timeSpanToRectify = latestTime;
    }

    return timeSpanToRectify;
}
