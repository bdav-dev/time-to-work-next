import { ReactNode } from "react";


export type SettingProps = {
    label: ReactNode,
    setting: ((disabled: boolean) => ReactNode) | ReactNode,
    tooltip?: ReactNode,
    disabled?: boolean,
    noPadding?: boolean
}

export default function Setting(props: SettingProps) {
    return (
        <div className={`flex flex-row justify-between items-center ${!props.noPadding && 'py-3 px-4'}`}>
            <div className={`${props.disabled && 'opacity-60'}`}>
                {props.label}
            </div>
            {
                props.tooltip &&
                <Tooltip className={`ml-2 ${props.disabled && 'opacity-60 pointer-events-none'}`}>
                    {props.tooltip}
                </Tooltip>
            }

            <hr className={`flex-1 mx-3.5 border-neumorphic-300 dark:border-neumorphic-700 ${props.disabled && 'opacity-60'}`}/>

            <div className={'flex flex-row items-center gap-1'}>
                {
                    typeof props.setting === 'function'
                        ? props.setting(props.disabled ?? false)
                        : props.setting
                }
            </div>
        </div>
    );
}

function Tooltip({ className, children }: { className?: string, children?: ReactNode }) {
    return (
        <div
            className={`
                ${className}
                size-7
                rounded-full border-2
                border-neumorphic-400 dark:border-neumorphic-500 
                text-neumorphic-700 dark:text-neumorphic-200
                cursor-help
                select-none
                relative
                flex justify-center items-center
                group
            `}
        >
            <div className={`
                absolute
                group-hover:visible invisible
                group-hover:opacity-100 opacity-0
                group-hover:pl-2.5 pl-0
                group-hover:pr-0 pr-2.5
                right-0
                transition-all
                top-1/2
                translate-x-full -translate-y-1/2
                w-max max-w-[30rem]
            `}>
                <div className={`
                        transition-all
                        text-left text-sm p-2.5
                        border rounded-lg
                        drop-shadow-lg
                        select-text
                        dark:bg-neumorphic-850 bg-neumorphic-100
                        dark:border-neumorphic-700 border-neumorphic-400
                    `}
                >
                    {children}
                </div>
            </div>
            <div className={'font-bold text-xl leading-none'}>
                ?
            </div>
        </div>
    );
}
