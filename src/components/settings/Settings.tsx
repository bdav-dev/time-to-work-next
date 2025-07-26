import Setting, { SettingProps } from "@/components/settings/Setting";
import HorizontalRuler from "@/components/layout/HorizontalRuler";
import { ReactNode } from "react";
import SettingSectionTitle from "@/components/settings/SettingSectionTitle";


type SettingSection = {
    title?: ReactNode,
    hideHorizontalRuler?: boolean,
    settings: ReactNode | SettingProps[]
}

type SettingsProps = {
    sections: (SettingSection | undefined)[],
    className?: string,
    trailingHorizontalRuler?: boolean
}

export default function Settings(props: SettingsProps) {
    return (
        <div className={props.className}>
            {
                props.sections
                    .filter(section => section != undefined)
                    .map(
                        (section, sectionIndex) => (
                            <div key={sectionIndex}>
                                {
                                    (section?.title || !section?.hideHorizontalRuler) &&
                                    <SettingSectionTitle
                                        title={section.title}
                                        hideHorizontalRuler={section.hideHorizontalRuler}
                                    />
                                }
                                {
                                    Array.isArray(section.settings)
                                        ? section.settings.map(
                                            (setting, settingIndex) => (
                                                <Setting key={settingIndex} {...setting}/>
                                            )
                                        )
                                        : section.settings
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
