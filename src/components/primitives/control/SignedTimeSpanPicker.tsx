import SignSelect from "@/components/select/SignSelect";
import TimeSpan from "@/time/TimeSpan";
import TimePicker from "@/components/primitives/control/TimePicker";

type SignedTimeSpanPickerProps = {
    value: TimeSpan | undefined,
    setValue: (timeSpan?: TimeSpan) => void,
    invalid?: boolean,
}

export default function SignedTimeSpanPicker(props: SignedTimeSpanPickerProps) {
    return (
        <div className={'flex flex-row items-center justify-center w-fit gap-1'}>
            <SignSelect
                value={props.value?.isNegative() ? -1 : 1}
                onValueChange={sign => props.setValue(props.value?.absolute().multiply(sign))}
                disabled={!props.value || props.value.equals(TimeSpan.zero())}
            />
            <TimePicker
                value={props.value?.absolute().asTime()}
                invalid={props.invalid}
                onValueChange={
                    newValue => props.setValue(
                        newValue?.asTimeSpan().multiply(props.value?.isNegative() ? -1 : 1)
                    )
                }
            />
        </div>
    );
}
