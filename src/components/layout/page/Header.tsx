import ThemeToggle from "@/components/theme/ThemeToggle";
import VerticalRuler from "@/components/layout/VerticalRuler";
import Section from "@/components/layout/Section";
import TimeComponent from "@/components/time/Time";
import Elevation from "@/components/layout/Elevation";
import SettingsButton from "../../settings/SettingsButton";
import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";


type HeaderProps = {
    onSettingsButtonClick: () => void
}

export default function Header(props: HeaderProps) {
    const now = useContext(TimeContext);

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
                <TimeComponent time={now}/>
            </Section>

        </Elevation>
    );
}
