import VerticalRuler from "@/components/layout/VerticalRuler";
import Section from "@/components/layout/section/Section";
import TimeComponent from "@/components/time/Time";
import Elevation from "@/components/layout/Elevation";
import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import Menu from "@/components/primitives/Menu";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import { useTheme } from "@/hooks/UseTheme";
import IconText from "@/components/misc/IconText";


type HeaderProps = {
    onSettingsButtonClick: () => void,
    onAboutButtonClick: () => void,
    onKeyboardShortcutButtonClick: () => void,
}

export default function Header(props: HeaderProps) {
    const now = useContext(TimeContext);
    const { darkTheme, setDarkTheme } = useTheme();

    return (
        <Elevation
            overridePadding overrideMargin overrideRounded
            className={'w-fit p-5 rounded-br-2xl flex items-center gap-6 mb-4'}
        >
            <Menu
                overrideMargin
                className={"ml-1"}
                circular
                buttonClassName={"size-12"}
                menuPosition={"bottom"}
                sections={[
                    [
                        {
                            label: <IconText
                                icon={<MaterialSymbol symbol={MaterialSymbols.SETTINGS}/>}
                                text={'Einstellungen'}
                            />,
                            action: props.onSettingsButtonClick
                        },
                        {
                            label: <IconText
                                icon={<MaterialSymbol symbol={MaterialSymbols.KEYBOARD}/>}
                                text={'Tastenkürzel'}
                            />,
                            action: props.onKeyboardShortcutButtonClick
                        },
                        {
                            label: <IconText
                                icon={<MaterialSymbol symbol={MaterialSymbols.INFO}/>}
                                text={'Über'}
                            />,
                            action: props.onAboutButtonClick
                        }
                    ],
                    [
                        {
                            label: <IconText
                                icon={<MaterialSymbol symbol={darkTheme ? MaterialSymbols.DARK_MODE : MaterialSymbols.LIGHT_MODE}/>}
                                text={'Farbschema'}
                                className={"w-full justify-center"}
                            />,
                            action: () => setDarkTheme(isDark => !isDark),
                            closeMenuAfterAction: false
                        }
                    ]
                ]}
            >
                <MaterialSymbol className={'size-7'} symbol={MaterialSymbols.MENU} weight={300}/>
            </Menu>

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
