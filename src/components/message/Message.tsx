import { Message as Msg, MessageType } from "@/contexts/MessageContext";
import { CSSProperties } from "react";
import StatusIndicator, { Status } from "@/components/StatusIndicator";

type MessageProps = {
    message: Msg,
    progressBarStyles?: CSSProperties,
    onClick?: () => void,
    onRequestClose?: () => void,
    style?: CSSProperties
}

const MessageTypeToStatusIndicatorMap: { [key in MessageType]: Status } = {
    error: 'red',
    success: 'green',
    warning: 'yellow',
}

export default function Message(props: MessageProps) {
    return (
        <div
            className={`
                relative min-w-60 max-w-[30rem]
                p-3.5
                bg-neumorphic-50 dark:bg-neumorphic-850
                drop-shadow-xl rounded-2xl overflow-hidden
            `}
            style={props.style}
            onClick={props.onClick}
        >
            <div className={'flex flex-row items-center gap-2'}>
                {
                    props.message.type &&
                    <StatusIndicator status={MessageTypeToStatusIndicatorMap[props.message.type]}/>
                }

                <div className={'font-bold overflow-ellipsis whitespace-nowrap overflow-hidden'}>
                    {props.message.title}
                </div>

                <button onClick={props.onRequestClose} className={'ml-auto'}>
                    [X]
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
