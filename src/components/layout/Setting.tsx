import { ReactNode } from "react";


export type SettingProps = {
    label: ReactNode,
    setting: ((disabled: boolean) => ReactNode) | ReactNode,
    disabled?: boolean
}

export default function Setting(props: SettingProps) {
    return (
        <div className={'flex flex-row justify-between items-center py-3 px-4'}>
            <div className={`${props.disabled && 'opacity-60'}`}>
                {props.label}
            </div>

            <hr className={`flex-1 mx-3.5 border-neumorphic-200 dark:border-neumorphic-700 ${props.disabled && 'opacity-60'}`}/>

            <div className={'flex flex-row items-center gap-5'}>
                {
                    typeof props.setting === 'function'
                        ? props.setting(props.disabled ?? false)
                        : props.setting
                }
            </div>
        </div>
    );
}
