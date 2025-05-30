import Section from "@/components/layout/Section";
import TimeComponent from "@/components/time/Time";
import Time from "@/time/Time";
import KeyValueSection from "@/components/layout/KeyValueSection";
import TimePicker from "@/components/primitives/control/TimePicker";
import Checkbox from "@/components/primitives/control/Checkbox";
import { SemanticKeys } from "@/shortcuts/SemanticKeys";

type TimeStampInfoProps = {
    openTimeStamp: Time | undefined,
    openOrCloseTime: Time | undefined,
    onOpenOrCloseTimeChange: (timeStamp: Time | undefined) => void,
    useCurrentTimeAsOpenOrCloseTime: boolean,
    onUseCurrentTimeAsOpenOrCloseTimeChange: (useNow: boolean) => void
    currentTime: Time,
    isTimePickerDisabled?: boolean,
    className?: string,
    onRequestStamp?: () => void,
    getLatestEndTimeOfSchedule: () => Time | undefined
}

export default function TimeStampControl(props: TimeStampInfoProps) {

    return (
        <div className={`flex flex-col gap-2.5 ${props.className}`}>
            {
                props.openTimeStamp
                    ? <KeyValueSection
                        first={'offener Zeitstempel'}
                        second={<><TimeComponent time={props.openTimeStamp}/> - ...</>}
                    />
                    : <Section className={'flex justify-center italic'}>
                        Kein offener Zeitstempel vorhanden
                    </Section>
            }
            <div className={'flex flex-row items-center justify-center'}>
                Zeitstempel { props.openTimeStamp ? 'schließen' : 'öffnen'}:
                <TimePicker
                    className={'mx-2.5'}
                    value={props.openOrCloseTime}
                    onValueChange={props.onOpenOrCloseTimeChange}
                    disabled={props.isTimePickerDisabled}
                    onKeyUp={{
                        [SemanticKeys.SUBMIT]: { runAndBlur: props.onRequestStamp },
                        [SemanticKeys.SET_TO_CURRENT_TIME]: { runAndBlur: () => props.onUseCurrentTimeAsOpenOrCloseTimeChange(true) },
                        [SemanticKeys.SET_TO_ADJACENT]: { setValue: props.getLatestEndTimeOfSchedule() }
                    }}
                />
                (
                <Checkbox
                    label={'aktuelle Zeit'}
                    value={props.useCurrentTimeAsOpenOrCloseTime}
                    setValue={props.onUseCurrentTimeAsOpenOrCloseTimeChange}
                    overrideMargin
                    checkboxClassName={'ml-1.5 mr-2.5'}
                />
                )
            </div>
        </div>
    );

}