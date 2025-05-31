import TimeSpan from "@/time/TimeSpan";
import TimePicker, { TimePickerProps } from "./TimePicker";
import { compare } from "@/util/CompareUtils";

type TimeSpanPickerProps = {
    value: TimeSpan | undefined
    onValueChange: (timeSpan: TimeSpan | undefined) => void,
    valueOnSpaceKeyPressed?: TimeSpan
} & Omit<TimePickerProps, 'value' | 'onValueChange' | 'valueOnSpaceKeyPressed'>

/**
 * A component which lets the user pick a time span between 00:00 and 23:59.
 * Any time spans inputted in this component that are outside of this range will be clamped to the closest valid time span
 * (00:00 for negative time spans, 23:59 for time spans larger than 23:59).
 */
export default function TimeSpanPicker({ value, onValueChange, valueOnSpaceKeyPressed, ...rest }: TimeSpanPickerProps) {
    return (
        <TimePicker
            value={rectifyTimeSpan(value)?.asTime()}
            onValueChange={value => onValueChange(value?.asTimeSpan())}
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
