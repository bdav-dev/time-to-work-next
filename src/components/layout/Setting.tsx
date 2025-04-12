import { ReactNode } from "react";


export type SettingProps = {
    label: string | ReactNode,
    setting: string | ReactNode
}

export default function Setting(props: SettingProps) {
    return (
        <div className={'flex flex-row justify-between items-center py-3 px-4'}>
            <div>
                {props.label}
            </div>

            <hr className={'flex-1 mx-3.5 border-neumorphic-200 dark:border-neumorphic-700'}/>

            <div className={'flex flex-row items-center gap-5'}>
                {props.setting}
            </div>
        </div>
    );
}
