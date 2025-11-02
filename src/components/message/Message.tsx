import { Message as Msg, MessageTypeToStatusIndicator } from "@/contexts/MessageContext";
import { CSSProperties } from "react";
import StatusIndicator from "@/components/misc/StatusIndicator";
import MaterialSymbol from "@/components/icon/MaterialSymbol";
import { MaterialSymbols } from "@/icon/MaterialSymbols";

type MessageProps = {
    message: Msg,
    progressBarStyles?: CSSProperties,
    onClick?: () => void,
    onRequestClose?: () => void,
    style?: CSSProperties,
    className?: string
}

export default function Message(props: MessageProps) {
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
            onClick={props.onClick}
        >
            <div className={'flex flex-row items-center gap-2'}>
                {
                    props.message.type &&
                    <StatusIndicator status={MessageTypeToStatusIndicator[props.message.type]}/>
                }

                <div className={'font-bold overflow-ellipsis whitespace-nowrap overflow-hidden'}>
                    {props.message.title}
                </div>

                <button onClick={props.onRequestClose} className={'ml-auto'}>
                    <MaterialSymbol symbol={MaterialSymbols.CLOSE}/>
                </button>
            </div>

            <div>
                {props.message.body}
            </div>

            <div
                style={props.progressBarStyles}
                className={'absolute bottom-0 left-0 h-1 bg-neumorphic-400 dark:bg-neumorphic-500'}
            />
        </div>
    );
}
