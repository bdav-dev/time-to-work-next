import MaterialSymbol from "@/components/icon/MaterialSymbol";
import { MaterialSymbols } from "@/icon/MaterialSymbols";
import { CSSProperties } from "react";
import { Notification as NotificationType } from "@/contexts/NotificationContext";


type NotificationProps = {
    style?: CSSProperties,
    className?: string,
    notification: NotificationType,
    onRequestClose?: () => void
}

export default function Notification(props: NotificationProps) {
    return (
        <div
            className={`
                relative min-w-60 max-w-[30rem]
                p-3.5
                bg-neumorphic-50 dark:bg-neumorphic-850
                shadow-xl rounded-2xl overflow-hidden
                shadow-white-neumorphic-accent-shadow dark:shadow-gray-neumorphic-accent-shadow
                ${props.className}
            `}
            style={props.style}
        >
            <div className={'flex flex-row items-center gap-2'}>

                <div className={'font-bold overflow-ellipsis whitespace-nowrap overflow-hidden'}>
                    {props.notification.title}
                </div>

                <button onClick={props.onRequestClose} className={'ml-auto'}>
                    <MaterialSymbol symbol={MaterialSymbols.CLOSE}/>
                </button>
            </div>

            <div>
                {props.notification.body}
            </div>
        </div>
    );
}