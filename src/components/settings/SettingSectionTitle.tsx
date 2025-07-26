import HorizontalRuler from "@/components/layout/HorizontalRuler";
import { ReactNode } from "react";


type SettingsSectionTitleProps = {
    title?: ReactNode,
    hideHorizontalRuler?: boolean,
    className?: string
}

export default function SettingSectionTitle(props: SettingsSectionTitleProps) {
    return (
        <div className={`flex flex-row items-center gap-2.5 px-1 min-h-8 ${props.className}`}>
            {
                props.title &&
                <div className={'text-xl font-bold'}>
                    {props.title}
                </div>
            }
            {
                !props.hideHorizontalRuler &&
                <HorizontalRuler className={'flex-1'}/>
            }
        </div>
    );
}