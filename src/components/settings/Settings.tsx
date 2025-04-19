import Setting, { SettingProps } from "@/components/settings/Setting";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import { ReactNode } from "react";


type SettingSection = {
    title?: ReactNode,
    settings: SettingProps[]
}

type SettingsProps = {
    settingSections: (SettingSection | undefined)[],
    className?: string,
    trailingHorizontalRuler?: boolean
}

export default function Settings(props: SettingsProps) {
    return (
        <div className={props.className}>
            {
                props.settingSections
                    .filter(section => section != undefined)
                    .map(
                        (section, sectionIndex) => (
                            <div key={sectionIndex}>
                                {
                                    <div className={'flex flex-row items-center gap-2.5 px-1 min-h-8'}>
                                        {
                                            section.title &&
                                            <div className={'text-xl font-bold'}>
                                                {section.title}
                                            </div>
                                        }
                                        <HorizontalRuler className={'flex-1'}/>
                                    </div>
                                }
                                {
                                    section.settings.map(
                                        (setting, settingIndex) => (
                                            <Setting key={settingIndex} {...setting}/>
                                        )
                                    )
                                }
                            </div>
                        )
                    )
            }
            {
                props.trailingHorizontalRuler &&
                <div className={'flex items-center px-1 h-8'}>
                    <HorizontalRuler className={'flex-1'}/>
                </div>
            }
        </div>
    );
}
