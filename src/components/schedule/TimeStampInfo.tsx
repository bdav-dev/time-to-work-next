import Section from "@/components/layout/Section";
import TimeComponent from "@/components/time/Time";
import Time from "@/time/Time";
import KeyValueSection from "@/components/layout/KeyValueSection";

type TimeStampInfoProps = {
    openTimeStamp: Time | undefined,
    className?: string;
}

export default function TimeStampInfo(props: TimeStampInfoProps) {

    return (
        <div className={`flex flex-col gap-2.5 ${props.className}`}>
            {
                props.openTimeStamp
                    ? <KeyValueSection
                        first={'Offener Zeitstempel'}
                        second={<><TimeComponent time={props.openTimeStamp}/> - ...</>}
                    />
                    : <Section className={'flex justify-center italic'}>
                        Kein offener Zeitstempel vorhanden
                    </Section>
            }
        </div>
    );

}