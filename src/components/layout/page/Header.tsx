import VerticalRuler from "@/components/layout/VerticalRuler";
import Section from "@/components/layout/section/Section";
import TimeComponent from "@/components/time/Time";
import Elevation from "@/components/layout/Elevation";
import { useContext } from "react";
import { TimeContext } from "@/contexts/TimeContext";
import Menu from "@/components/primitives/Menu";
import { useTheme } from "@/hooks/UseTheme";
import IconText from "@/components/misc/IconText";
import MaterialSymbol, { MaterialSymbols } from "@/icons/material/MaterialSymbol";


type HeaderProps = {
    onSettingsButtonClick: () => void,
    onAboutButtonClick: () => void,
    onKeyboardShortcutButtonClick: () => void,
}

export default function Header(props: HeaderProps) {
    const now = useContext(TimeContext);
    const { theme, toggleTheme } = useTheme();

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
                                icon={<MaterialSymbol symbol={{ dark: MaterialSymbols.DARK_MODE, light: MaterialSymbols.LIGHT_MODE }[theme]}/>}
                                text={'Farbschema'}
                                className={"w-full justify-center"}
                            />,
                            action: () => toggleTheme(),
                            closeMenuAfterAction: false
                        }
                    ]
                ]}
            >
                <MaterialSymbol className={'text-[1.2em]'} symbol={MaterialSymbols.MENU} weight={300}/>
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
