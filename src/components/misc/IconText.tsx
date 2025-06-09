import { ReactNode } from "react";

export default function IconText(props: { icon: ReactNode, text: string, className?: string, overrideGap?: boolean }) {

    return (
        <div className={`flex flex-row items-center ${!props.overrideGap && 'gap-1'} ${props.className}`}>
            {props.icon}
            {props.text}
        </div>
    );

}
