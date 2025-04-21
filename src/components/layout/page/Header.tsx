import ThemeToggle from "@/components/theme/ThemeToggle";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Section from "@/components/layout/Section";
import TimeComponent from "@/components/time/Time";
import Elevation from "@/components/layout/Elevation";
import Time from "@/time/Time";
import SettingsButton from "../../settings/SettingsButton";


type HeaderProps = {
    time: Time,
    onSettingsButtonClick: () => void
}

export default function Header(props: HeaderProps) {

    return (
        <Elevation
            overridePadding overrideMargin overrideRounded
            className={'w-fit p-5 rounded-br-2xl flex items-center gap-6 mb-4'}
        >
            <div className={'flex flex-row items-center gap-2'}>
                <ThemeToggle overrideMargin/>
                <SettingsButton onClick={props.onSettingsButtonClick}/>
            </div>

            <VerticalRuler className={'h-8'}/>

            <div>
                <div className={'text-2xl font-bold'}>time-to-work</div>
                Arbeitszeitdashboard
            </div>

            <VerticalRuler className={'h-8'}/>

            <Section className={'text-xl font-bold flex items-center px-5'}>
                <TimeComponent time={props.time}/>
            </Section>

        </Elevation>
    );
}
